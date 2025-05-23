
import React from 'react';
import { Button } from '@/components/ui/button';
import DocumentSelector from '@/components/DocumentSelector';
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
      {loading ? (
        <div className="p-8 text-center text-juridika-gray">
          Laddar dokument...
        </div>
      ) : (
        <>
          <DocumentSelector 
            documents={documents}
            selectedDocuments={selectedDocuments}
            onSelect={onSelect}
          />
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onAnalyze}
              className="juridika-btn-primary"
              disabled={selectedDocuments.length === 0 || analyzing}
            >
              {analyzing ? 'Analyserar...' : 'Analysera valda dokument'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentSelectionSection;
