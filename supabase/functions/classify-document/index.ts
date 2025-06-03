
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentClassification {
  documentType: string;
  legalArea: string;
  urgencyLevel: number;
  complexityScore: number;
  confidenceScore: number;
  keyEntities: any;
  detectedClaims: string[];
  classificationMetadata: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, documentText } = await req.json();
    
    if (!documentId || !documentText) {
      throw new Error('Document ID and text are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the classification prompt template
    const { data: promptData, error: promptError } = await supabase
      .from('legal_prompts')
      .select('*')
      .eq('prompt_name', 'document_classifier_swedish')
      .eq('is_active', true)
      .single();

    if (promptError || !promptData) {
      throw new Error('Classification prompt template not found');
    }

    // Prepare the prompt with document text
    const prompt = promptData.prompt_template.replace('{document_text}', documentText.substring(0, 4000));

    console.log('Calling OpenAI for document classification...');
    
    // Call OpenAI for classification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: promptData.system_context },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Classification Response:', aiResponse);

    // Parse AI response (expect JSON format)
    let classificationResult: DocumentClassification;
    try {
      const parsedResponse = JSON.parse(aiResponse);
      classificationResult = {
        documentType: parsedResponse.dokumenttyp || 'unknown',
        legalArea: parsedResponse.juridiskt_område || 'general',
        urgencyLevel: parsedResponse.brådskande_grad || 1,
        complexityScore: parsedResponse.komplexitet || 1,
        confidenceScore: parsedResponse.säkerhet || 0.5,
        keyEntities: parsedResponse.viktiga_datum || {},
        detectedClaims: parsedResponse.rättsliga_anspråk || [],
        classificationMetadata: parsedResponse
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback classification
      classificationResult = {
        documentType: 'unknown',
        legalArea: 'general',
        urgencyLevel: 1,
        complexityScore: 1,
        confidenceScore: 0.3,
        keyEntities: {},
        detectedClaims: [],
        classificationMetadata: { raw_response: aiResponse }
      };
    }

    // Store classification in database
    const { data: classificationData, error: classificationError } = await supabase
      .from('document_classifications')
      .insert({
        document_id: documentId,
        document_type: classificationResult.documentType,
        legal_area: classificationResult.legalArea,
        urgency_level: classificationResult.urgencyLevel,
        complexity_score: classificationResult.complexityScore,
        confidence_score: classificationResult.confidenceScore,
        key_entities: classificationResult.keyEntities,
        detected_claims: classificationResult.detectedClaims,
        classification_metadata: classificationResult.classificationMetadata
      })
      .select()
      .single();

    if (classificationError) {
      console.error('Error storing classification:', classificationError);
      throw new Error('Failed to store classification results');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        classification: classificationData,
        aiResponse: classificationResult
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
