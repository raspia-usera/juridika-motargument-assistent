import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocument, validateFile } from '@/lib/documentProcessor';
import { Button } from '@/components/ui/button';
import { Upload, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onUploadComplete: (documentId: string) => void;
  side?: 'A' | 'B';
  sideLabel?: string;
  analysisMode?: 'single' | 'comparative';
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  onUploadComplete, 
  side, 
  sideLabel,
  analysisMode = 'single'
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      for (const file of acceptedFiles) {
        console.log('Processing file:', file.name, file.type, file.size, 'Side:', side);
        
        // Validate file first
        const validation = validateFile(file);
        if (!validation.isValid) {
          setError(validation.error || 'Filvalidering misslyckades');
          setUploading(false);
          toast({
            title: 'Filfel',
            description: validation.error,
            variant: "destructive",
          });
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

        // Upload file to Supabase with side information
        const documentId = await uploadDocument(file, side, sideLabel, analysisMode);
        
        clearInterval(progressInterval);
        
        if (!documentId) {
          throw new Error('Kunde inte ladda upp filen. Kontrollera din internetanslutning och försök igen.');
        }

        setProgress(100);
        setSuccess(`Filen "${file.name}" har laddats upp och bearbetats framgångsrikt.`);

        setTimeout(() => {
          setUploading(false);
          const sideText = side && sideLabel ? ` till ${sideLabel}` : '';
          toast({
            title: 'Uppladdning klar',
            description: `Filen "${file.name}" har laddats upp${sideText}.`,
          });
          onUploadComplete(documentId);
          setSuccess(null);
          setProgress(0);
        }, 1500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ett oväntat fel inträffade under uppladdningen';
      setError(errorMessage);
      setUploading(false);
      setProgress(0);

      toast({
        title: 'Uppladdningsfel',
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [onUploadComplete, toast, side, sideLabel, analysisMode]);

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
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-emerald-400 bg-emerald-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : success 
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          {uploading ? (
            <div className="w-full space-y-4">
              <File className="mx-auto h-12 w-12 text-emerald-500 animate-pulse" />
              <p className="text-slate-700 font-medium">Bearbetar fil...</p>
              <Progress value={progress} className="h-3 w-full" />
              <p className="text-sm text-slate-600">
                Laddar upp och extraherar text från dokumentet
              </p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="text-emerald-700 font-medium">{success}</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-700 font-medium mb-2">
                Dra och släpp filer här, eller klicka för att välja
              </p>
              <p className="text-slate-600 text-sm mb-4">
                Stödda format: PDF, DOCX, RTF, HTML, TXT (max 50MB)
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

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          className="bg-white hover:bg-slate-50 border-slate-300"
        >
          {uploading ? 'Laddar upp...' : 'Välj fil'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
