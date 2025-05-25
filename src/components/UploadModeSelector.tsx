
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Scale } from 'lucide-react';

interface UploadModeSelectorProps {
  mode: 'single' | 'comparative';
  onModeChange: (mode: 'single' | 'comparative') => void;
}

const UploadModeSelector: React.FC<UploadModeSelectorProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Välj analystyp
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={mode === 'single' ? 'default' : 'outline'}
          onClick={() => onModeChange('single')}
          className={`h-auto p-4 flex flex-col items-center space-y-2 ${
            mode === 'single' 
              ? 'bg-teal-600 hover:bg-teal-700 text-white' 
              : 'hover:bg-slate-50'
          }`}
        >
          <FileText className="h-8 w-8" />
          <div className="text-center">
            <div className="font-medium">Enkel uppladdning</div>
            <div className="text-sm opacity-80">
              Analysera dokument och generera motargument
            </div>
          </div>
        </Button>
        
        <Button
          variant={mode === 'comparative' ? 'default' : 'outline'}
          onClick={() => onModeChange('comparative')}
          className={`h-auto p-4 flex flex-col items-center space-y-2 ${
            mode === 'comparative' 
              ? 'bg-teal-600 hover:bg-teal-700 text-white' 
              : 'hover:bg-slate-50'
          }`}
        >
          <Scale className="h-8 w-8" />
          <div className="text-center">
            <div className="font-medium">Jämförande analys</div>
            <div className="text-sm opacity-80">
              Jämför argument mellan två parter
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UploadModeSelector;
