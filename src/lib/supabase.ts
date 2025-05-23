
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

export const setupSupabase = async () => {
  try {
    // Create sessions table if it doesn't exist
    const { error: sessionsTableError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.sessions (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      )
    `);
    
    if (sessionsTableError) throw sessionsTableError;

    // Create documents table if it doesn't exist
    const { error: documentsTableError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        session_id TEXT NOT NULL REFERENCES public.sessions(id),
        storage_path TEXT NOT NULL,
        content TEXT
      )
    `);
    
    if (documentsTableError) throw documentsTableError;

    // Create users table for future authentication
    const { error: usersTableError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID REFERENCES auth.users PRIMARY KEY,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      )
    `);
    
    if (usersTableError) throw usersTableError;

    // Enable RLS on tables
    await supabase.query(`ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY`);
    await supabase.query(`ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY`);
    await supabase.query(`ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY`);

    // Create temporary RLS policies for anonymous access (testing only)
    // NOTE: These should be replaced with stricter policies in production mode

    // RLS for sessions table
    await supabase.query(`
      CREATE POLICY IF NOT EXISTS "Anyone can create sessions" 
      ON public.sessions FOR INSERT 
      TO anon
      WITH CHECK (true)
    `);

    await supabase.query(`
      CREATE POLICY IF NOT EXISTS "Anyone can read sessions" 
      ON public.sessions FOR SELECT 
      TO anon
      USING (true)
    `);

    // RLS for documents table
    await supabase.query(`
      CREATE POLICY IF NOT EXISTS "Anyone can read documents" 
      ON public.documents FOR SELECT 
      TO anon
      USING (true)
    `);

    await supabase.query(`
      CREATE POLICY IF NOT EXISTS "Anyone can create documents" 
      ON public.documents FOR INSERT 
      TO anon
      WITH CHECK (true)
    `);

    await supabase.query(`
      CREATE POLICY IF NOT EXISTS "Anyone can update documents" 
      ON public.documents FOR UPDATE 
      TO anon
      USING (true)
    `);

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
    
    return data.id;
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
