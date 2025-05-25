
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NJIntegration from '@/components/NJIntegration';
import UploadModeSelector from '@/components/UploadModeSelector';
import DualSideUploader from '@/components/DualSideUploader';
import UploadHeader from '@/components/upload/UploadHeader';
import ErrorAlert from '@/components/upload/ErrorAlert';
import SingleModeUploadSection from '@/components/upload/SingleModeUploadSection';
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
      
      <main className="flex-grow py-8 px-4">
        <div className="juridika-container">
          <div className="max-w-5xl mx-auto">
            <UploadHeader />
            <ErrorAlert error={initializationError} />

            {/* Upload Mode Selector */}
            <UploadModeSelector
              mode={uploadMode}
              onModeChange={setUploadMode}
            />
            
            {/* Upload Sections */}
            {uploadMode === 'comparative' ? (
              <DualSideUploader
                sideALabel={sideALabel}
                sideBLabel={sideBLabel}
                onSideLabelChange={handleSideLabelChange}
                onUploadComplete={handleDualSideUploadComplete}
                onOCRComplete={handleDualSideOCRComplete}
              />
            ) : (
              <SingleModeUploadSection
                onUploadComplete={handleUploadComplete}
                onOCRComplete={handleOCRComplete}
              />
            )}

            {/* NJ.se Integration Section */}
            <div className="juridika-card mb-8">
              <div className="flex items-center mb-4">
                <ExternalLink className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Juridisk databas
                </h2>
              </div>
              <NJIntegration />
            </div>
            
            {/* Documents List Section */}
            <div className="juridika-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-teal-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Uppladdade dokument ({documents.length})
                  </h2>
                </div>
              </div>
              
              <div className="space-y-4">
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
