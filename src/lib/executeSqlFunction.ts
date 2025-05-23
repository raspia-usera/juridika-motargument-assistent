
import { supabase } from '@/integrations/supabase/client';

export const createExecuteSqlFunction = async () => {
  try {
    // This is a workaround since we can't directly execute SQL with the Supabase client
    // We'll create a function that can execute SQL for us
    const { error } = await supabase.functions.invoke('create-execute-sql-function', {
      body: {
        action: 'create'
      }
    });
    
    if (error) {
      console.error('Error creating execute_sql function:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating execute_sql function:', error);
    return false;
  }
};
