
import { useState } from 'react';
import { getDocumentById, createAnalysis, updateAnalysisResults } from '@/lib/supabase';
import { generateCounterarguments } from '@/lib/documentProcessor';
import { generatePdfReport } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem, AnalysisResult } from '@/lib/supabase/types';

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
      // Get content of selected documents
      const documentsWithContent = [];
      for (const docId of selectedDocuments) {
        const doc = await getDocumentById(docId);
        if (doc && doc.content) {
          documentsWithContent.push({
            id: doc.id,
            content: doc.content
          });
        }
      }
      
      // Create analysis record
      const analysisId = await createAnalysis(selectedDocuments);
      
      if (!analysisId) {
        throw new Error('Kunde inte skapa analys');
      }
      
      // Generate counterarguments
      const analysisResults = await generateCounterarguments(documentsWithContent);
      
      if (!analysisResults) {
        throw new Error('Kunde inte generera motargument');
      }
      
      // Update analysis with results
      await updateAnalysisResults(analysisId, analysisResults);
      
      // Set results
      setResults(analysisResults);
      
      // Generate PDF
      const pdfDataUrl = generatePdfReport(analysisResults);
      setPdfUrl(pdfDataUrl);
      
      toast({
        title: "Analys klar",
        description: "Analysen har slutförts framgångsrikt.",
      });
      
      return analysisResults;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysfel",
        description: "Ett fel uppstod under analysen. Försök igen senare.",
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
