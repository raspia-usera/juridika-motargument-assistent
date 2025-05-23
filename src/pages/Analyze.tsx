
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentSelector from '@/components/DocumentSelector';
import ArgumentCard from '@/components/ArgumentCard';
import { Button } from '@/components/ui/button';
import { getSessionDocuments, getDocumentById, createAnalysis, updateAnalysisResults } from '@/lib/supabase';
import { generateCounterarguments } from '@/lib/documentProcessor';
import { generatePdfReport, downloadPdfReport } from '@/lib/pdfExport';

interface Document {
  id: string;
  filename: string;
  mimetype: string;
  created_at: string;
  content?: string;
}

interface Claim {
  claim: string;
  counterarguments: {
    argument: string;
    strength: number;
    references: string[];
  }[];
}

interface AnalysisResult {
  claims: Claim[];
}

const Analyze = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getSessionDocuments();
        setDocuments(docs || []);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  // Start analysis
  const handleAnalyze = async () => {
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
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // Download PDF report
  const handleDownloadPdf = () => {
    if (results) {
      downloadPdfReport(results, 'juridisk-analys.pdf');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 bg-juridika-background">
        <div className="juridika-container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-juridika-charcoal">
              Analysera dokument
            </h1>
            
            <div className="juridika-card mb-8">
              {loading ? (
                <div className="p-8 text-center text-juridika-gray">
                  Laddar dokument...
                </div>
              ) : (
                <>
                  <DocumentSelector 
                    documents={documents}
                    selectedDocuments={selectedDocuments}
                    onSelect={handleDocumentSelect}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleAnalyze}
                      className="juridika-btn-primary"
                      disabled={selectedDocuments.length === 0 || analyzing}
                    >
                      {analyzing ? 'Analyserar...' : 'Analysera valda dokument'}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {analyzing && (
              <div className="juridika-card text-center">
                <div className="py-8">
                  <div className="animate-pulse">
                    <div className="h-4 bg-juridika-softpurple/50 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-juridika-softpurple/40 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-juridika-softpurple/30 rounded w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-juridika-gray mt-6">
                    Analyserar dokument och genererar motargument...
                  </p>
                </div>
              </div>
            )}
            
            {results && (
              <div className="space-y-8">
                <h2 className="text-xl font-medium text-juridika-charcoal">
                  Analysresultat
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results.claims.map((claim, index) => (
                    <ArgumentCard 
                      key={index}
                      claim={claim.claim}
                      counterarguments={claim.counterarguments}
                    />
                  ))}
                </div>
                
                <div className="juridika-card mt-8">
                  {pdfUrl && (
                    <div className="flex flex-col items-center p-4">
                      <h3 className="text-lg font-medium mb-4">PDF-rapport</h3>
                      <div className="mb-4">
                        <iframe 
                          src={pdfUrl} 
                          className="border rounded w-full"
                          style={{ height: '400px' }}
                          title="PDF-förhandsgranskning"
                        />
                      </div>
                      <Button 
                        onClick={handleDownloadPdf}
                        className="juridika-btn-secondary"
                      >
                        Ladda ner PDF-rapport
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-sm text-juridika-charcoal mt-4 p-4 bg-juridika-softpurple/10">
                    <strong>OBS:</strong> Detta är en testversion. Resultaten bör alltid granskas av en kvalificerad jurist.
                    Temporär anonym åtkomst används för testning. I produktion kommer striktare behörighetsregler att tillämpas.
                  </p>
                </div>
              </div>
            )}
            
            {!analyzing && documents.length === 0 && (
              <div className="juridika-card text-center">
                <p className="text-juridika-gray py-8">
                  Inga dokument tillgängliga för analys. 
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/upload')}
                    className="text-juridika-purple"
                  >
                    Ladda upp dokument först
                  </Button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
