
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentUploader from '@/components/DocumentUploader';
import { Button } from '@/components/ui/button';
import { getSessionDocuments } from '@/lib/supabase';
import { executeMigrations, setupStorage } from '@/lib/supabaseMigrations';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '@/lib/supabase/types';
import { ExternalLink, Database, Upload as UploadIcon, FileText } from 'lucide-react';

const Upload = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load documents on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing application...');
        
        // Initialize Supabase tables and storage
        await executeMigrations();
        await setupStorage();
        
        console.log('Database setup completed successfully');
        setInitializationError(null);
      } catch (error) {
        console.error('Error initializing app:', error);
        const errorMessage = 'Kunde inte ansluta till databasen. Kontrollera din internetanslutning.';
        setInitializationError(errorMessage);
        
        toast({
          title: "Anslutningsfel",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Load documents regardless of initialization status
      await loadDocuments();
      setLoading(false);
    };
    
    initializeApp();
  }, [toast]);
  
  // Load user's documents
  const loadDocuments = async () => {
    try {
      console.log('Loading session documents...');
      const docs = await getSessionDocuments();
      setDocuments(docs || []);
      console.log('Loaded', docs?.length || 0, 'documents');
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast({
        title: "Laddningsfel",
        description: "Kunde inte ladda dokument. Försök igen senare.",
        variant: "destructive",
      });
    }
  };
  
  // Handle upload complete
  const handleUploadComplete = async (documentId: string) => {
    console.log('Upload completed for document:', documentId);
    await loadDocuments();
    
    toast({
      title: "Uppladdning klar",
      description: "Dokumentet har laddats upp och behandlats",
    });
  };
  
  // Navigate to analyze page
  const handleContinue = () => {
    navigate('/analyze');
  };

  // Handle NJ.se integration placeholder
  const handleNjIntegration = () => {
    toast({
      title: "NJ.se Integration",
      description: "Denna funktion kommer att implementeras i en framtida version. Den kommer att möjliggöra automatisk hämtning av rättsfall och doktrin från Norstedts Juridik.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col juridika-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Initialiserar applikation...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col juridika-background">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="juridika-container">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Ladda upp juridiska dokument
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Ladda upp dina juridiska dokument för analys av motargument och juridiska påståenden. 
                Stödda format inkluderar PDF, DOCX, RTF, HTML och TXT.
              </p>
            </div>

            {/* Error Alert */}
            {initializationError && (
              <div className="alert alert-error mb-6">
                <strong>Anslutningsfel:</strong> {initializationError}
              </div>
            )}
            
            {/* Upload Section */}
            <div className="juridika-card mb-8">
              <div className="flex items-center mb-6">
                <UploadIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Ladda upp dokument
                </h2>
              </div>
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </div>

            {/* NJ.se Integration Section */}
            <div className="juridika-card mb-8">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-emerald-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Juridisk databas
                </h2>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <ExternalLink className="h-8 w-8 text-slate-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 mb-2">
                      Norstedts Juridik Integration
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Hämta rättsfall, doktrin och prejudikat direkt från NJ.se för en mer omfattande juridisk analys.
                    </p>
                    <Button
                      onClick={handleNjIntegration}
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Hämta data från NJ.se
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500 bg-slate-100 rounded p-2">
                  <strong>Kommande funktion:</strong> Denna integration kommer att möjliggöra automatisk sökning och import av relevanta rättsfall baserat på dina dokument.
                </div>
              </div>
            </div>
            
            {/* Documents List Section */}
            <div className="juridika-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-emerald-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Uppladdade dokument ({documents.length})
                  </h2>
                </div>
              </div>
              
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg mb-2">
                      Inga dokument uppladdade än
                    </p>
                    <p className="text-slate-400">
                      Ladda upp dokument för att börja med juridisk analys
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.map(doc => (
                        <div 
                          key={doc.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate" title={doc.filename}>
                                {doc.filename}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {new Date(doc.created_at).toLocaleDateString('sv-SE', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {doc.content && (
                                <p className="text-xs text-slate-400 mt-1">
                                  {doc.content.length > 100 ? `${doc.content.substring(0, 100)}...` : doc.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleContinue}
                        className="juridika-btn-primary"
                        disabled={documents.length === 0}
                      >
                        Fortsätt till analys
                        <span className="ml-2">→</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Information Section */}
            <div className="mt-6 alert alert-info">
              <p className="text-sm">
                <strong>OBS:</strong> För utvecklings- och testningsändamål används temporärt anonym åtkomst.
                I produktionsmiljö kommer striktare behörighetsregler att implementeras. Alla uppladdade dokument 
                lagras säkert och bearbetas lokalt för maximal integritet.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
