
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Scale, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { analyzeSwedishLegalDocument, SwedishLegalAnalysis } from '@/lib/juridika/swedishLegalAnalyzer';
import { generateLegalReasoningEngine } from '@/lib/juridika/swedishLegalResources';
import { useToast } from '@/hooks/use-toast';

const SwedishLegalAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<SwedishLegalAnalysis | null>(null);
  const [reasoning, setReasoning] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'document' | 'question'>('document');
  const { toast } = useToast();

  const handleDocumentAnalysis = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Ingen text att analysera",
        description: "Vänligen ange text för analys",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSwedishLegalDocument(inputText);
      setAnalysis(result);
      
      toast({
        title: "Analys klar",
        description: "Juridisk analys har slutförts framgångsrikt",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysfel",
        description: "Ett fel uppstod under analysen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLegalReasoning = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Ingen fråga att besvara",
        description: "Vänligen ange en juridisk fråga",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateLegalReasoningEngine(inputText);
      setReasoning(result);
      
      toast({
        title: "Juridisk bedömning klar",
        description: "Analys av för- och motargument slutförd",
      });
    } catch (error) {
      console.error('Reasoning error:', error);
      toast({
        title: "Bedömningsfel",
        description: "Ett fel uppstod under bedömningen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="h-5 w-5 mr-2 text-juridika-gold" />
            Svensk Juridisk AI-Analys
          </CardTitle>
          <CardDescription>
            Ladda upp dokument eller ställ juridiska frågor för AI-driven analys baserad på svensk rätt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={mode === 'document' ? 'default' : 'outline'}
              onClick={() => setMode('document')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Dokumentanalys
            </Button>
            <Button
              variant={mode === 'question' ? 'default' : 'outline'}
              onClick={() => setMode('question')}
              className="flex-1"
            >
              <Scale className="h-4 w-4 mr-2" />
              Juridisk Fråga
            </Button>
          </div>

          <Textarea
            placeholder={mode === 'document' 
              ? "Klistra in dokumenttext här för juridisk analys..." 
              : "Ställ din juridiska fråga här..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            className="w-full"
          />

          <Button
            onClick={mode === 'document' ? handleDocumentAnalysis : handleLegalReasoning}
            disabled={loading || !inputText.trim()}
            className="w-full"
          >
            {loading ? 'Analyserar...' : mode === 'document' ? 'Analysera Dokument' : 'Bedöm Juridisk Fråga'}
          </Button>
        </CardContent>
      </Card>

      {/* Document Analysis Results */}
      {analysis && mode === 'document' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sammanfattning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-juridika-gray">{analysis.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.legalAreas.map((area, index) => (
                  <Badge key={index} variant="secondary">{area}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Argument För</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyArguments.for.map((arg, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{arg}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Argument Emot</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyArguments.against.map((arg, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{arg}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getRiskIcon(analysis.riskAssessment.level)}
                <span className="ml-2">Riskbedömning: {analysis.riskAssessment.level}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysis.riskAssessment.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-juridika-gray">• {factor}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relevanta Lagar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.relevantLaws.map((law, index) => (
                  <div key={index} className="border-l-4 border-juridika-gold pl-4">
                    <h4 className="font-semibold">{law.law} - {law.section}</h4>
                    <p className="text-sm text-juridika-gray">{law.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rekommendationer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Omedelbara åtgärder:</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.immediate.map((rec, index) => (
                    <li key={index} className="text-sm text-juridika-gray">• {rec}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Långsiktiga åtgärder:</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.longTerm.map((rec, index) => (
                    <li key={index} className="text-sm text-juridika-gray">• {rec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legal Reasoning Results */}
      {reasoning && mode === 'question' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Argument För</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reasoning.proPosition}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Argument Emot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reasoning.contraPosition}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Neutral Bedömning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-juridika-gray">{reasoning.neutralAssessment}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rekommenderad Åtgärd</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-juridika-gray">{reasoning.recommendedAction}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Svenska Juridiska Resurser</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reasoning.legalResources.map((resource: any, index: number) => (
                  <div key={index} className="border-l-4 border-juridika-wood pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{resource.title}</h4>
                      <Badge variant="outline">{resource.source}</Badge>
                    </div>
                    <p className="text-sm text-juridika-gray mt-1">{resource.description}</p>
                    {resource.reference && (
                      <p className="text-xs text-juridika-midgray mt-1">Ref: {resource.reference}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SwedishLegalAnalyzer;
