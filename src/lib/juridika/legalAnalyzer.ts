
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/lib/supabase/types';

export interface LegalAnalysisRequest {
  documentIds: string[];
  sessionId: string;
  analysisType?: 'single_document' | 'comparative' | 'counterargument';
}

export interface LegalAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
  analysisId: string;
  processingTime: number;
}

export const performLegalAnalysis = async (request: LegalAnalysisRequest): Promise<LegalAnalysisResponse | null> => {
  try {
    console.log('Starting legal analysis for documents:', request.documentIds);
    
    const { data, error } = await supabase.functions.invoke('analyze-legal-document', {
      body: request
    });

    if (error) {
      console.error('Error calling analyze-legal-document function:', error);
      throw new Error(`Legal analysis failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error('Legal analysis was not successful');
    }

    console.log('Legal analysis completed successfully');
    return data;
  } catch (error) {
    console.error('Error in performLegalAnalysis:', error);
    return null;
  }
};

export const getAnalysisHistory = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('ai_analyses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAnalysisHistory:', error);
    return [];
  }
};
