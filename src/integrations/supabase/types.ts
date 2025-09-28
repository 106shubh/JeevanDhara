export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          action_required: string | null
          amu_entry_id: string | null
          animal_id: string | null
          can_dismiss: boolean | null
          created_at: string
          id: string
          is_dismissed: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          action_required?: string | null
          amu_entry_id?: string | null
          animal_id?: string | null
          can_dismiss?: boolean | null
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          action_required?: string | null
          amu_entry_id?: string | null
          animal_id?: string | null
          can_dismiss?: boolean | null
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_amu_entry_id_fkey"
            columns: ["amu_entry_id"]
            isOneToOne: false
            referencedRelation: "amu_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      amu_entries: {
        Row: {
          administered_by: string | null
          administration_date: string
          animal_id: string
          antimicrobial_id: string
          batch_number: string | null
          created_at: string
          dosage_given: string
          id: string
          notes: string | null
          prescription_id: string | null
          updated_at: string
          user_id: string
          withdrawal_end_date: string
        }
        Insert: {
          administered_by?: string | null
          administration_date: string
          animal_id: string
          antimicrobial_id: string
          batch_number?: string | null
          created_at?: string
          dosage_given: string
          id?: string
          notes?: string | null
          prescription_id?: string | null
          updated_at?: string
          user_id: string
          withdrawal_end_date: string
        }
        Update: {
          administered_by?: string | null
          administration_date?: string
          animal_id?: string
          antimicrobial_id?: string
          batch_number?: string | null
          created_at?: string
          dosage_given?: string
          id?: string
          notes?: string | null
          prescription_id?: string | null
          updated_at?: string
          user_id?: string
          withdrawal_end_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "amu_entries_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amu_entries_antimicrobial_id_fkey"
            columns: ["antimicrobial_id"]
            isOneToOne: false
            referencedRelation: "antimicrobials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amu_entries_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          age_months: number | null
          animal_id: string
          breed: string | null
          created_at: string
          id: string
          species: Database["public"]["Enums"]["animal_species"]
          status: string | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age_months?: number | null
          animal_id: string
          breed?: string | null
          created_at?: string
          id?: string
          species: Database["public"]["Enums"]["animal_species"]
          status?: string | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age_months?: number | null
          animal_id?: string
          breed?: string | null
          created_at?: string
          id?: string
          species?: Database["public"]["Enums"]["animal_species"]
          status?: string | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      antimicrobials: {
        Row: {
          active_ingredient: string | null
          created_at: string
          id: string
          mrl_limit_mg_kg: number | null
          name: string
          withdrawal_period_days: number
        }
        Insert: {
          active_ingredient?: string | null
          created_at?: string
          id?: string
          mrl_limit_mg_kg?: number | null
          name: string
          withdrawal_period_days: number
        }
        Update: {
          active_ingredient?: string | null
          created_at?: string
          id?: string
          mrl_limit_mg_kg?: number | null
          name?: string
          withdrawal_period_days?: number
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          animal_id: string
          antimicrobial_id: string
          created_at: string
          dosage: string
          duration_days: number
          expiry_date: string | null
          file_url: string | null
          frequency: string
          id: string
          issue_date: string
          notes: string | null
          prescription_id: string
          reason: Database["public"]["Enums"]["amu_reason"]
          status: string | null
          updated_at: string
          user_id: string
          veterinarian_license: string | null
          veterinarian_name: string
        }
        Insert: {
          animal_id: string
          antimicrobial_id: string
          created_at?: string
          dosage: string
          duration_days: number
          expiry_date?: string | null
          file_url?: string | null
          frequency: string
          id?: string
          issue_date: string
          notes?: string | null
          prescription_id: string
          reason: Database["public"]["Enums"]["amu_reason"]
          status?: string | null
          updated_at?: string
          user_id: string
          veterinarian_license?: string | null
          veterinarian_name: string
        }
        Update: {
          animal_id?: string
          antimicrobial_id?: string
          created_at?: string
          dosage?: string
          duration_days?: number
          expiry_date?: string | null
          file_url?: string | null
          frequency?: string
          id?: string
          issue_date?: string
          notes?: string | null
          prescription_id?: string
          reason?: Database["public"]["Enums"]["amu_reason"]
          status?: string | null
          updated_at?: string
          user_id?: string
          veterinarian_license?: string | null
          veterinarian_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_antimicrobial_id_fkey"
            columns: ["antimicrobial_id"]
            isOneToOne: false
            referencedRelation: "antimicrobials"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          farm_name: string | null
          full_name: string | null
          id: string
          language: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          farm_name?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      // Add new tables for food safety monitoring
      food_safety_samples: {
        Row: {
          id: string
          user_id: string
          sample_id: string
          food_category: Database["public"]["Enums"]["food_category"]
          collection_date: string
          farm_location: string | null
          lab_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sample_id: string
          food_category: Database["public"]["Enums"]["food_category"]
          collection_date: string
          farm_location?: string | null
          lab_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sample_id?: string
          food_category?: Database["public"]["Enums"]["food_category"]
          collection_date?: string
          farm_location?: string | null
          lab_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_safety_samples_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      food_safety_contaminants: {
        Row: {
          id: string
          name: string
          contaminant_type: Database["public"]["Enums"]["contaminant_type"]
          mrl_limit: number | null
          unit: string | null
          test_method: Database["public"]["Enums"]["test_method"] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contaminant_type: Database["public"]["Enums"]["contaminant_type"]
          mrl_limit?: number | null
          unit?: string | null
          test_method?: Database["public"]["Enums"]["test_method"] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contaminant_type?: Database["public"]["Enums"]["contaminant_type"]
          mrl_limit?: number | null
          unit?: string | null
          test_method?: Database["public"]["Enums"]["test_method"] | null
          created_at?: string
        }
        Relationships: []
      }
      food_safety_test_results: {
        Row: {
          id: string
          sample_id: string
          contaminant_id: string
          detected_level: number | null
          status: Database["public"]["Enums"]["test_status"]
          notes: string | null
          tested_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sample_id: string
          contaminant_id: string
          detected_level?: number | null
          status: Database["public"]["Enums"]["test_status"]
          notes?: string | null
          tested_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sample_id?: string
          contaminant_id?: string
          detected_level?: number | null
          status?: Database["public"]["Enums"]["test_status"]
          notes?: string | null
          tested_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_safety_test_results_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "food_safety_samples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_safety_test_results_contaminant_id_fkey"
            columns: ["contaminant_id"]
            isOneToOne: false
            referencedRelation: "food_safety_contaminants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type: "urgent" | "warning" | "compliant" | "pending"
      amu_reason:
        | "treatment"
        | "prevention"
        | "metaphylaxis"
        | "growth_promotion"
      animal_species: "cattle" | "sheep" | "goat" | "pig" | "poultry"
      // Add new enums for food safety
      food_category: "milk" | "honey" | "meat" | "fish" | "cereals" | "fruits" | "beverages"
      contaminant_type: "Antibiotic" | "Pesticide" | "Heavy Metal" | "Mycotoxin" | "Chemical" | "Dye" | "Beta-Agonist" | "Sweetener" | "Herbicide" | "Fungicide" | "Insecticide"
      test_status: "safe" | "warning" | "unsafe"
      test_method: "LC-MS/MS" | "GC-MS" | "HPLC" | "ICP-MS" | "ELISA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: ["urgent", "warning", "compliant", "pending"],
      amu_reason: [
        "treatment",
        "prevention",
        "metaphylaxis",
        "growth_promotion",
      ],
      animal_species: ["cattle", "sheep", "goat", "pig", "poultry"],
    },
  },
} as const
