
import React from 'react';
import { Button } from '@/components/ui/button';
import ArgumentCard from '@/components/ArgumentCard';
import { AnalysisResult } from '@/lib/supabase/types';

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
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-medium mb-4">PDF-rapport</h3>
            <div className="mb-4">
              <iframe 
                src={pdfUrl} 
                className="border rounded w-full"
                style={{ height: '400px' }}
                title="PDF-förhandsgranskning"
              />
            </div>
            <Button 
              onClick={onDownloadPdf}
              className="juridika-btn-secondary"
            >
              Ladda ner PDF-rapport
            </Button>
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
