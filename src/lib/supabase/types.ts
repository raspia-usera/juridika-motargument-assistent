
// Document type
export interface DocumentItem {
  id: string;
  filename: string;
  mimetype: string;
  created_at: string;
  session_id: string;
  storage_path: string;
  content?: string;
  side?: 'A' | 'B' | null;
  side_label?: string | null;
  analysis_mode?: 'single' | 'comparative';
}

// Analysis types
export interface Counterargument {
  argument: string;
  strength: number;
  references: string[];
  source?: 'opposing_document' | 'ai_generated';
}

export interface Claim {
  claim: string;
  counterarguments: Counterargument[];
}

export interface AnalysisResult {
  claims: Claim[];
  analysis_mode?: 'single' | 'comparative';
}
