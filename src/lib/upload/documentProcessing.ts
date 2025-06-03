
import mammoth from 'mammoth';
import { extractDocumentContent } from '@/lib/supabase/documents';
import { classifyDocument } from '@/lib/juridika/documentClassifier';
import { extractTextFromImage } from './ocrProcessing';

// Function to process file and return text
export const processFile = async (file: File): Promise<string | null> => {
  try {
    if (file.type.startsWith('image/')) {
      // Handle image files
      return await extractTextFromImage(file);
    } else if (file.type === 'application/pdf') {
      // Handle PDF files (you might need a PDF parsing library)
      return 'PDF parsing is not yet implemented.';
    } else if (file.type === 'text/plain') {
      // Handle plain text files
      return await file.text();
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle DOCX files
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      return result.value;
    } else {
      console.log('Unsupported file type:', file.type);
      return null;
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return null;
  }
};

// Enhanced document processing with classification
export const processUploadedDocument = async (file: File, documentId: string): Promise<boolean> => {
  try {
    console.log('Processing uploaded document:', file.name);
    
    // Extract text content
    let content = '';
    
    if (file.type === 'application/pdf') {
      // For PDFs, we'll need to implement PDF text extraction
      content = `PDF document: ${file.name}. Content extraction not yet implemented.`;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract text from DOCX
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value;
    } else if (file.type === 'text/plain' || file.type === 'text/rtf') {
      // Extract text from plain text files
      content = await file.text();
    } else {
      console.log('Unsupported file type for text extraction:', file.type);
      content = `Document: ${file.name}. File type: ${file.type}`;
    }

    // Save content to document
    const contentSaved = await extractDocumentContent(documentId, content);
    if (!contentSaved) {
      throw new Error('Failed to save document content');
    }

    // Classify document using AI
    if (content.length > 50) { // Only classify if we have meaningful content
      console.log('Classifying document with AI...');
      await classifyDocument(documentId, content);
    }

    return true;
  } catch (error) {
    console.error('Error processing document:', error);
    return false;
  }
};
