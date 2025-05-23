
import React from 'react';
import DocumentList from '@/components/analysis/DocumentList';
import ActionButtons from '@/components/analysis/ActionButtons';
import { DocumentItem } from '@/lib/supabase/types';

interface DocumentSelectionSectionProps {
  documents: DocumentItem[];
  selectedDocuments: string[];
  onSelect: (documentId: string) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  loading: boolean;
}

const DocumentSelectionSection: React.FC<DocumentSelectionSectionProps> = ({
  documents,
  selectedDocuments,
  onSelect,
  onAnalyze,
  analyzing,
  loading
}) => {
  return (
    <div className="juridika-card mb-8">
      <DocumentList
        documents={documents}
        selectedDocuments={selectedDocuments}
        onSelect={onSelect}
        loading={loading}
      />
      
      {!loading && (
        <ActionButtons
          onAnalyze={onAnalyze}
          analyzing={analyzing}
          disabled={selectedDocuments.length === 0}
        />
      )}
    </div>
  );
};

export default DocumentSelectionSection;
