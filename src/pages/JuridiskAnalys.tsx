
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, FileText, MessageSquare, PenTool } from 'lucide-react';
import SwedishLegalAnalyzer from '@/components/juridika/SwedishLegalAnalyzer';
import LegalLetterGenerator from '@/components/juridika/LegalLetterGenerator';

const JuridiskAnalys: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-juridika-cream to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-juridika-charcoal mb-4">
              Juridisk AI-Analys
            </h1>
            <p className="text-xl text-juridika-gray max-w-3xl mx-auto">
              Avancerad AI-driven juridisk analys baserad på svensk lagstiftning. 
              Analysera dokument, ställ juridiska frågor och generera professionella brev.
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="analyzer" className="flex items-center">
                <Scale className="h-4 w-4 mr-2" />
                AI-Analys
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Dokument
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Frågor & Svar
              </TabsTrigger>
              <TabsTrigger value="letters" className="flex items-center">
                <PenTool className="h-4 w-4 mr-2" />
                Brevgenerator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer">
              <SwedishLegalAnalyzer />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Dokumenthantering</CardTitle>
                  <CardDescription>
                    Ladda upp och analysera juridiska dokument med förbättrad AI-teknik
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-juridika-gold mx-auto mb-4" />
                    <p className="text-juridika-gray">
                      Dokumenthantering integreras med den befintliga uppladdningssidan.
                      Besök Upload-sidan för att ladda upp dokument med förbättrad AI-analys.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Juridisk Fråga & Svar</CardTitle>
                  <CardDescription>
                    Ställ specifika juridiska frågor och få detaljerade svar baserade på svensk rätt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="h-16 w-16 text-juridika-wood mx-auto mb-4" />
                    <p className="text-juridika-gray">
                      Använd AI-Analys-fliken ovan för att ställa juridiska frågor och få 
                      omfattande svar med för- och motargument.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="letters">
              <LegalLetterGenerator />
            </TabsContent>
          </Tabs>

          {/* Features Overview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Scale className="h-12 w-12 text-juridika-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Svensk Rättsanalys</h3>
                <p className="text-sm text-juridika-gray">
                  AI-driven analys baserad på svensk lagstiftning och rättspraxis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-juridika-wood mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Automatisk Klassificering</h3>
                <p className="text-sm text-juridika-gray">
                  Identifierar juridiska begrepp och klassificerar dokument automatiskt
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <PenTool className="h-12 w-12 text-juridika-gold mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Brevgenerering</h3>
                <p className="text-sm text-juridika-gray">
                  Skapa professionella juridiska brev och skrivelser automatiskt
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuridiskAnalys;
