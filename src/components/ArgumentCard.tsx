
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, Brain } from 'lucide-react';
import { Counterargument } from '@/lib/supabase/types';

interface ArgumentCardProps {
  counterargument: Counterargument;
  index: number;
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({ counterargument, index }) => {
  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'bg-red-500';
    if (strength >= 0.6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength >= 0.8) return 'Hög';
    if (strength >= 0.6) return 'Medel';
    return 'Låg';
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'opposing_document':
        return <FileText className="h-4 w-4" />;
      case 'ai_generated':
        return <Brain className="h-4 w-4" />;
      default:
        return <Scale className="h-4 w-4" />;
    }
  };

  const getSourceText = (source?: string) => {
    switch (source) {
      case 'opposing_document':
        return 'Från motpartens material';
      case 'ai_generated':
        return 'Genererat från juridisk slutledning';
      default:
        return 'Juridisk analys';
    }
  };

  const getSourceBadgeVariant = (source?: string) => {
    switch (source) {
      case 'opposing_document':
        return 'default';
      case 'ai_generated':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="juridika-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-juridika-charcoal leading-tight">
            Motargument {index + 1}
          </CardTitle>
          <div className="flex flex-col items-end space-y-2">
            <Badge 
              className={`${getStrengthColor(counterargument.strength)} text-white font-medium px-3 py-1`}
            >
              {getStrengthText(counterargument.strength)} styrka
            </Badge>
            <Badge 
              variant={getSourceBadgeVariant(counterargument.source)}
              className="flex items-center space-x-1"
            >
              {getSourceIcon(counterargument.source)}
              <span className="text-xs">{getSourceText(counterargument.source)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-juridika-gray mb-4 leading-relaxed">
          {counterargument.argument}
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium text-juridika-charcoal text-sm">
            Referenser:
          </h4>
          <ul className="space-y-1">
            {counterargument.references.map((ref, refIndex) => (
              <li 
                key={refIndex} 
                className="text-sm text-juridika-gray bg-slate-50 px-3 py-2 rounded-md border-l-4 border-juridika-teal"
              >
                {ref}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArgumentCard;
