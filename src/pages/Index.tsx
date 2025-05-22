
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Upload, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-white">
          <div className="juridika-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-juridika-charcoal mb-4">
                Juridisk AI-assistent för svenska advokater
              </h1>
              <p className="text-xl text-juridika-gray mb-8">
                Generera kreativa och starka motargument baserade på svensk lagstiftning genom att analysera dina juridiska dokument.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild
                  className="juridika-btn-primary text-base px-6 py-6"
                >
                  <Link to="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Ladda upp dokument
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  className="juridika-btn-secondary text-base px-6 py-6"
                >
                  <Link to="/analyze">
                    <Search className="mr-2 h-5 w-5" />
                    Börja analysera
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-juridika-background">
          <div className="juridika-container">
            <h2 className="text-2xl font-semibold text-juridika-charcoal text-center mb-12">
              Så här hjälper Juridika dig
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="juridika-card text-center">
                <div className="rounded-full bg-juridika-softpurple w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-juridika-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Ladda upp dokument</h3>
                <p className="text-juridika-gray">
                  Ladda upp flera juridiska dokument i olika format (PDF, DOCX, RTF, HTML, TXT) för analys.
                </p>
              </div>
              
              <div className="juridika-card text-center">
                <div className="rounded-full bg-juridika-softpurple w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-juridika-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Analysera innehåll</h3>
                <p className="text-juridika-gray">
                  Juridika identifierar juridiska påståenden och utvärderar möjliga motargument baserade på svensk lag.
                </p>
              </div>
              
              <div className="juridika-card text-center">
                <div className="rounded-full bg-juridika-softpurple w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-juridika-purple" />
                </div>
                <h3 className="text-xl font-medium mb-2">Få motargument</h3>
                <p className="text-juridika-gray">
                  För varje påstående presenterar Juridika upp till fyra rangordnade motargument med relevanta rättskällor.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="juridika-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-juridika-charcoal mb-4">
                Redo att börja?
              </h2>
              <p className="text-juridika-gray mb-8">
                Ladda upp dina dokument och låt Juridika hjälpa dig hitta kreativa och starka motargument.
              </p>
              
              <Button 
                asChild
                className="juridika-btn-primary text-base px-6 py-6"
              >
                <Link to="/upload">
                  <Upload className="mr-2 h-5 w-5" />
                  Ladda upp dokument
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
