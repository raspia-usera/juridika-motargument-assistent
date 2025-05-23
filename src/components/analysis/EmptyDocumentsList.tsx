
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmptyDocumentsList: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="juridika-card text-center">
      <p className="text-juridika-gray py-8">
        Inga dokument tillgängliga för analys. 
        <Button 
          variant="link" 
          onClick={() => navigate('/upload')}
          className="text-juridika-purple"
        >
          Ladda upp dokument först
        </Button>
      </p>
    </div>
  );
};

export default EmptyDocumentsList;
