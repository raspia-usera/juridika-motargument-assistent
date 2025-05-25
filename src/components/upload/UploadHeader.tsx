
import React from 'react';
import { Scale } from 'lucide-react';

const UploadHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Scale className="h-12 w-12 juridika-scales mr-4" />
        <h1 className="text-4xl font-bold text-slate-800">
          Ladda upp juridiska dokument
        </h1>
      </div>
      <p className="text-lg text-slate-600 max-w-3xl mx-auto">
        Ladda upp dina juridiska dokument för analys av motargument och juridiska påståenden. 
        Stödja både digitala filer och fotografier av pappersdokument.
      </p>
    </div>
  );
};

export default UploadHeader;
