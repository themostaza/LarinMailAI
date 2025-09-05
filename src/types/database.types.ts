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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      larin_functions: {
        Row: {
          body: Json | null
          created_at: string
          generally_available: boolean | null
          generally_visible: boolean | null
          id: string
          lucide_react_icon: string | null
          name: string | null
          slug: string | null
          unique_ui_code: string | null
          updated_at: string | null
        }
        Insert: {
          body?: Json | null
          created_at?: string
          generally_available?: boolean | null
          generally_visible?: boolean | null
          id?: string
          lucide_react_icon?: string | null
          name?: string | null
          slug?: string | null
          unique_ui_code?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: Json | null
          created_at?: string
          generally_available?: boolean | null
          generally_visible?: boolean | null
          id?: string
          lucide_react_icon?: string | null
          name?: string | null
          slug?: string | null
          unique_ui_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      link_general_lfunction_user_exception: {
        Row: {
          available: boolean | null
          created_at: string
          edited_at: string | null
          id: number
          lfunction_id: string | null
          user_id: string | null
          visible: boolean | null
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          edited_at?: string | null
          id?: number
          lfunction_id?: string | null
          user_id?: string | null
          visible?: boolean | null
        }
        Update: {
          available?: boolean | null
          created_at?: string
          edited_at?: string | null
          id?: number
          lfunction_id?: string | null
          user_id?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "link_general_lfunction_user_lfunction_id_fkey"
            columns: ["lfunction_id"]
            isOneToOne: false
            referencedRelation: "larin_functions"
            referencedColumns: ["id"]
          },
        ]
      }
      link_specific_lfunction_user: {
        Row: {
          created_at: string
          edited_at: string | null
          given_name: string | null
          id: number
          lfunction_id: string | null
          unique_public_code: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          edited_at?: string | null
          given_name?: string | null
          id?: number
          lfunction_id?: string | null
          unique_public_code?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          edited_at?: string | null
          given_name?: string | null
          id?: number
          lfunction_id?: string | null
          unique_public_code?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_lfunction_user_lfunction_id_fkey"
            columns: ["lfunction_id"]
            isOneToOne: false
            referencedRelation: "larin_functions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          created_at: string | null
          email: string
          google_access_token: string | null
          google_refresh_token: string
          id: string
          scopes: string[] | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          google_access_token?: string | null
          google_refresh_token: string
          id?: string
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          google_access_token?: string | null
          google_refresh_token?: string
          id?: string
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
