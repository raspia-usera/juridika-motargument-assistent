
import React from 'react';
import { FileText, Users, Calendar, FolderOpen } from 'lucide-react';
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
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-juridika-softgold rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FolderOpen className="h-12 w-12 text-juridika-gold" />
        </div>
        <h3 className="text-2xl font-bold text-juridika-charcoal mb-3">
          Inga dokument uppladdade än
        </h3>
        <p className="text-juridika-gray text-lg">
          Ladda upp dina juridiska dokument ovan för att börja med AI-analysen
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Comparative mode document display */}
      {uploadMode === 'comparative' && (sideADocs.length > 0 || sideBDocs.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-juridika-gold rounded-full mr-3"></div>
              <h3 className="text-xl font-bold side-label-a">
                {sideALabel} ({sideADocs.length})
              </h3>
            </div>
            <div className="space-y-3">
              {sideADocs.map(doc => (
                <div key={doc.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-juridika-gold rounded-lg p-4 transition-professional hover:shadow-md">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-juridika-gold mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-juridika-charcoal truncate" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <div className="flex items-center text-sm text-juridika-midgray mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(doc.created_at).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-juridika-wood rounded-full mr-3"></div>
              <h3 className="text-xl font-bold side-label-b">
                {sideBLabel} ({sideBDocs.length})
              </h3>
            </div>
            <div className="space-y-3">
              {sideBDocs.map(doc => (
                <div key={doc.id} className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-juridika-wood rounded-lg p-4 transition-professional hover:shadow-md">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-juridika-wood mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-juridika-charcoal truncate" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <div className="flex items-center text-sm text-juridika-midgray mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(doc.created_at).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single mode document display */}
      {uploadMode === 'single' && singleDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {singleDocs.map(doc => (
            <div 
              key={doc.id}
              className="bg-gradient-to-br from-juridika-softgold to-white border border-juridika-lightgray rounded-xl p-5 hover:border-juridika-gold hover:shadow-lg transition-professional"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-juridika-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-juridika-charcoal truncate" title={doc.filename}>
                    {doc.filename}
                  </p>
                  <div className="flex items-center text-sm text-juridika-midgray mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(doc.created_at).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-10 flex justify-center">
        <Button
          onClick={onContinue}
          className="juridika-btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl"
          disabled={documents.length === 0}
        >
          Fortsätt till Analys
          <span className="ml-3 text-xl">→</span>
        </Button>
      </div>
    </>
  );
};

export default DocumentsList;
