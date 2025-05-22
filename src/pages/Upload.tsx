
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentUploader from '@/components/DocumentUploader';
import { Button } from '@/components/ui/button';
import { getSessionDocuments } from '@/lib/supabase';
import DocumentSelector from '@/components/DocumentSelector';
import { setupSupabase } from '@/lib/supabase';

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

const Upload = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Load documents on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize Supabase tables and storage
      await setupSupabase();
      
      // Load documents
      await loadDocuments();
      setLoading(false);
    };
    
    initializeApp();
  }, []);
  
  // Load user's documents
  const loadDocuments = async () => {
    const docs = await getSessionDocuments();
    setDocuments(docs);
  };
  
  // Handle upload complete
  const handleUploadComplete = async (documentId: string) => {
    await loadDocuments();
  };
  
  // Navigate to analyze page
  const handleContinue = () => {
    navigate('/analyze');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 bg-juridika-background">
        <div className="juridika-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-juridika-charcoal">
              Ladda upp dokument
            </h1>
            
            <div className="juridika-card mb-8">
              <h2 className="text-xl font-medium mb-4 text-juridika-charcoal">
                Ladda upp juridiska dokument
              </h2>
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </div>
            
            <div className="juridika-card">
              {loading ? (
                <div className="p-8 text-center text-juridika-gray">
                  Laddar dokument...
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-medium mb-4 text-juridika-charcoal">
                    Uppladdade dokument
                  </h2>
                  
                  <div className="space-y-4">
                    {documents.length === 0 ? (
                      <p className="text-juridika-gray text-center p-4">
                        Inga dokument uppladdade än. Ladda upp dokument för att börja.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map(doc => (
                          <div 
                            key={doc.id}
                            className="juridika-card p-3 border"
                          >
                            <p className="font-medium truncate" title={doc.file_name}>
                              {doc.file_name}
                            </p>
                            <p className="text-xs text-juridika-gray mt-1">
                              {new Date(doc.created_at).toLocaleString('sv-SE')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleContinue}
                      className="juridika-btn-primary"
                      disabled={documents.length === 0}
                    >
                      Fortsätt till analys
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
