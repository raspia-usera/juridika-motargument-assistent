
import React, { useState } from 'react';
import DocumentUploader from '@/components/DocumentUploader';
import OCRUploader from '@/components/OCRUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, Edit2 } from 'lucide-react';

interface DualSideUploaderProps {
  sideALabel: string;
  sideBLabel: string;
  onSideLabelChange: (side: 'A' | 'B', label: string) => void;
  onUploadComplete: (documentId: string, side: 'A' | 'B') => void;
  onOCRComplete: (text: string, filename: string, side: 'A' | 'B') => void;
}

const DualSideUploader: React.FC<DualSideUploaderProps> = ({
  sideALabel,
  sideBLabel,
  onSideLabelChange,
  onUploadComplete,
  onOCRComplete
}) => {
  const [editingLabel, setEditingLabel] = useState<'A' | 'B' | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  const handleEditLabel = (side: 'A' | 'B') => {
    setTempLabel(side === 'A' ? sideALabel : sideBLabel);
    setEditingLabel(side);
  };

  const handleSaveLabel = () => {
    if (editingLabel) {
      onSideLabelChange(editingLabel, tempLabel);
      setEditingLabel(null);
      setTempLabel('');
    }
  };

  const handleCancelEdit = () => {
    setEditingLabel(null);
    setTempLabel('');
  };

  const renderSide = (side: 'A' | 'B', label: string) => (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        {editingLabel === side ? (
          <div className="flex items-center space-x-2 flex-1">
            <Input
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              className="flex-1"
              placeholder="Ange etikett för denna sida"
            />
            <Button size="sm" onClick={handleSaveLabel}>
              Spara
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Avbryt
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-800">
              {label}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditLabel(side)}
              className="text-slate-500 hover:text-slate-700"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      <p className="text-sm text-slate-600 mb-6">
        Ladda upp alla relevanta material för denna part. Format som stöds: PDF, Word, RTF, JPG, PNG med mera.
      </p>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-3">
            <Upload className="h-5 w-5 text-teal-600 mr-2" />
            <span className="font-medium text-slate-700">Digitala dokument</span>
          </div>
          <DocumentUploader 
            onUploadComplete={(documentId) => onUploadComplete(documentId, side)} 
          />
        </div>
        
        <div>
          <div className="flex items-center mb-3">
            <Image className="h-5 w-5 text-teal-600 mr-2" />
            <span className="font-medium text-slate-700">Fotografera dokument</span>
          </div>
          <OCRUploader 
            onTextExtracted={(text, filename) => onOCRComplete(text, filename, side)} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-slate-700">
          Du kan ladda upp dokument för båda sidor, eller bara en. Juridika kommer att hitta och utvärdera 
          juridiska argument och motargument baserat på innehållet.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSide('A', sideALabel)}
        {renderSide('B', sideBLabel)}
      </div>
    </div>
  );
};

export default DualSideUploader;
