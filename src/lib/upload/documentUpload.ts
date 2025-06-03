
import { supabase } from '@/lib/supabase/client';
import { getSessionId } from '@/lib/supabase/session';
import { processUploadedDocument } from './documentProcessing';

// Main upload function
export const uploadDocument = async (
  file: File,
  side?: 'A' | 'B',
  sideLabel?: string,
  analysisMode: 'single' | 'comparative' = 'single'
): Promise<string | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    // Create unique file path
    const sanitizedName = file.name.replace(/[<>:"|?*]/g, '_');
    const filePath = `${sessionId}/${Date.now()}_${sanitizedName}`;
    
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Kunde inte ladda upp filen. Försök igen.');
    }

    // Create document record
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        session_id: sessionId,
        filename: file.name,
        mimetype: file.type,
        storage_path: filePath,
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
    console.log('Document uploaded with ID:', documentId);
    
    // Process the document content
    await processUploadedDocument(file, documentId);
    
    return documentId;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
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
      const { classifyDocument } = await import('@/lib/juridika/documentClassifier');
      await classifyDocument(documentId, text);
    }
    
    return documentId;
  } catch (error) {
    console.error('Error creating document from text:', error);
    return null;
  }
};
