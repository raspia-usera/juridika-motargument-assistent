import mammoth from 'mammoth';
import { supabase } from '@/lib/supabase/client';
import { extractDocumentContent } from '@/lib/supabase/documents';
import { classifyDocument } from '@/lib/juridika/documentClassifier';
import { performLegalAnalysis } from '@/lib/juridika/legalAnalyzer';
import { getSessionId } from '@/lib/supabase/session';

// Function to convert base64 to blob
const base64ToBlob = (base64: string, type: string): Blob => {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type: type });
};

// Function to extract text from image using OCR.space API
export const extractTextFromImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('apikey', 'K87244774488957');
    formData.append('language', 'swe');
    formData.append('isOverlayRequired', 'false');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('file', file);

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result && result.ParsedResults && result.ParsedResults.length > 0) {
      return result.ParsedResults[0].ParsedText;
    } else {
      console.error('OCR failed or no text found:', result);
      return null;
    }
  } catch (error) {
    console.error('Error during OCR:', error);
    return null;
  }
};

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

// Enhanced counterargument generation with legal knowledge
export const generateCounterarguments = async (documents: Array<{id: string, content: string}>) => {
  try {
    console.log('Generating counterarguments for', documents.length, 'documents');
    
    const sessionId = await getSessionId();
    if (!sessionId) {
      throw new Error('No session ID available');
    }

    const documentIds = documents.map(doc => doc.id);
    
    // Perform legal analysis using the new AI backend
    const analysisResult = await performLegalAnalysis({
      documentIds,
      sessionId,
      analysisType: 'counterargument'
    });

    if (!analysisResult) {
      throw new Error('Failed to generate legal analysis');
    }

    // Convert the analysis to the expected format
    return {
      claims: analysisResult.analysis.claims || [],
      analysis_mode: 'comparative'
    };
  } catch (error) {
    console.error('Error generating counterarguments:', error);
    return null;
  }
};

// Create document from text with enhanced processing
export const createDocumentFromText = async (
  text: string, 
  filename: string,
  side?: 'A' | 'B',
  sideLabel?: string,
  analysisMode: 'single' | 'comparative' = 'single'
): Promise<string | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    // Create text file blob
    const textBlob = new Blob([text], { type: 'text/plain' });
    const sanitizedName = filename.replace(/[<>:"|?*]/g, '_');
    const filePath = `${sessionId}/${Date.now()}_${sanitizedName}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, textBlob);
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Kunde inte ladda upp den extraherade texten. Försök igen.');
    }

    // Create document record with side information
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        session_id: sessionId,
        filename: filename,
        mimetype: 'text/plain',
        storage_path: filePath,
        content: text,
        side: side || null,
        side_label: sideLabel || null,
        analysis_mode: analysisMode
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Kunde inte spara dokumentinformation. Försök igen.');
    }
    
    const documentId = data?.id;
    console.log('Document created with ID:', documentId);
    
    // Classify the document if it has meaningful content
    if (text.length > 50) {
      console.log('Classifying OCR document...');
      await classifyDocument(documentId, text);
    }
    
    return documentId;
  } catch (error) {
    console.error('Error creating document from text:', error);
    return null;
  }
};
