
import { getSessionId } from '@/lib/supabase/session';
import { performLegalAnalysis } from '@/lib/juridika/legalAnalyzer';

// Enhanced counterargument generation with legal knowledge
export const generateCounterarguments = async (documents: Array<{id: string, content: string}>) => {
  try {
    console.log('Generating counterarguments for', documents.length, 'documents');
    
    const sessionId = await getSessionId();
    if (!sessionId) {
      throw new Error('No session ID available');
    }

    const documentIds = documents.map(doc => doc.id);
    
    // Perform legal analysis using the new AI backend
    const analysisResult = await performLegalAnalysis({
      documentIds,
      sessionId,
      analysisType: 'counterargument'
    });

    if (!analysisResult) {
      throw new Error('Failed to generate legal analysis');
    }

    // Convert the analysis to the expected format
    return {
      claims: analysisResult.analysis.claims || [],
      analysis_mode: 'comparative'
    };
  } catch (error) {
    console.error('Error generating counterarguments:', error);
    return null;
  }
};
