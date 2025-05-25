
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NJIntegration from '@/components/NJIntegration';
import EnhancedUploadModeSelector from '@/components/upload/EnhancedUploadModeSelector';
import EnhancedDualSideUploader from '@/components/upload/EnhancedDualSideUploader';
import EnhancedSingleModeUploader from '@/components/upload/EnhancedSingleModeUploader';
import UploadHeader from '@/components/upload/UploadHeader';
import ErrorAlert from '@/components/upload/ErrorAlert';
import DocumentsList from '@/components/upload/DocumentsList';
import InformationSection from '@/components/upload/InformationSection';
import LoadingSpinner from '@/components/upload/LoadingSpinner';
import { FileText, ExternalLink } from 'lucide-react';
import { useUploadState } from '@/hooks/useUploadState';

const Upload = () => {
  const {
    documents,
    loading,
    initializationError,
    uploadMode,
    setUploadMode,
    sideALabel,
    sideBLabel,
    handleUploadComplete,
    handleDualSideUploadComplete,
    handleOCRComplete,
    handleDualSideOCRComplete,
    handleSideLabelChange,
    handleContinue
  } = useUploadState();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col juridika-background">
      <Header />
      
      <main className="flex-grow py-12 px-4">
        <div className="juridika-container">
          <div className="max-w-6xl mx-auto">
            <UploadHeader />
            <ErrorAlert error={initializationError} />

            {/* Enhanced Upload Mode Selector */}
            <EnhancedUploadModeSelector
              mode={uploadMode}
              onModeChange={setUploadMode}
            />
            
            {/* Upload Sections */}
            {uploadMode === 'comparative' ? (
              <EnhancedDualSideUploader
                sideALabel={sideALabel}
                sideBLabel={sideBLabel}
                onSideLabelChange={handleSideLabelChange}
                onUploadComplete={handleDualSideUploadComplete}
                onOCRComplete={handleDualSideOCRComplete}
              />
            ) : (
              <EnhancedSingleModeUploader
                onUploadComplete={handleUploadComplete}
                onOCRComplete={handleOCRComplete}
              />
            )}

            {/* NJ.se Integration Section */}
            <div className="juridika-card mt-12">
              <div className="flex items-center mb-6">
                <ExternalLink className="h-8 w-8 text-juridika-gold mr-4" />
                <h2 className="text-2xl font-bold text-juridika-charcoal">
                  Juridisk Databas Integration
                </h2>
              </div>
              <NJIntegration />
            </div>
            
            {/* Enhanced Documents List Section */}
            <div className="juridika-card mt-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-juridika-gold mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-juridika-charcoal">
                      Uppladdade Dokument ({documents.length})
                    </h2>
                    <p className="text-juridika-gray mt-1">
                      Granska dina dokument innan analys
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <DocumentsList
                  documents={documents}
                  uploadMode={uploadMode}
                  sideALabel={sideALabel}
                  sideBLabel={sideBLabel}
                  onContinue={handleContinue}
                />
              </div>
            </div>
            
            <InformationSection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
