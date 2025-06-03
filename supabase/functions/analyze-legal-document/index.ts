
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LegalAnalysis {
  claims: Array<{
    claim: string;
    counterarguments: Array<{
      argument: string;
      strength: number;
      references: string[];
      source: 'ai_generated' | 'legal_precedent';
    }>;
  }>;
  strengthAssessment: {
    overall_strength: number;
    key_strengths: string[];
    key_weaknesses: string[];
    risk_factors: string[];
  };
  nextSteps: {
    immediate_actions: string[];
    short_term_strategy: string[];
    long_term_strategy: string[];
    recommended_contacts: string[];
  };
  legalReferences: {
    applicable_laws: string[];
    relevant_precedents: string[];
    citations: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentIds, sessionId, analysisType = 'single_document' } = await req.json();
    
    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      throw new Error('Document IDs array is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const startTime = Date.now();

    // Get documents with their classifications
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select(`
        *,
        document_classifications (*)
      `)
      .in('id', documentIds);

    if (documentsError || !documents || documents.length === 0) {
      throw new Error('Failed to fetch documents');
    }

    console.log('Found documents:', documents.length);

    // Determine the primary legal area from classifications
    const legalAreas = documents
      .map(doc => doc.document_classifications?.[0]?.legal_area)
      .filter(Boolean);
    const primaryLegalArea = legalAreas[0] || 'general';

    // Get appropriate analysis prompt template
    const { data: promptData, error: promptError } = await supabase
      .from('legal_prompts')
      .select('*')
      .eq('legal_area', primaryLegalArea)
      .eq('prompt_type', 'analysis')
      .eq('is_active', true)
      .single();

    if (promptError || !promptData) {
      console.log('Specific prompt not found, using general analyzer');
      // Fallback to general analysis
      const { data: fallbackPrompt } = await supabase
        .from('legal_prompts')
        .select('*')
        .eq('legal_area', 'general')
        .eq('prompt_type', 'analysis')
        .eq('is_active', true)
        .single();
      
      if (!fallbackPrompt) {
        throw new Error('No analysis prompt template found');
      }
    }

    // Combine document content
    const documentTexts = documents
      .map(doc => `Dokument: ${doc.filename}\n${doc.content || 'Ingen textinnehåll tillgänglig'}`)
      .join('\n\n---\n\n');

    // Prepare analysis prompt
    const analysisPrompt = (promptData || fallbackPrompt).prompt_template
      .replace('{document_text}', documentTexts.substring(0, 8000));

    console.log('Calling OpenAI for legal analysis...');

    // Call OpenAI for analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: (promptData || fallbackPrompt).system_context + 
              `\n\nAnalystyp: ${analysisType}. Ge strukturerat svar med konkreta råd och laghänvisningar.`
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiAnalysis = data.choices[0].message.content;

    console.log('AI Analysis completed');

    // Generate next steps using specialized prompt
    const { data: nextStepsPrompt } = await supabase
      .from('legal_prompts')
      .select('*')
      .eq('prompt_name', 'next_steps_advisor')
      .eq('is_active', true)
      .single();

    let nextStepsAnalysis = '';
    if (nextStepsPrompt) {
      const urgencyLevel = Math.max(...documents.map(doc => 
        doc.document_classifications?.[0]?.urgency_level || 1
      ));

      const nextStepsPromptText = nextStepsPrompt.prompt_template
        .replace('{situation_summary}', aiAnalysis.substring(0, 1000))
        .replace('{legal_area}', primaryLegalArea)
        .replace('{urgency_level}', urgencyLevel.toString());

      const nextStepsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: nextStepsPrompt.system_context },
            { role: 'user', content: nextStepsPromptText }
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (nextStepsResponse.ok) {
        const nextStepsData = await nextStepsResponse.json();
        nextStepsAnalysis = nextStepsData.choices[0].message.content;
      }
    }

    // Structure the analysis results
    const structuredAnalysis: LegalAnalysis = {
      claims: [{
        claim: "Huvudsaklig rättslig position",
        counterarguments: [{
          argument: aiAnalysis,
          strength: 7,
          references: [],
          source: 'ai_generated'
        }]
      }],
      strengthAssessment: {
        overall_strength: 6,
        key_strengths: ["AI-genererad analys baserad på svensk lagstiftning"],
        key_weaknesses: ["Kräver juridisk verifiering"],
        risk_factors: ["Tidsgränser kan vara kritiska"]
      },
      nextSteps: {
        immediate_actions: nextStepsAnalysis ? [nextStepsAnalysis] : ["Kontakta juridisk rådgivning"],
        short_term_strategy: ["Samla ytterligare dokumentation"],
        long_term_strategy: ["Överväg rättslig representation"],
        recommended_contacts: ["Juridisk rådgivning", "Berörda myndigheter"]
      },
      legalReferences: {
        applicable_laws: [`${primaryLegalArea} - Svensk lagstiftning`],
        relevant_precedents: [],
        citations: []
      }
    };

    const processingTime = Date.now() - startTime;

    // Store analysis results
    const { data: analysisRecord, error: analysisError } = await supabase
      .from('ai_analyses')
      .insert({
        session_id: sessionId,
        document_ids: documentIds,
        analysis_type: analysisType,
        legal_area: primaryLegalArea,
        analysis_results: structuredAnalysis,
        strength_assessment: structuredAnalysis.strengthAssessment,
        next_steps: structuredAnalysis.nextSteps,
        legal_references: structuredAnalysis.legalReferences,
        confidence_metrics: { ai_confidence: 0.75 },
        processing_time_ms: processingTime
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw new Error('Failed to store analysis results');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: structuredAnalysis,
        analysisId: analysisRecord.id,
        processingTime
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-legal-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
