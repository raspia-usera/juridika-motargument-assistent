
// Document type
export interface DocumentItem {
  id: string;
  filename: string;
  mimetype: string;
  created_at: string;
  session_id: string;
  storage_path: string;
  content?: string;
}

// Analysis types
export interface Counterargument {
  argument: string;
  strength: number;
  references: string[];
}

export interface Claim {
  claim: string;
  counterarguments: Counterargument[];
}

export interface AnalysisResult {
  claims: Claim[];
}
