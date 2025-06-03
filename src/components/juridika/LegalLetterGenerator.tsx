
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Copy } from 'lucide-react';
import { generateLegalLetter, getLegalLetterTemplates, LegalLetterTemplate } from '@/lib/juridika/letterGenerator';
import { useToast } from '@/hooks/use-toast';

const LegalLetterGenerator: React.FC = () => {
  const [letterType, setLetterType] = useState('');
  const [context, setContext] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState<LegalLetterTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const letterTypes = [
    { value: 'appeal', label: 'Överklagande' },
    { value: 'objection', label: 'Invändning mot krav' },
    { value: 'notice', label: 'Uppsägning/Uppmaning' },
    { value: 'complaint', label: 'Klagomål' },
    { value: 'response', label: 'Svar på skrivelse' }
  ];

  const handleGenerateLetter = async () => {
    if (!letterType || !context.trim()) {
      toast({
        title: "Ofullständig information",
        description: "Vänligen välj brevtyp och ange kontext",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const letter = await generateLegalLetter(letterType, context, userDetails);
      setGeneratedLetter(letter);
      
      toast({
        title: "Brev genererat",
        description: "Juridiskt brev har skapats framgångsrikt",
      });
    } catch (error) {
      console.error('Letter generation error:', error);
      toast({
        title: "Genereringsfel",
        description: "Ett fel uppstod vid skapandet av brevet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content);
      toast({
        title: "Kopierat",
        description: "Brevet har kopierats till urklipp",
      });
    }
  };

  const handleDownload = () => {
    if (generatedLetter) {
      const element = document.createElement('a');
      const file = new Blob([generatedLetter.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${generatedLetter.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Nedladdning startad",
        description: "Brevet laddas ner som textfil",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-juridika-gold" />
            Generera Juridiska Brev
          </CardTitle>
          <CardDescription>
            Skapa professionella juridiska brev och skrivelser med AI-stöd
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="letterType">Typ av brev</Label>
                <Select value={letterType} onValueChange={setLetterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj brevtyp" />
                  </SelectTrigger>
                  <SelectContent>
                    {letterTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="context">Beskrivning av ärendet</Label>
                <Textarea
                  id="context"
                  placeholder="Beskriv situationen och vad brevet ska behandla..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Dina uppgifter (valfritt)</h3>
              
              <div>
                <Label htmlFor="name">Namn</Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ditt fullständiga namn"
                />
              </div>

              <div>
                <Label htmlFor="address">Adress</Label>
                <Input
                  id="address"
                  value={userDetails.address}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Din postadress"
                />
              </div>

              <div>
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="din@email.se"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Ditt telefonnummer"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateLetter}
            disabled={loading || !letterType || !context.trim()}
            className="w-full"
          >
            {loading ? 'Genererar brev...' : 'Skapa Juridiskt Brev'}
          </Button>
        </CardContent>
      </Card>

      {generatedLetter && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{generatedLetter.title}</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Kopiera
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Ladda ner
                </Button>
              </div>
            </div>
            <CardDescription>
              Genererat juridiskt brev - granska och anpassa innan användning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {generatedLetter.content}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Rättslig grund:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedLetter.legalBasis.map((basis, index) => (
                    <span key={index} className="bg-juridika-softgold px-2 py-1 rounded text-sm">
                      {basis}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Obligatoriska fält att fylla i:</h4>
                <ul className="text-sm text-juridika-gray">
                  {generatedLetter.requiredFields.map((field, index) => (
                    <li key={index}>• {field}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Viktigt att komma ihåg:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Detta är en automatiskt genererad mall</li>
                  <li>• Granska och anpassa innehållet före användning</li>
                  <li>• Konsultera juridisk rådgivning vid komplexa ärenden</li>
                  <li>• Kontrollera att alla datum och uppgifter är korrekta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LegalLetterGenerator;
