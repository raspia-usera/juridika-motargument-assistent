
import { supabase } from './client';
import { getSessionId } from './session';

// Upload file to Supabase
export const uploadDocument = async (file: File): Promise<string | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    // Upload to storage
    const filePath = `${sessionId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;

    // Create document record
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        session_id: sessionId,
        filename: file.name,
        mimetype: file.type,
        storage_path: filePath,
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

// Get documents by session
export const getSessionDocuments = async () => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
      
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
