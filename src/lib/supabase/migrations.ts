
import { supabase } from './client';

// Setup Supabase tables and RLS policies
export const setupSupabase = async () => {
  try {
    // Create sessions table if it doesn't exist
    const sessionsResponse = await supabase.rpc('create_sessions_table_if_not_exists');
    if (sessionsResponse.error) {
      console.error('Could not create sessions table:', sessionsResponse.error);
    }

    // Create documents table if it doesn't exist
    const documentsResponse = await supabase.rpc('create_documents_table_if_not_exists');
    if (documentsResponse.error) {
      console.error('Could not create documents table:', documentsResponse.error);
    }

    // Create users table if it doesn't exist
    const usersResponse = await supabase.rpc('create_users_table_if_not_exists');
    if (usersResponse.error) {
      console.error('Could not create users table:', usersResponse.error);
    }

    console.log('Supabase setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
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
