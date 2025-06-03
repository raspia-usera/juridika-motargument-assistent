export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_analyses: {
        Row: {
          analysis_results: Json
          analysis_type: string
          confidence_metrics: Json | null
          created_at: string
          document_ids: string[]
          id: string
          legal_area: string | null
          legal_references: Json | null
          next_steps: Json | null
          processing_time_ms: number | null
          session_id: string
          strength_assessment: Json | null
        }
        Insert: {
          analysis_results: Json
          analysis_type: string
          confidence_metrics?: Json | null
          created_at?: string
          document_ids: string[]
          id?: string
          legal_area?: string | null
          legal_references?: Json | null
          next_steps?: Json | null
          processing_time_ms?: number | null
          session_id: string
          strength_assessment?: Json | null
        }
        Update: {
          analysis_results?: Json
          analysis_type?: string
          confidence_metrics?: Json | null
          created_at?: string
          document_ids?: string[]
          id?: string
          legal_area?: string | null
          legal_references?: Json | null
          next_steps?: Json | null
          processing_time_ms?: number | null
          session_id?: string
          strength_assessment?: Json | null
        }
        Relationships: []
      }
      document_classifications: {
        Row: {
          classification_metadata: Json | null
          complexity_score: number | null
          confidence_score: number | null
          created_at: string
          detected_claims: string[] | null
          document_id: string
          document_type: string
          id: string
          key_entities: Json | null
          legal_area: string | null
          urgency_level: number | null
        }
        Insert: {
          classification_metadata?: Json | null
          complexity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          detected_claims?: string[] | null
          document_id: string
          document_type: string
          id?: string
          key_entities?: Json | null
          legal_area?: string | null
          urgency_level?: number | null
        }
        Update: {
          classification_metadata?: Json | null
          complexity_score?: number | null
          confidence_score?: number | null
          created_at?: string
          detected_claims?: string[] | null
          document_id?: string
          document_type?: string
          id?: string
          key_entities?: Json | null
          legal_area?: string | null
          urgency_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_classifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          analysis_mode: string | null
          content: string | null
          created_at: string
          filename: string
          id: string
          mimetype: string
          session_id: string
          side: string | null
          side_label: string | null
          storage_path: string
        }
        Insert: {
          analysis_mode?: string | null
          content?: string | null
          created_at?: string
          filename: string
          id?: string
          mimetype: string
          session_id: string
          side?: string | null
          side_label?: string | null
          storage_path: string
        }
        Update: {
          analysis_mode?: string | null
          content?: string | null
          created_at?: string
          filename?: string
          id?: string
          mimetype?: string
          session_id?: string
          side?: string | null
          side_label?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_concepts: {
        Row: {
          category: string
          concept_name: string
          created_at: string
          description: string | null
          id: string
          sfs_reference: string | null
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          concept_name: string
          created_at?: string
          description?: string | null
          id?: string
          sfs_reference?: string | null
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          concept_name?: string
          created_at?: string
          description?: string | null
          id?: string
          sfs_reference?: string | null
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      legal_precedents: {
        Row: {
          case_reference: string
          court_level: string
          created_at: string
          decision_date: string | null
          full_text: string | null
          id: string
          legal_principle: string | null
          relevant_concepts: string[] | null
          summary: string
        }
        Insert: {
          case_reference: string
          court_level: string
          created_at?: string
          decision_date?: string | null
          full_text?: string | null
          id?: string
          legal_principle?: string | null
          relevant_concepts?: string[] | null
          summary: string
        }
        Update: {
          case_reference?: string
          court_level?: string
          created_at?: string
          decision_date?: string | null
          full_text?: string | null
          id?: string
          legal_principle?: string | null
          relevant_concepts?: string[] | null
          summary?: string
        }
        Relationships: []
      }
      legal_prompts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          legal_area: string
          prompt_name: string
          prompt_template: string
          prompt_type: string
          system_context: string | null
          updated_at: string
          variables: Json | null
          version: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          legal_area: string
          prompt_name: string
          prompt_template: string
          prompt_type: string
          system_context?: string | null
          updated_at?: string
          variables?: Json | null
          version?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          legal_area?: string
          prompt_name?: string
          prompt_template?: string
          prompt_type?: string
          system_context?: string | null
          updated_at?: string
          variables?: Json | null
          version?: number | null
        }
        Relationships: []
      }
      legal_updates: {
        Row: {
          affected_areas: string[] | null
          created_at: string
          description: string | null
          effective_date: string | null
          id: string
          impact_level: string | null
          processed: boolean | null
          source_url: string | null
          title: string
          update_type: string
        }
        Insert: {
          affected_areas?: string[] | null
          created_at?: string
          description?: string | null
          effective_date?: string | null
          id?: string
          impact_level?: string | null
          processed?: boolean | null
          source_url?: string | null
          title: string
          update_type: string
        }
        Update: {
          affected_areas?: string[] | null
          created_at?: string
          description?: string | null
          effective_date?: string | null
          id?: string
          impact_level?: string | null
          processed?: boolean | null
          source_url?: string | null
          title?: string
          update_type?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
