
import React from 'react';
import DocumentUploader from '@/components/DocumentUploader';
import OCRUploader from '@/components/OCRUploader';
import { Upload, Image, FileText, Zap } from 'lucide-react';

interface EnhancedSingleModeUploaderProps {
  onUploadComplete: (documentId: string) => void;
  onOCRComplete: (text: string, filename: string) => void;
}

const EnhancedSingleModeUploader: React.FC<EnhancedSingleModeUploaderProps> = ({
  onUploadComplete,
  onOCRComplete
}) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header section */}
      <div className="text-center juridika-card">
        <div className="flex items-center justify-center mb-4">
          <Zap className="h-8 w-8 text-juridika-gold mr-3" />
          <h2 className="text-2xl font-bold text-juridika-charcoal">
            Snabb Dokumentanalys
          </h2>
        </div>
        <p className="text-juridika-gray text-lg">
          Ladda upp ett eller flera dokument för omedelbar AI-analys av juridiska argument, 
          styrkor och potentiella svagheter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Digital Documents Section */}
        <div className="juridika-card transition-professional hover:scale-105">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-juridika-gold to-yellow-600 rounded-xl flex items-center justify-center mr-4">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-juridika-charcoal">
                Digitala Dokument
              </h3>
              <p className="text-juridika-gray">
                PDF, Word, RTF, Text och mer
              </p>
            </div>
          </div>
          
          <div className="upload-zone p-6">
            <DocumentUploader onUploadComplete={onUploadComplete} />
          </div>
          
          <div className="mt-4 flex items-center text-sm text-juridika-midgray">
            <FileText className="h-4 w-4 mr-2" />
            Stöder de flesta dokumentformat
          </div>
        </div>

        {/* OCR Section */}
        <div className="juridika-card transition-professional hover:scale-105">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-juridika-wood to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-juridika-charcoal">
                Fotografera Dokument
              </h3>
              <p className="text-juridika-gray">
                JPG, PNG, HEIC, WebP och mer
              </p>
            </div>
          </div>
          
          <div className="upload-zone p-6">
            <OCRUploader onTextExtracted={onOCRComplete} />
          </div>
          
          <div className="mt-4 flex items-center text-sm text-juridika-midgray">
            <Image className="h-4 w-4 mr-2" />
            AI-driven textextraktion
          </div>
        </div>
      </div>

      {/* Tips section */}
      <div className="juridika-card bg-gradient-to-r from-juridika-softgold to-ebony-50">
        <h4 className="font-semibold text-juridika-charcoal mb-3">
          💡 Tips för bästa resultat:
        </h4>
        <ul className="space-y-2 text-juridika-gray">
          <li>• Använd högkvalitativa bilder med god belysning</li>
          <li>• Se till att all text är tydligt synlig</li>
          <li>• PDF-filer ger oftast bäst resultat för digitala dokument</li>
          <li>• Du kan ladda upp flera dokument samtidigt</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedSingleModeUploader;
