
import React from 'react';
import { Scale } from 'lucide-react';

const UploadHeader: React.FC = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <Scale className="h-16 w-16 juridika-scales mr-4" />
        <h1 className="text-5xl font-bold text-juridika-charcoal">
          Juridisk Dokumentanalys
        </h1>
      </div>
      <p className="text-xl text-juridika-gray max-w-4xl mx-auto leading-relaxed">
        Ladda upp dina juridiska dokument för professionell AI-analys. Stöder både digitala filer 
        och fotografier av pappersdokument. <strong>Ett dokument räcker för att komma igång</strong> – 
        eller ladda upp flera för djupgående jämförelse mellan parter.
      </p>
      <div className="mt-4 text-sm text-juridika-midgray bg-juridika-softgold px-4 py-2 rounded-lg inline-block">
        Accepterade format: PDF, DOCX, TXT, RTF och bildformat som JPG, PNG, HEIC, WebP, etc.
      </div>
    </div>
  );
};

export default UploadHeader;
