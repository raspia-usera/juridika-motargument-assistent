
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getSessionDocuments } from '@/lib/supabase';
import { executeMigrations, setupStorage } from '@/lib/supabaseMigrations';
import { createDocumentFromText } from '@/lib/documentProcessor';
import { DocumentItem } from '@/lib/supabase/types';

export const useUploadState = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'single' | 'comparative'>('single');
  const [sideALabel, setSideALabel] = useState('Sida A');
  const [sideBLabel, setSideBLabel] = useState('Sida B');
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

  // Handle upload complete for single mode
  const handleUploadComplete = async (documentId: string) => {
    console.log('Upload completed for document:', documentId);
    await loadDocuments();
    
    toast({
      title: "Uppladdning klar",
      description: "Dokumentet har laddats upp och behandlats",
    });
  };

  // Handle upload complete for dual side mode
  const handleDualSideUploadComplete = async (documentId: string, side: 'A' | 'B') => {
    console.log('Dual-side upload completed for document:', documentId, 'Side:', side);
    await loadDocuments();
    
    const sideLabel = side === 'A' ? sideALabel : sideBLabel;
    toast({
      title: "Uppladdning klar",
      description: `Dokumentet har laddats upp till ${sideLabel}`,
    });
  };
  
  // Handle OCR text extraction for single mode
  const handleOCRComplete = async (text: string, filename: string) => {
    console.log('OCR completed:', filename, text.length, 'characters');
    
    try {
      const documentId = await createDocumentFromText(text, filename, undefined, undefined, uploadMode);
      if (documentId) {
        await loadDocuments();
        toast({
          title: "OCR klar",
          description: `Text extraherad och sparad som "${filename}"`,
        });
      }
    } catch (error) {
      console.error('Error saving OCR text:', error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara den extraherade texten",
        variant: "destructive",
      });
    }
  };

  // Handle OCR text extraction for dual side mode
  const handleDualSideOCRComplete = async (text: string, filename: string, side: 'A' | 'B') => {
    console.log('Dual-side OCR completed:', filename, 'Side:', side, text.length, 'characters');
    
    try {
      const sideLabel = side === 'A' ? sideALabel : sideBLabel;
      const documentId = await createDocumentFromText(text, filename, side, sideLabel, 'comparative');
      if (documentId) {
        await loadDocuments();
        toast({
          title: "OCR klar",
          description: `Text extraherad och sparad till ${sideLabel}`,
        });
      }
    } catch (error) {
      console.error('Error saving OCR text:', error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara den extraherade texten",
        variant: "destructive",
      });
    }
  };

  // Handle side label changes
  const handleSideLabelChange = (side: 'A' | 'B', label: string) => {
    if (side === 'A') {
      setSideALabel(label);
    } else {
      setSideBLabel(label);
    }
  };
  
  // Navigate to analyze page
  const handleContinue = () => {
    navigate('/analyze');
  };

  return {
    documents,
    loading,
    initializationError,
    uploadMode,
    setUploadMode,
    sideALabel,
    sideBLabel,
    handleUploadComplete,
    handleDualSideUploadComplete,
    handleOCRComplete,
    handleDualSideOCRComplete,
    handleSideLabelChange,
    handleContinue
  };
};
