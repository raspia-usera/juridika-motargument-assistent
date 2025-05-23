
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, File, FileImage } from 'lucide-react';
import { DocumentItem } from '@/lib/supabase/types';

interface DocumentSelectorProps {
  documents: DocumentItem[];
  selectedDocuments: string[];
  onSelect: (id: string) => void;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ 
  documents, 
  selectedDocuments, 
  onSelect 
}) => {
  // Choose icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-juridika-purple" />;
    } else if (fileType.includes('image')) {
      return <FileImage className="h-8 w-8 text-juridika-purple" />;
    } else {
      return <File className="h-8 w-8 text-juridika-purple" />;
    }
  };
  
  // Format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Välj dokument att analysera</h3>
      
      {documents.length === 0 ? (
        <div className="text-center p-8 text-juridika-gray">
          Inga dokument uppladdade. Ladda upp dokument först.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card 
              key={doc.id}
              className={`cursor-pointer hover:border-juridika-purple transition-colors ${
                selectedDocuments.includes(doc.id) ? 'border-juridika-purple bg-juridika-softpurple/10' : ''
              }`}
              onClick={() => onSelect(doc.id)}
            >
              <CardContent className="p-4 flex items-start space-x-3">
                <Checkbox 
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => onSelect(doc.id)}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    {getFileIcon(doc.mimetype)}
                    <span className="text-xs text-juridika-gray">
                      {formatDate(doc.created_at)}
                    </span>
                  </div>
                  <p className="font-medium text-juridika-charcoal truncate" title={doc.filename}>
                    {doc.filename}
                  </p>
                  <p className="text-xs text-juridika-gray">
                    {doc.mimetype.split('/')[1]?.toUpperCase() || doc.mimetype}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentSelector;
