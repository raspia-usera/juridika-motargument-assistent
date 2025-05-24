
import React from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="juridika-container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-3">
          <Scale className="h-8 w-8 juridika-scales" />
          <span className="text-xl font-bold text-slate-800">Juridika</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 text-slate-700 hover:text-teal-600"
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
