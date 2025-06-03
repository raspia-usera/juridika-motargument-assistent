
// File validation utilities
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/html',
    'text/plain'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: 'Filen är för stor. Maximal storlek är 50MB.' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Filtypen stöds inte. Använd PDF, DOCX, RTF, HTML eller TXT.' };
  }

  return { isValid: true };
};
