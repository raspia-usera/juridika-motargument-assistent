
import React, { useState } from 'react';
import DocumentUploader from '@/components/DocumentUploader';
import OCRUploader from '@/components/OCRUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image, Edit2, Users, Scale } from 'lucide-react';

interface EnhancedDualSideUploaderProps {
  sideALabel: string;
  sideBLabel: string;
  onSideLabelChange: (side: 'A' | 'B', label: string) => void;
  onUploadComplete: (documentId: string, side: 'A' | 'B') => void;
  onOCRComplete: (text: string, filename: string, side: 'A' | 'B') => void;
}

const EnhancedDualSideUploader: React.FC<EnhancedDualSideUploaderProps> = ({
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

  const renderSide = (side: 'A' | 'B', label: string, colorScheme: string) => (
    <div className={`juridika-card-side-${side.toLowerCase()} relative overflow-hidden transition-professional`}>
      {/* Side indicator */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${
        side === 'A' ? 'bg-juridika-gold' : 'bg-juridika-wood'
      } opacity-10 transform rotate-45 translate-x-8 -translate-y-8`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          {editingLabel === side ? (
            <div className="flex items-center space-x-3 flex-1">
              <Input
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                className="flex-1 border-2 focus:ring-4"
                placeholder={`Ange etikett för ${side === 'A' ? 'första' : 'andra'} parten`}
              />
              <Button size="sm" onClick={handleSaveLabel} className="juridika-btn-primary">
                Spara
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Avbryt
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  side === 'A' ? 'bg-juridika-gold' : 'bg-juridika-wood'
                }`}></div>
                <h3 className={`text-2xl font-bold ${
                  side === 'A' ? 'side-label-a' : 'side-label-b'
                }`}>
                  {label}
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditLabel(side)}
                className="text-juridika-midgray hover:text-juridika-charcoal transition-professional"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        <p className="text-juridika-gray mb-8 text-lg leading-relaxed">
          Ladda upp alla relevanta dokument för denna part. Systemet stöder både digitala filer 
          och fotografier av pappersdokument.
        </p>
        
        <div className="space-y-8">
          {/* Digital documents section */}
          <div className="upload-zone p-6">
            <div className="flex items-center mb-4">
              <Upload className={`h-6 w-6 mr-3 ${
                side === 'A' ? 'text-juridika-gold' : 'text-juridika-wood'
              }`} />
              <span className="font-semibold text-juridika-charcoal text-lg">
                Digitala dokument
              </span>
            </div>
            <DocumentUploader 
              onUploadComplete={(documentId) => onUploadComplete(documentId, side)}
              side={side}
              sideLabel={label}
              analysisMode="comparative"
            />
          </div>
          
          {/* OCR section */}
          <div className="upload-zone p-6">
            <div className="flex items-center mb-4">
              <Image className={`h-6 w-6 mr-3 ${
                side === 'A' ? 'text-juridika-gold' : 'text-juridika-wood'
              }`} />
              <span className="font-semibold text-juridika-charcoal text-lg">
                Fotografera dokument
              </span>
            </div>
            <OCRUploader 
              onTextExtracted={(text, filename) => onOCRComplete(text, filename, side)} 
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header section */}
      <div className="text-center juridika-card">
        <div className="flex items-center justify-center mb-4">
          <Scale className="h-8 w-8 text-juridika-gold mr-3" />
          <h2 className="text-2xl font-bold text-juridika-charcoal">
            Jämförande Analys
          </h2>
        </div>
        <p className="text-juridika-gray text-lg">
          Ladda upp dokument för båda parter och få en detaljerad jämförelse av argument och motargument. 
          Du kan också ladda upp för endast en sida om du föredrar det.
        </p>
      </div>
      
      {/* Dual upload sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderSide('A', sideALabel, 'gold')}
        {renderSide('B', sideBLabel, 'wood')}
      </div>
      
      {/* Connector visualization */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-16 h-16 bg-white border-4 border-juridika-lightgray rounded-full flex items-center justify-center shadow-lg">
          <Users className="h-6 w-6 text-juridika-gold" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDualSideUploader;
