
import { useState, useEffect } from 'react';
import { getSessionDocuments } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '@/lib/supabase/types';

export const useDocumentList = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getSessionDocuments();
        setDocuments(docs || []);
      } catch (error) {
        console.error('Failed to load documents:', error);
        toast({
          title: "Laddningsfel",
          description: "Kunde inte ladda dokument. Försök igen senare.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, [toast]);

  return {
    documents,
    loading
  };
};
