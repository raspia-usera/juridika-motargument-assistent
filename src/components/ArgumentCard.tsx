
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CounterArgument {
  argument: string;
  strength: number;
  references: string[];
}

interface ArgumentCardProps {
  claim: string;
  counterarguments: CounterArgument[];
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({ claim, counterarguments }) => {
  // Sort counterarguments by strength (highest first)
  const sortedArguments = [...counterarguments].sort((a, b) => b.strength - a.strength);
  
  // Format strength as percentage
  const formatStrength = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <Card className="w-full shadow-sm border-juridika-lightgray">
      <CardHeader className="bg-juridika-softpurple/30 pb-3">
        <h3 className="font-medium text-juridika-charcoal">{claim}</h3>
      </CardHeader>
      
      <CardContent className="pt-4 pb-0">
        <div className="space-y-6">
          {sortedArguments.map((arg, index) => (
            <div key={index} className="pb-6 border-b last:border-0 border-juridika-lightgray/50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm text-juridika-charcoal">
                  Motargument {index + 1}
                </span>
                <span className="text-sm font-medium text-juridika-purple">
                  {formatStrength(arg.strength)}
                </span>
              </div>
              
              <Progress
                value={arg.strength * 100}
                className="h-1 mb-3"
              />
              
              <p className="text-juridika-charcoal mb-2">
                {arg.argument}
              </p>
              
              {arg.references.length > 0 && (
                <div>
                  <p className="text-xs text-juridika-gray">Referenser:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {arg.references.map((ref, refIndex) => (
                      <span 
                        key={refIndex} 
                        className="px-2 py-1 bg-juridika-softpurple/30 text-juridika-charcoal rounded text-xs"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArgumentCard;
