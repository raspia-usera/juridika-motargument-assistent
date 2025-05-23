
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  onDownload: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onDownload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // This would be used if we were loading a multi-page PDF
  // Currently only for display as we're using a data URI
  const onIframeLoad = () => {
    // In a real implementation, we could get the total pages
    // from the PDF document object
    console.log("PDF loaded in iframe");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-4 relative">
        <iframe 
          src={pdfUrl} 
          className="border rounded w-full"
          style={{ height: isFullscreen ? '70vh' : '400px' }}
          title="PDF-förhandsgranskning"
          onLoad={onIframeLoad}
        />
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsFullscreen(true)}
                className="bg-white/80 hover:bg-white"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh]">
              <DialogTitle>PDF Rapport</DialogTitle>
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border rounded"
                title="PDF-Fullskärm"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Föregående
          </Button>
          <span className="text-sm text-juridika-charcoal">
            Sida {currentPage} av {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Nästa <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <Button 
          onClick={onDownload}
          className="juridika-btn-secondary"
        >
          <Download className="h-4 w-4 mr-2" /> Ladda ner PDF
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;
