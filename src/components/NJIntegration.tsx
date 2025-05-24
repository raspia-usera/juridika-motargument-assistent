
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NJIntegration: React.FC = () => {
  const { toast } = useToast();

  const handleNJLogin = () => {
    toast({
      title: "NJ.se Integration",
      description: "Säker integration med NJ.se kommer att vara tillgänglig för inloggade användare med giltig NJ.se-prenumeration.",
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <ExternalLink className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-slate-800 mb-2">
            Norstedts Juridik (NJ.se)
          </h3>
          <p className="text-slate-600 text-sm mb-3">
            Hämta rättsfall, doktrin och prejudikat direkt från NJ.se för en mer omfattande juridisk analys.
          </p>
          <Button
            onClick={handleNJLogin}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Lock className="h-4 w-4 mr-2" />
            Logga in på NJ.se
          </Button>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500 bg-slate-100 rounded p-2">
        <strong>Kommande funktion:</strong> Integration kräver giltig NJ.se-prenumeration och säker autentisering.
      </div>
    </div>
  );
};

export default NJIntegration;
