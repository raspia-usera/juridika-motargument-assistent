
import { supabase } from '@/integrations/supabase/client';

// Execute all migrations in sequence when the app starts
export const executeMigrations = async () => {
  try {
    console.log('Starting migration execution...');

    // Create function for setting up sessions table
    const createSessionsFunc = `
      CREATE OR REPLACE FUNCTION create_sessions_table_if_not_exists()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.sessions (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Enable RLS
        ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;
        
        -- Create policies if they don't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Anyone can create sessions'
        ) THEN
          CREATE POLICY "Anyone can create sessions" 
            ON public.sessions FOR INSERT 
            TO anon
            WITH CHECK (true);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Anyone can read sessions'
        ) THEN
          CREATE POLICY "Anyone can read sessions" 
            ON public.sessions FOR SELECT 
            TO anon
            USING (true);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function for setting up documents table
    const createDocumentsFunc = `
      CREATE OR REPLACE FUNCTION create_documents_table_if_not_exists()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          filename TEXT NOT NULL,
          mimetype TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          session_id TEXT NOT NULL REFERENCES public.sessions(id),
          storage_path TEXT NOT NULL,
          content TEXT
        );
        
        -- Enable RLS
        ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
        
        -- Create policies if they don't exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Anyone can read documents'
        ) THEN
          CREATE POLICY "Anyone can read documents" 
            ON public.documents FOR SELECT 
            TO anon
            USING (true);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Anyone can create documents'
        ) THEN
          CREATE POLICY "Anyone can create documents" 
            ON public.documents FOR INSERT 
            TO anon
            WITH CHECK (true);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Anyone can update documents'
        ) THEN
          CREATE POLICY "Anyone can update documents" 
            ON public.documents FOR UPDATE 
            TO anon
            USING (true);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function for setting up users table
    const createUsersFunc = `
      CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID REFERENCES auth.users PRIMARY KEY,
          email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Enable RLS
        ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Execute function creations
    const { error: sessionsError } = await supabase.rpc('execute_sql', { sql_statement: createSessionsFunc });
    if (sessionsError) console.error('Error creating sessions function:', sessionsError);
    
    const { error: documentsError } = await supabase.rpc('execute_sql', { sql_statement: createDocumentsFunc });
    if (documentsError) console.error('Error creating documents function:', documentsError);
    
    const { error: usersError } = await supabase.rpc('execute_sql', { sql_statement: createUsersFunc });
    if (usersError) console.error('Error creating users function:', usersError);
    
    // Now call the functions to ensure tables exist
    await supabase.rpc('create_sessions_table_if_not_exists');
    await supabase.rpc('create_documents_table_if_not_exists');
    await supabase.rpc('create_users_table_if_not_exists');
    
    console.log('Migrations completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration execution failed:', error);
    return false;
  }
};

// This function creates the storage buckets if they don't exist
export const setupStorage = async () => {
  try {
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) throw getBucketsError;
    
    // Check if documents bucket exists
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket('documents', {
        public: false,
      });
      
      if (createBucketError) throw createBucketError;
      
      console.log('Created documents bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up storage:', error);
    return false;
  }
};
