
import { getSessionId } from './session';
import { performLegalAnalysis } from '@/lib/juridika/legalAnalyzer';

// Create analysis for documents using new AI backend
export const createAnalysis = async (documentIds: string[]) => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    console.log('Creating analysis for documents:', documentIds);
    
    const analysisType = documentIds.length === 1 ? 'single_document' : 'comparative';
    
    const result = await performLegalAnalysis({
      documentIds,
      sessionId,
      analysisType
    });
    
    return result?.analysisId || null;
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
};

// Update analysis results (now handled by the AI backend)
export const updateAnalysisResults = async (analysisId: string, analysisArgs: any) => {
  try {
    console.log(`Analysis ${analysisId} completed with AI backend`);
    return true;
  } catch (error) {
    console.error('Error updating analysis results:', error);
    return false;
  }
};
