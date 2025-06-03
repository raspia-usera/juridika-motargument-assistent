
import { supabase } from '@/integrations/supabase/client';

export interface LegalConcept {
  id: string;
  concept_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  sfs_reference?: string;
}

export interface LegalPrecedent {
  id: string;
  case_reference: string;
  court_level: string;
  decision_date?: string;
  summary: string;
  legal_principle?: string;
  relevant_concepts?: string[];
}

export interface LegalPrompt {
  id: string;
  prompt_name: string;
  legal_area: string;
  prompt_type: string;
  prompt_template: string;
  system_context?: string;
  variables?: any;
}

export const getLegalConcepts = async (category?: string, subcategory?: string): Promise<LegalConcept[]> => {
  try {
    let query = supabase
      .from('legal_concepts')
      .select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (subcategory) {
      query = query.eq('subcategory', subcategory);
    }

    const { data, error } = await query.order('concept_name');

    if (error) {
      console.error('Error fetching legal concepts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLegalConcepts:', error);
    return [];
  }
};

export const getLegalPrecedents = async (legalArea?: string): Promise<LegalPrecedent[]> => {
  try {
    let query = supabase
      .from('legal_precedents')
      .select('*');

    if (legalArea) {
      query = query.contains('relevant_concepts', [legalArea]);
    }

    const { data, error } = await query.order('decision_date', { ascending: false });

    if (error) {
      console.error('Error fetching legal precedents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLegalPrecedents:', error);
    return [];
  }
};

export const getLegalPrompts = async (legalArea?: string, promptType?: string): Promise<LegalPrompt[]> => {
  try {
    let query = supabase
      .from('legal_prompts')
      .select('*')
      .eq('is_active', true);

    if (legalArea) {
      query = query.eq('legal_area', legalArea);
    }

    if (promptType) {
      query = query.eq('prompt_type', promptType);
    }

    const { data, error } = await query.order('prompt_name');

    if (error) {
      console.error('Error fetching legal prompts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getLegalPrompts:', error);
    return [];
  }
};

export const searchLegalKnowledge = async (searchTerm: string) => {
  try {
    // Search across concepts, precedents, and prompts
    const [conceptsResult, precedentsResult] = await Promise.all([
      supabase
        .from('legal_concepts')
        .select('*')
        .or(`concept_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`),
      supabase
        .from('legal_precedents')
        .select('*')
        .or(`case_reference.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,legal_principle.ilike.%${searchTerm}%`)
    ]);

    return {
      concepts: conceptsResult.data || [],
      precedents: precedentsResult.data || [],
    };
  } catch (error) {
    console.error('Error in searchLegalKnowledge:', error);
    return {
      concepts: [],
      precedents: [],
    };
  }
};
