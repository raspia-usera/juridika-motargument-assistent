
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col juridika-background">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Initialiserar applikation...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingSpinner;
