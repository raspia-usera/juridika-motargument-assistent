
import React from 'react';
import DocumentSelector from '@/components/DocumentSelector';
import { DocumentItem } from '@/lib/supabase/types';

interface DocumentListProps {
  documents: DocumentItem[];
  selectedDocuments: string[];
  onSelect: (documentId: string) => void;
  loading: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocuments,
  onSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center text-juridika-gray">
        Laddar dokument...
      </div>
    );
  }
  
  return (
    <DocumentSelector 
      documents={documents}
      selectedDocuments={selectedDocuments}
      onSelect={onSelect}
    />
  );
};

export default DocumentList;
