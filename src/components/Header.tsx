
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-juridika-lightgray">
      <div className="juridika-container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-juridika-purple" />
          <span className="text-xl font-semibold text-juridika-charcoal">Juridika</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 text-juridika-charcoal"
            asChild
          >
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              <span>Ladda upp dokument</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
