
import { useState } from 'react';
import { getDocumentById } from '@/lib/supabase';
import { performLegalAnalysis } from '@/lib/juridika/legalAnalyzer';
import { getSessionId } from '@/lib/supabase/session';
import { generatePdfReport } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/lib/supabase/types';

export const useDocumentAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const startAnalysis = async (selectedDocuments: string[]) => {
    if (selectedDocuments.length === 0) return;
    
    setAnalyzing(true);
    setResults(null);
    setPdfUrl(null);
    
    try {
      const sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error('Ingen session tillgänglig');
      }

      // Determine analysis type based on number of documents
      const analysisType = selectedDocuments.length === 1 ? 'single_document' : 'comparative';
      
      console.log('Starting legal analysis for documents:', selectedDocuments);
      
      // Perform AI-powered legal analysis
      const analysisResult = await performLegalAnalysis({
        documentIds: selectedDocuments,
        sessionId,
        analysisType
      });
      
      if (!analysisResult) {
        throw new Error('Kunde inte genomföra juridisk analys');
      }
      
      // Set results
      setResults(analysisResult.analysis);
      
      // Generate PDF
      const pdfDataUrl = generatePdfReport(analysisResult.analysis);
      setPdfUrl(pdfDataUrl);
      
      toast({
        title: "Juridisk analys klar",
        description: "AI-analys med svensk rättslig kontext har slutförts framgångsrikt.",
      });
      
      return analysisResult.analysis;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysfel",
        description: "Ett fel uppstod under den juridiska analysen. Försök igen senare.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzing,
    results,
    pdfUrl,
    startAnalysis,
    setResults,
    setPdfUrl
  };
};
