
// Main document processor - now imports from modular files
export { validateFile } from './upload/fileValidation';
export { uploadDocument, createDocumentFromText } from './upload/documentUpload';
export { extractTextFromImage } from './upload/ocrProcessing';
export { processUploadedDocument, processFile } from './upload/documentProcessing';
export { generateCounterarguments } from './upload/counterarguments';
