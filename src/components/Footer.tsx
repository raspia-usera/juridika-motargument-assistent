
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Footer: React.FC = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <footer className="bg-white border-t border-juridika-lightgray py-4">
      <div className="juridika-container flex justify-between items-center text-sm">
        <div className="text-juridika-midgray">
          © {new Date().getFullYear()} Juridika - Alla rättigheter förbehållna
        </div>
        
        <button 
          onClick={() => setFaqOpen(true)}
          className="text-juridika-purple hover:text-juridika-purple/80 transition-colors"
        >
          Så fungerar Juridika
        </button>
      </div>
      
      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Så fungerar Juridika</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-left">
            <h3 className="font-medium text-juridika-charcoal">Hur använder jag Juridika?</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Ladda upp dokument</strong> - Ladda upp dina juridiska dokument (PDF, DOCX, RTF, HTML, TXT)
              </li>
              <li>
                <strong>Analysera</strong> - Välj dokument att analysera och låt Juridika identifiera juridiska påståenden
              </li>
              <li>
                <strong>Få motargument</strong> - För varje identifierat påstående presenterar Juridika upp till fyra rangordnade motargument
              </li>
              <li>
                <strong>Granska och applicera</strong> - Använd motargumenten i ditt arbete
              </li>
            </ol>
            
            <h3 className="font-medium text-juridika-charcoal mt-6">Frågor och svar</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Är mina dokument säkra?</p>
                <p className="text-juridika-gray">I testversionen sparas dina dokument anonymt utan att kopplas till din identitet. I kommande versioner kommer fullständigt användarkonto med säker autentisering att implementeras.</p>
              </div>
              
              <div>
                <p className="font-medium">Vilken lagstiftning täcks?</p>
                <p className="text-juridika-gray">Juridika fokuserar uteslutande på svensk lagstiftning och rättspraxis.</p>
              </div>
              
              <div>
                <p className="font-medium">Hur precisa är motargumenten?</p>
                <p className="text-juridika-gray">Juridika strävar efter att ge kreativa och korrekta motargument men resultaten bör alltid granskas av en kvalificerad jurist. Verktyget är ett stöd i arbetet, inte en ersättning för juridisk expertis.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
