
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocument } from '@/lib/documentProcessor';
import { Button } from '@/components/ui/button';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onUploadComplete: (documentId: string) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      for (const file of acceptedFiles) {
        // Validate file type
        if (!isValidFileType(file.type)) {
          setError('Ogiltig filtyp. Stödda format är PDF, DOCX, RTF, HTML och TXT.');
          setUploading(false);
          return;
        }

        // Artificial progress for UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        // Upload file to Supabase
        const documentId = await uploadDocument(file);
        
        if (!documentId) {
          throw new Error('Kunde inte ladda upp filen');
        }

        clearInterval(progressInterval);
        setProgress(100);

        setTimeout(() => {
          setUploading(false);
          toast({
            title: 'Uppladdning klar',
            description: `Filen "${file.name}" har laddats upp och bearbetats.`,
          });
          onUploadComplete(documentId);
        }, 500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Ett oväntat fel inträffade');
      setUploading(false);
      setProgress(0);

      toast({
        title: 'Uppladdningsfel',
        description: err instanceof Error ? err.message : 'Ett oväntat fel inträffade',
        variant: "destructive",
      });
    }
  }, [onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/rtf': ['.rtf'],
      'text/html': ['.html', '.htm'],
      'text/plain': ['.txt']
    }
  });

  const isValidFileType = (fileType: string): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/html',
      'text/plain'
    ];
    return validTypes.includes(fileType);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
          isDragActive ? 'border-juridika-purple bg-juridika-softpurple/30' : 'border-juridika-lightgray hover:border-juridika-purple/60'
        } ${error ? 'border-red-300' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          {uploading ? (
            <div className="w-full space-y-4">
              <File className="mx-auto h-12 w-12 text-juridika-purple animate-pulse" />
              <p className="text-juridika-charcoal">Bearbetar fil...</p>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-juridika-midgray mb-4" />
              <p className="text-juridika-charcoal font-medium mb-1">
                Dra och släpp filer här, eller klicka för att välja
              </p>
              <p className="text-juridika-gray text-sm">
                Stödda format: PDF, DOCX, RTF, HTML, TXT (max 50MB)
              </p>
              {error && (
                <div className="mt-4 text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="default"
          disabled={uploading}
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          className="juridika-btn-primary"
        >
          Välj fil
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
