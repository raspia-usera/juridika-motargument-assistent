
// Main document processor - now imports from modular files
export { validateFile } from './upload/fileValidation';
export { uploadDocument, createDocumentFromText } from './upload/documentUpload';
export { extractTextFromImage, processFile } from './upload/ocrProcessing';
export { processUploadedDocument } from './upload/documentProcessing';
export { generateCounterarguments } from './upload/counterarguments';

// Re-export processFile from the correct location for backwards compatibility
export { processFile as processFile } from './upload/documentProcessing';
