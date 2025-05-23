
import { supabase } from './client';

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
