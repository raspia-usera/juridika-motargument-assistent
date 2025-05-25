
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Scale, Zap, Users } from 'lucide-react';

interface EnhancedUploadModeSelectorProps {
  mode: 'single' | 'comparative';
  onModeChange: (mode: 'single' | 'comparative') => void;
}

const EnhancedUploadModeSelector: React.FC<EnhancedUploadModeSelectorProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="juridika-card mb-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-juridika-charcoal mb-4">
          Välj Analystyp
        </h2>
        <p className="text-lg text-juridika-gray">
          Välj hur du vill analysera dina dokument – snabb enskild analys eller djupgående jämförelse
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          variant={mode === 'single' ? 'default' : 'outline'}
          onClick={() => onModeChange('single')}
          className={`h-auto p-8 flex flex-col items-center space-y-4 transition-professional relative overflow-hidden ${
            mode === 'single' 
              ? 'bg-gradient-to-br from-juridika-gold to-yellow-600 hover:from-yellow-600 hover:to-juridika-gold text-white border-0 shadow-lg transform scale-105' 
              : 'hover:bg-juridika-softgold border-2 border-juridika-lightgray hover:border-juridika-gold'
          }`}
        >
          {/* Background pattern for selected mode */}
          {mode === 'single' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          )}
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              mode === 'single' ? 'bg-white/20' : 'bg-juridika-gold/10'
            }`}>
              <Zap className={`h-8 w-8 ${mode === 'single' ? 'text-white' : 'text-juridika-gold'}`} />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-2">Snabb Analys</div>
              <div className={`text-sm leading-relaxed ${
                mode === 'single' ? 'text-white/90' : 'text-juridika-gray'
              }`}>
                Perfect för enskilda dokument. Få omedelbar AI-analys av argument, 
                styrkor och förbättringsområden.
              </div>
            </div>
          </div>
        </Button>
        
        <Button
          variant={mode === 'comparative' ? 'default' : 'outline'}
          onClick={() => onModeChange('comparative')}
          className={`h-auto p-8 flex flex-col items-center space-y-4 transition-professional relative overflow-hidden ${
            mode === 'comparative' 
              ? 'bg-gradient-to-br from-juridika-wood to-orange-600 hover:from-orange-600 hover:to-juridika-wood text-white border-0 shadow-lg transform scale-105' 
              : 'hover:bg-juridika-softgold border-2 border-juridika-lightgray hover:border-juridika-wood'
          }`}
        >
          {/* Background pattern for selected mode */}
          {mode === 'comparative' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          )}
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              mode === 'comparative' ? 'bg-white/20' : 'bg-juridika-wood/10'
            }`}>
              <Scale className={`h-8 w-8 ${mode === 'comparative' ? 'text-white' : 'text-juridika-wood'}`} />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-2">Jämförande Analys</div>
              <div className={`text-sm leading-relaxed ${
                mode === 'comparative' ? 'text-white/90' : 'text-juridika-gray'
              }`}>
                Ladda upp dokument från olika parter för djupgående jämförelse 
                av argument och motargument.
              </div>
            </div>
          </div>
        </Button>
      </div>
      
      {/* Additional info */}
      <div className="mt-6 text-center">
        <p className="text-juridika-midgray">
          <strong>Viktigt:</strong> Ett enda dokument räcker för att komma igång med analysen
        </p>
      </div>
    </div>
  );
};

export default EnhancedUploadModeSelector;
