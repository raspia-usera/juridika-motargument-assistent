
import React from 'react';
import DocumentUploader from '@/components/DocumentUploader';
import OCRUploader from '@/components/OCRUploader';
import { Upload as UploadIcon, Image } from 'lucide-react';

interface SingleModeUploadSectionProps {
  onUploadComplete: (documentId: string) => void;
  onOCRComplete: (text: string, filename: string) => void;
}

const SingleModeUploadSection: React.FC<SingleModeUploadSectionProps> = ({
  onUploadComplete,
  onOCRComplete
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Document Upload Section */}
      <div className="juridika-card">
        <div className="flex items-center mb-6">
          <UploadIcon className="h-6 w-6 text-teal-600 mr-3" />
          <h2 className="text-xl font-semibold text-slate-800">
            Ladda upp digitala dokument
          </h2>
        </div>
        <p className="text-slate-600 mb-4 text-sm">
          Accepterade format: PDF, Word, RTF, Text och mer
        </p>
        <DocumentUploader onUploadComplete={onUploadComplete} />
      </div>

      {/* OCR Upload Section */}
      <div className="juridika-card">
        <div className="flex items-center mb-6">
          <Image className="h-6 w-6 text-teal-600 mr-3" />
          <h2 className="text-xl font-semibold text-slate-800">
            Fotografera pappersdokument
          </h2>
        </div>
        <p className="text-slate-600 mb-4 text-sm">
          Stödda format: JPG, PNG, HEIC, BMP, WEBP, PDF och mer
        </p>
        <OCRUploader onTextExtracted={onOCRComplete} />
      </div>
    </div>
  );
};

export default SingleModeUploadSection;
