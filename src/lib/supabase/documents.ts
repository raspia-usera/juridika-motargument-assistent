
import { supabase } from './client';
import { getSessionId } from './session';

// Upload file to Supabase with side assignment
export const uploadDocument = async (
  file: File, 
  side?: 'A' | 'B', 
  sideLabel?: string,
  analysisMode: 'single' | 'comparative' = 'single'
): Promise<string | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    // Upload to storage
    const filePath = `${sessionId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;

    // Create document record with side information
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
      
    if (insertError) throw insertError;
    
    return data?.id || null;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

// Extract and update document content
export const extractDocumentContent = async (documentId: string, content: string) => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({
        content: content
      })
      .eq('id', documentId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error extracting document content:', error);
    return false;
  }
};

// Get documents by session with side filtering
export const getSessionDocuments = async (side?: 'A' | 'B') => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    let query = supabase
      .from('documents')
      .select('*')
      .eq('session_id', sessionId);
    
    if (side) {
      query = query.eq('side', side);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting session documents:', error);
    return [];
  }
};

// Get document by ID
export const getDocumentById = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
};

// Create document from text with side assignment
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
    console.log('OCR document created with ID:', documentId);
    return documentId;
  } catch (error) {
    console.error('Error creating document from text:', error);
    return null;
  }
};
