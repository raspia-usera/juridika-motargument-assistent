
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-20">
        <div className="juridika-container">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-4xl font-bold text-juridika-charcoal mb-4">
              404
            </h1>
            <p className="text-xl text-juridika-gray mb-8">
              Sidan kunde inte hittas
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="juridika-btn-primary"
            >
              Tillbaka till startsidan
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
