
import { createClient } from '@supabase/supabase-js';

// Use direct values instead of environment variables for testing
// NOTE: In production, these should be environment variables
const supabaseUrl = "https://ebwyjknqolddyedbczjt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVid3lqa25xb2xkZHllZGJjemp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDM2MTIsImV4cCI6MjA2MzQ3OTYxMn0.9juCi44kFoFajrFC6gG5IsEWnK8zJEkJWc9fcWgSUk8";

// Check that values exist (for better safety)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anon key is missing.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Initialize tables when needed
export const setupSupabase = async () => {
  try {
    // Create sessions table if it doesn't exist
    const { error: sessionsTableError } = await supabase.rpc('create_sessions_table_if_not_exists');
    if (sessionsTableError) {
      // Try to execute raw SQL as a fallback
      await supabase.from('_schema').select('version');
      console.error('Could not create sessions table:', sessionsTableError);
    }

    // Create documents table if it doesn't exist
    const { error: documentsTableError } = await supabase.rpc('create_documents_table_if_not_exists');
    if (documentsTableError) {
      // Try to execute raw SQL as a fallback
      await supabase.from('_schema').select('version');
      console.error('Could not create documents table:', documentsTableError);
    }

    // Create users table if it doesn't exist
    const { error: usersTableError } = await supabase.rpc('create_users_table_if_not_exists');
    if (usersTableError) {
      // Try to execute raw SQL as a fallback
      await supabase.from('_schema').select('version');
      console.error('Could not create users table:', usersTableError);
    }

    // Note: RLS policies would ideally be set up via migration scripts
    // but we're checking if tables exist as a compromise for this prototype

    console.log('Supabase setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};

// Generate a new session ID for anonymous users
export const createSession = async () => {
  try {
    // Create a new UUID for the session
    const sessionId = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    localStorage.setItem('juridika_session_id', sessionId);
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

// Get or create session ID
export const getSessionId = async () => {
  const existingSessionId = localStorage.getItem('juridika_session_id');
  
  if (existingSessionId) {
    // Update last_active timestamp in the future if needed
    return existingSessionId;
  }
  
  return await createSession();
};

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
    
    return data?.id;
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
    
    return data;
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

// Create analysis for documents
export const createAnalysis = async (documentIds: string[]) => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    // For now, just return a mock ID since we don't have the analyses table yet
    return "mock-analysis-id-" + Date.now();
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
};

// Update analysis results
export const updateAnalysisResults = async (analysisId: string, analysisArgs: any) => {
  try {
    // Mock implementation since we don't have the analyses table yet
    console.log(`Analysis ${analysisId} updated with:`, analysisArgs);
    return true;
  } catch (error) {
    console.error('Error updating analysis results:', error);
    return false;
  }
};
