
import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentItem } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';

interface DocumentsListProps {
  documents: DocumentItem[];
  uploadMode: 'single' | 'comparative';
  sideALabel: string;
  sideBLabel: string;
  onContinue: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  uploadMode,
  sideALabel,
  sideBLabel,
  onContinue
}) => {
  const sideADocs = documents.filter(doc => doc.side === 'A');
  const sideBDocs = documents.filter(doc => doc.side === 'B');
  const singleDocs = documents.filter(doc => !doc.side);

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-lg mb-2">
          Inga dokument uppladdade än
        </p>
        <p className="text-slate-400">
          Ladda upp dokument för att börja med juridisk analys
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Comparative mode document display */}
      {uploadMode === 'comparative' && (sideADocs.length > 0 || sideBDocs.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-slate-700 mb-3">{sideALabel} ({sideADocs.length})</h3>
            <div className="space-y-2">
              {sideADocs.map(doc => (
                <div key={doc.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-slate-800 truncate">{doc.filename}</p>
                  <p className="text-sm text-slate-500">{new Date(doc.created_at).toLocaleDateString('sv-SE')}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-3">{sideBLabel} ({sideBDocs.length})</h3>
            <div className="space-y-2">
              {sideBDocs.map(doc => (
                <div key={doc.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="font-medium text-slate-800 truncate">{doc.filename}</p>
                  <p className="text-sm text-slate-500">{new Date(doc.created_at).toLocaleDateString('sv-SE')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single mode document display */}
      {uploadMode === 'single' && singleDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {singleDocs.map(doc => (
            <div 
              key={doc.id}
              className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onContinue}
          className="juridika-btn-primary"
          disabled={documents.length === 0}
        >
          Fortsätt till analys
          <span className="ml-2">→</span>
        </Button>
      </div>
    </>
  );
};

export default DocumentsList;
