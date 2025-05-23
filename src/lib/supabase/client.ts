
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
