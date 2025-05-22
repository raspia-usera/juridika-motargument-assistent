
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anon key is missing. Please connect to Supabase in Lovable.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const setupSupabase = async () => {
  try {
    // Create documents table
    const { error: documentsTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'documents',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        session_id uuid not null,
        file_name text not null,
        file_type text not null,
        file_size integer not null,
        file_path text not null,
        created_at timestamp with time zone default now(),
        content text,
        status text default 'uploaded'
      `
    });
    
    if (documentsTableError) throw documentsTableError;

    // Create analyses table
    const { error: analysesTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'analyses',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        session_id uuid not null,
        document_ids uuid[] not null,
        created_at timestamp with time zone default now(),
        arguments jsonb,
        status text default 'pending'
      `
    });
    
    if (analysesTableError) throw analysesTableError;

    // Create sessions table (for anonymous sessions)
    const { error: sessionsTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'sessions',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        created_at timestamp with time zone default now(),
        last_active timestamp with time zone default now(),
        user_id uuid
      `
    });
    
    if (sessionsTableError) throw sessionsTableError;

    // Create storage bucket for documents
    const { error: bucketError } = await supabase.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/rtf',
        'text/html',
        'text/plain'
      ]
    });

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      throw bucketError;
    }

    console.log('Supabase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
};

// Generate a new session ID for anonymous users
export const createSession = async () => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({})
      .select('id')
      .single();
      
    if (error) throw error;
    
    localStorage.setItem('juridika_session_id', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

// Get or create session ID
export const getSessionId = async () => {
  const existingSessionId = localStorage.getItem('juridika_session_id');
  
  if (existingSessionId) {
    // Update last_active timestamp
    await supabase
      .from('sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('id', existingSessionId);
    
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
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_path: filePath,
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
        content: content,
        status: 'processed'
      })
      .eq('id', documentId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error extracting document content:', error);
    return false;
  }
};

// Create analysis for documents
export const createAnalysis = async (documentIds: string[]) => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) throw new Error('No session ID available');
    
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        session_id: sessionId,
        document_ids: documentIds,
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
};

// Update analysis results
export const updateAnalysisResults = async (analysisId: string, analysisArgs: any) => {
  try {
    const { error } = await supabase
      .from('analyses')
      .update({
        arguments: analysisArgs,
        status: 'completed'
      })
      .eq('id', analysisId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating analysis results:', error);
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
