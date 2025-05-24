
import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Image, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { createWorker } from 'tesseract.js';

interface OCRUploaderProps {
  onTextExtracted: (text: string, filename: string) => void;
}

const OCRUploader: React.FC<OCRUploaderProps> = ({ onTextExtracted }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImageWithOCR = async (file: File) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      console.log('Starting OCR processing for:', file.name);
      
      const worker = await createWorker('swe', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      if (!text.trim()) {
        throw new Error('Ingen text kunde hittas i bilden. Kontrollera att bilden är tydlig och innehåller text.');
      }

      const filename = `${file.name.split('.')[0]}_ocr.txt`;
      setSuccess(`Text extraherad från "${file.name}" (${text.length} tecken)`);
      
      setTimeout(() => {
        onTextExtracted(text, filename);
        setProcessing(false);
        setSuccess(null);
        setProgress(0);
      }, 1500);

      toast({
        title: 'OCR klar',
        description: `Text extraherad från "${file.name}"`,
      });

    } catch (err) {
      console.error('OCR error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ett fel inträffade vid textextrahering';
      setError(errorMessage);
      setProcessing(false);
      setProgress(0);

      toast({
        title: 'OCR-fel',
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    await processImageWithOCR(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: processing,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff', '.tif'],
      'image/gif': ['.gif']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageWithOCR(file);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <p className="text-sm text-slate-600 mb-2">
          Har du bara en pappersversion? Ta ett foto av ditt dokument.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-teal-400 bg-teal-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : success 
                ? 'border-teal-300 bg-teal-50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <input {...getInputProps()} />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <div className="flex flex-col items-center text-center">
          {processing ? (
            <div className="w-full space-y-4">
              <Image className="mx-auto h-12 w-12 text-teal-500 animate-pulse" />
              <p className="text-slate-700 font-medium">Extraherar text...</p>
              <Progress value={progress} className="h-3 w-full" />
              <p className="text-sm text-slate-600">
                Bearbetar bilden med OCR-teknik
              </p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <CheckCircle2 className="h-12 w-12 text-teal-500 mx-auto" />
              <p className="text-teal-700 font-medium">{success}</p>
            </div>
          ) : (
            <>
              <Camera className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-700 font-medium mb-2">
                Dra och släpp bilder här, eller klicka för att välja
              </p>
              <p className="text-slate-600 text-sm mb-4">
                Stödda format: JPG, PNG, HEIC, BMP, WEBP, PDF och mer
              </p>
              {error && (
                <div className="mt-4 text-red-600 flex items-center space-x-2 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center space-x-3">
        <Button
          variant="outline"
          disabled={processing}
          onClick={handleCameraCapture}
          className="bg-white hover:bg-slate-50 border-slate-300"
        >
          <Camera className="h-4 w-4 mr-2" />
          Ta foto
        </Button>
        <Button
          variant="outline"
          disabled={processing}
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]:not([capture])')?.click()}
          className="bg-white hover:bg-slate-50 border-slate-300"
        >
          <Upload className="h-4 w-4 mr-2" />
          Välj bild
        </Button>
      </div>
    </div>
  );
};

export default OCRUploader;
