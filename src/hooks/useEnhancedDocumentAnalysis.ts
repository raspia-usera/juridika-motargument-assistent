
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeSwedishLegalDocument, detectLegalConcepts } from '@/lib/juridika/swedishLegalAnalyzer';
import { simulateSwedishLegalResources } from '@/lib/juridika/swedishLegalResources';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedDocumentAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [detectedConcepts, setDetectedConcepts] = useState<string[]>([]);
  const [legalResources, setLegalResources] = useState<any[]>([]);
  const { toast } = useToast();

  const analyzeDocument = async (documentId: string, content: string) => {
    if (!content?.trim()) {
      toast({
        title: "Ingen innehåll att analysera",
        description: "Dokumentet verkar vara tomt eller kunde inte läsas",
        variant: "destructive"
      });
      return null;
    }

    setAnalyzing(true);
    try {
      console.log('Starting enhanced document analysis for:', documentId);

      // 1. Perform Swedish legal analysis
      const legalAnalysis = await analyzeSwedishLegalDocument(content);
      
      // 2. Detect legal concepts
      const concepts = await detectLegalConcepts(content);
      setDetectedConcepts(concepts);

      // 3. Get relevant legal resources
      const resources = await simulateSwedishLegalResources(
        content.substring(0, 200), // Use first 200 chars as query
        legalAnalysis?.legalAreas?.[0]
      );
      setLegalResources(resources);

      // 4. Store comprehensive analysis in ai_analyses table with proper type conversion
      const analysisData = {
        session_id: 'public-session',
        document_ids: [documentId],
        analysis_type: 'enhanced_swedish_legal',
        legal_area: legalAnalysis?.legalAreas?.[0] || 'allmän juridik',
        analysis_results: {
          ...(legalAnalysis || {}),
          detectedConcepts: concepts,
          legalResources: resources.map(r => ({
            source: r.source,
            type: r.type,
            title: r.title,
            description: r.description,
            reference: r.reference || null,
            url: r.url || null,
            relevance: r.relevance
          }))
        } as any,
        confidence_metrics: {
          analysis_confidence: legalAnalysis?.confidence || 0.5,
          concept_detection_confidence: concepts.length > 0 ? 0.8 : 0.3
        } as any
      };

      const { data: analysisRecord, error: analysisError } = await supabase
        .from('ai_analyses')
        .insert(analysisData)
        .select()
        .single();

      if (analysisError) {
        console.error('Error storing analysis:', analysisError);
      }

      // 5. Update document classification if analysis was successful
      if (legalAnalysis && analysisRecord) {
        const classificationData = {
          document_id: documentId,
          document_type: legalAnalysis.legalAreas?.[0] || 'juridiskt dokument',
          legal_area: legalAnalysis.legalAreas?.[0] || 'allmän juridik',
          urgency_level: legalAnalysis.riskAssessment?.level === 'high' ? 3 : 
                        legalAnalysis.riskAssessment?.level === 'medium' ? 2 : 1,
          complexity_score: Math.min(Math.max(Math.floor(content.length / 500), 1), 5),
          confidence_score: legalAnalysis.confidence,
          detected_claims: [
            ...legalAnalysis.keyArguments.for,
            ...legalAnalysis.keyArguments.against
          ],
          key_entities: {
            legalConcepts: concepts,
            relevantLaws: legalAnalysis.relevantLaws.map(law => law.law)
          } as any,
          classification_metadata: {
            analysisId: analysisRecord.id,
            processingDate: new Date().toISOString()
          } as any
        };

        const { error: classificationError } = await supabase
          .from('document_classifications')
          .upsert(classificationData, {
            onConflict: 'document_id'
          });

        if (classificationError) {
          console.error('Error updating classification:', classificationError);
        }
      }

      setAnalysis(legalAnalysis);
      
      toast({
        title: "Förbättrad analys klar",
        description: `Identifierade ${concepts.length} juridiska begrepp och ${resources.length} relevanta resurser`,
      });

      return legalAnalysis;
    } catch (error) {
      console.error('Enhanced analysis error:', error);
      toast({
        title: "Analysfel",
        description: "Ett fel uppstod under den förbättrade analysen",
        variant: "destructive"
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const getAnalysisHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('session_id', 'public-session')
        .order('created_at', { ascending: false })
        .limit(10);

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

  return {
    analyzing,
    analysis,
    detectedConcepts,
    legalResources,
    analyzeDocument,
    getAnalysisHistory,
    setAnalysis,
    setDetectedConcepts,
    setLegalResources
  };
};
