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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      consumers: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          consumer_id: string
          created_at: string
          current_stamps: number
          id: string
          last_visit_at: string | null
          merchant_id: string
          program_id: string
          total_rewards_earned: number
          total_visits: number
          updated_at: string
          wallet_pass_serial: string | null
        }
        Insert: {
          consumer_id: string
          created_at?: string
          current_stamps?: number
          id?: string
          last_visit_at?: string | null
          merchant_id: string
          program_id: string
          total_rewards_earned?: number
          total_visits?: number
          updated_at?: string
          wallet_pass_serial?: string | null
        }
        Update: {
          consumer_id?: string
          created_at?: string
          current_stamps?: number
          id?: string
          last_visit_at?: string | null
          merchant_id?: string
          program_id?: string
          total_rewards_earned?: number
          total_visits?: number
          updated_at?: string
          wallet_pass_serial?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          created_at: string
          email: string
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          phone: string | null
          plan: string
          postal_code: string | null
          redemption_pin: string
          slug: string
          stripe_customer_id: string | null
          updated_at: string
          vertical: string
        }
        Insert: {
          address?: string | null
          business_name: string
          city?: string | null
          created_at?: string
          email: string
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          plan?: string
          postal_code?: string | null
          redemption_pin?: string
          slug: string
          stripe_customer_id?: string | null
          updated_at?: string
          vertical: string
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          plan?: string
          postal_code?: string | null
          redemption_pin?: string
          slug?: string
          stripe_customer_id?: string | null
          updated_at?: string
          vertical?: string
        }
        Relationships: []
      }
      messaging_events: {
        Row: {
          channel: string
          cost_cents: number
          created_at: string
          error_code: string | null
          error_message: string | null
          id: string
          message_id: string | null
          message_type: string
          phone_hash: string
          status: string
          template_name: string | null
          updated_at: string
        }
        Insert: {
          channel: string
          cost_cents?: number
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_id?: string | null
          message_type: string
          phone_hash: string
          status?: string
          template_name?: string | null
          updated_at?: string
        }
        Update: {
          channel?: string
          cost_cents?: number
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_id?: string | null
          message_type?: string
          phone_hash?: string
          status?: string
          template_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          cooldown_hours: number
          created_at: string
          id: string
          is_active: boolean
          merchant_id: string
          program_name: string | null
          reward_description: string
          threshold: number
          type: string
          updated_at: string
        }
        Insert: {
          cooldown_hours?: number
          created_at?: string
          id?: string
          is_active?: boolean
          merchant_id: string
          program_name?: string | null
          reward_description: string
          threshold?: number
          type?: string
          updated_at?: string
        }
        Update: {
          cooldown_hours?: number
          created_at?: string
          id?: string
          is_active?: boolean
          merchant_id?: string
          program_name?: string | null
          reward_description?: string
          threshold?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      redemptions: {
        Row: {
          consumer_id: string
          created_at: string
          enrollment_id: string
          id: string
          merchant_id: string
          reward_description: string
        }
        Insert: {
          consumer_id: string
          created_at?: string
          enrollment_id: string
          id?: string
          merchant_id: string
          reward_description: string
        }
        Update: {
          consumer_id?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          merchant_id?: string
          reward_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          consumer_id: string
          created_at: string
          enrollment_id: string
          id: string
          merchant_id: string
          stamped: boolean
        }
        Insert: {
          consumer_id: string
          created_at?: string
          enrollment_id: string
          id?: string
          merchant_id: string
          stamped?: boolean
        }
        Update: {
          consumer_id?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          merchant_id?: string
          stamped?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "visits_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      messaging_cost_daily: {
        Row: {
          channel: string | null
          date: string | null
          delivered_count: number | null
          failed_count: number | null
          message_count: number | null
          message_type: string | null
          total_cost_cents: number | null
          total_cost_eur: number | null
        }
        Relationships: []
      }
      messaging_cost_monthly: {
        Row: {
          channel: string | null
          message_count: number | null
          month: string | null
          total_cost_cents: number | null
          total_cost_eur: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_slug: { Args: { business_name: string }; Returns: string }
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
  public: {
    Enums: {},
  },
} as const

// Convenience type exports for common use
export type Merchant = Database['public']['Tables']['merchants']['Row']
export type MerchantInsert = Database['public']['Tables']['merchants']['Insert']
export type MerchantUpdate = Database['public']['Tables']['merchants']['Update']

export type Consumer = Database['public']['Tables']['consumers']['Row']
export type ConsumerInsert = Database['public']['Tables']['consumers']['Insert']
export type ConsumerUpdate = Database['public']['Tables']['consumers']['Update']

export type Program = Database['public']['Tables']['programs']['Row']
export type ProgramInsert = Database['public']['Tables']['programs']['Insert']
export type ProgramUpdate = Database['public']['Tables']['programs']['Update']

export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert']
export type EnrollmentUpdate = Database['public']['Tables']['enrollments']['Update']

export type Visit = Database['public']['Tables']['visits']['Row']
export type VisitInsert = Database['public']['Tables']['visits']['Insert']
export type VisitUpdate = Database['public']['Tables']['visits']['Update']

export type Redemption = Database['public']['Tables']['redemptions']['Row']
export type RedemptionInsert = Database['public']['Tables']['redemptions']['Insert']
export type RedemptionUpdate = Database['public']['Tables']['redemptions']['Update']

export type MessagingEvent = Database['public']['Tables']['messaging_events']['Row']
export type MessagingEventInsert = Database['public']['Tables']['messaging_events']['Insert']
export type MessagingEventUpdate = Database['public']['Tables']['messaging_events']['Update']
