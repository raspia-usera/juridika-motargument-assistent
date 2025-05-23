
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentSelectionSection from '@/components/analysis/DocumentSelectionSection';
import AnalyzingIndicator from '@/components/analysis/AnalyzingIndicator';
import AnalysisResultsSection from '@/components/analysis/AnalysisResultsSection';
import EmptyDocumentsList from '@/components/analysis/EmptyDocumentsList';
import { useDocumentList } from '@/hooks/useDocumentList';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { downloadPdfReport } from '@/lib/pdfExport';

const Analyze = () => {
  const { documents, loading } = useDocumentList();
  const { analyzing, results, pdfUrl, startAnalysis } = useDocumentAnalysis();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Handle document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  // Start analysis
  const handleAnalyze = () => {
    startAnalysis(selectedDocuments);
  };

  // Download PDF report
  const handleDownloadPdf = () => {
    if (results) {
      downloadPdfReport(results, 'juridisk-analys.pdf');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 bg-juridika-background">
        <div className="juridika-container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-juridika-charcoal">
              Analysera dokument
            </h1>
            
            <DocumentSelectionSection
              documents={documents}
              selectedDocuments={selectedDocuments}
              onSelect={handleDocumentSelect}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
              loading={loading}
            />
            
            {analyzing && <AnalyzingIndicator />}
            
            {results && (
              <AnalysisResultsSection
                results={results}
                pdfUrl={pdfUrl}
                onDownloadPdf={handleDownloadPdf}
              />
            )}
            
            {!analyzing && documents.length === 0 && <EmptyDocumentsList />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
