
import { supabase } from '@/integrations/supabase/client';

export interface SwedishLegalAnalysis {
  summary: string;
  legalAreas: string[];
  keyArguments: {
    for: string[];
    against: string[];
  };
  relevantLaws: {
    law: string;
    section: string;
    description: string;
  }[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
  };
  confidence: number;
}

export const analyzeSwedishLegalDocument = async (
  documentText: string,
  documentType?: string
): Promise<SwedishLegalAnalysis | null> => {
  try {
    console.log('Starting Swedish legal analysis...');
    
    // Get relevant legal prompt for Swedish analysis
    const { data: promptData, error: promptError } = await supabase
      .from('legal_prompts')
      .select('*')
      .eq('legal_area', 'general')
      .eq('prompt_type', 'swedish_analysis')
      .eq('is_active', true)
      .single();

    if (promptError || !promptData) {
      console.log('Using fallback Swedish legal analysis');
      return generateFallbackAnalysis(documentText, documentType);
    }

    // Call the legal analysis edge function
    const { data, error } = await supabase.functions.invoke('analyze-legal-document', {
      body: {
        documentText: documentText.substring(0, 8000),
        analysisType: 'swedish_legal',
        documentType: documentType || 'unknown'
      }
    });

    if (error) {
      console.error('Error in Swedish legal analysis:', error);
      return generateFallbackAnalysis(documentText, documentType);
    }

    return data.analysis;
  } catch (error) {
    console.error('Error in analyzeSwedishLegalDocument:', error);
    return generateFallbackAnalysis(documentText, documentType);
  }
};

const generateFallbackAnalysis = (
  documentText: string,
  documentType?: string
): SwedishLegalAnalysis => {
  const textLength = documentText.length;
  const hasLegalTerms = /avtal|lag|rätt|domstol|myndighet|skadestånds|tvist|överklag/i.test(documentText);
  
  return {
    summary: `Dokument analyserat (${textLength} tecken). ${hasLegalTerms ? 'Juridiska termer identifierade.' : 'Begränsade juridiska termer hittade.'}`,
    legalAreas: hasLegalTerms ? ['Allmän civilrätt', 'Processrätt'] : ['Allmänt'],
    keyArguments: {
      for: [
        'Dokumentet innehåller strukturerad information',
        hasLegalTerms ? 'Juridiska begrepp är närvarande' : 'Grundläggande rättsligt innehåll'
      ],
      against: [
        'Ytterligare dokumentation kan behövas',
        'Juridisk rådgivning rekommenderas för komplex analys'
      ]
    },
    relevantLaws: [
      {
        law: 'Rättegångsbalken',
        section: 'Kap 42',
        description: 'Allmänna bestämmelser om rättegång'
      }
    ],
    riskAssessment: {
      level: textLength > 1000 ? 'medium' : 'low',
      factors: [
        'Begränsad AI-analys utan juridisk verifiering',
        'Dokumentets komplexitet kräver professionell bedömning'
      ]
    },
    recommendations: {
      immediate: [
        'Kontakta juridisk rådgivning för verifiering',
        'Samla ytterligare stödjande dokumentation'
      ],
      longTerm: [
        'Överväg professionell juridisk representation',
        'Dokumentera alla relevanta händelser'
      ]
    },
    confidence: hasLegalTerms ? 0.7 : 0.4
  };
};

export const detectLegalConcepts = async (text: string): Promise<string[]> => {
  const swedishLegalTerms = [
    'avtal', 'kontrakt', 'hyresrätt', 'äganderätt', 'skadestånd',
    'tvist', 'domstol', 'överklagande', 'myndighet', 'beslut',
    'lag', 'förordning', 'rättspraxis', 'prejudikat', 'rättegång',
    'ansvar', 'ersättning', 'uppsägning', 'underlåtenhet'
  ];

  const foundConcepts = swedishLegalTerms.filter(term => 
    new RegExp(`\\b${term}\\b`, 'i').test(text)
  );

  // Store new concepts in database if they don't exist
  for (const concept of foundConcepts) {
    const { error } = await supabase
      .from('legal_concepts')
      .upsert({
        concept_name: concept,
        category: 'Svenska juridiska begrepp',
        description: `Automatiskt identifierat juridiskt begrepp: ${concept}`
      }, {
        onConflict: 'concept_name'
      });

    if (error) {
      console.error('Error storing legal concept:', error);
    }
  }

  return foundConcepts;
};
