
import React from 'react';
import ArgumentCard from '@/components/ArgumentCard';
import { AnalysisResult } from '@/lib/supabase/types';
import PDFViewer from '@/components/analysis/PDFViewer';

interface AnalysisResultsSectionProps {
  results: AnalysisResult;
  pdfUrl: string | null;
  onDownloadPdf: () => void;
}

const AnalysisResultsSection: React.FC<AnalysisResultsSectionProps> = ({
  results,
  pdfUrl,
  onDownloadPdf
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium text-juridika-charcoal">
        Analysresultat
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.claims.map((claim, index) => (
          <ArgumentCard 
            key={index}
            claim={claim.claim}
            counterarguments={claim.counterarguments}
          />
        ))}
      </div>
      
      <div className="juridika-card mt-8">
        {pdfUrl && (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4 text-center">PDF-rapport</h3>
            <PDFViewer 
              pdfUrl={pdfUrl}
              onDownload={onDownloadPdf}
            />
          </div>
        )}
        
        <p className="text-sm text-juridika-charcoal mt-4 p-4 bg-juridika-softpurple/10">
          <strong>OBS:</strong> Detta är en testversion. Resultaten bör alltid granskas av en kvalificerad jurist.
          Temporär anonym åtkomst används för testning. I produktion kommer striktare behörighetsregler att tillämpas.
        </p>
      </div>
    </div>
  );
};

export default AnalysisResultsSection;
