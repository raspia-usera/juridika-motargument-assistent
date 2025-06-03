
import { supabase } from '@/integrations/supabase/client';

export interface DocumentClassificationResult {
  id: string;
  documentType: string;
  legalArea: string;
  urgencyLevel: number;
  complexityScore: number;
  confidenceScore: number;
  keyEntities: any;
  detectedClaims: string[];
  classificationMetadata: any;
}

export const classifyDocument = async (documentId: string, content: string): Promise<DocumentClassificationResult | null> => {
  try {
    console.log('Classifying document:', documentId);
    
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: {
        documentId,
        documentText: content
      }
    });

    if (error) {
      console.error('Error calling classify-document function:', error);
      throw new Error(`Classification failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error('Classification was not successful');
    }

    console.log('Document classified successfully:', data.classification);
    return data.classification;
  } catch (error) {
    console.error('Error in classifyDocument:', error);
    return null;
  }
};

export const getDocumentClassification = async (documentId: string): Promise<DocumentClassificationResult | null> => {
  try {
    const { data, error } = await supabase
      .from('document_classifications')
      .select('*')
      .eq('document_id', documentId)
      .single();

    if (error) {
      console.error('Error fetching document classification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getDocumentClassification:', error);
    return null;
  }
};
