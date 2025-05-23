
import React from 'react';

const AnalyzingIndicator: React.FC = () => (
  <div className="juridika-card text-center">
    <div className="py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-juridika-softpurple/50 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-juridika-softpurple/40 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-juridika-softpurple/30 rounded w-2/3 mx-auto"></div>
      </div>
      <p className="text-juridika-gray mt-6">
        Analyserar dokument och genererar motargument...
      </p>
    </div>
  </div>
);

export default AnalyzingIndicator;
