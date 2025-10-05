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
      ai_settings: {
        Row: {
          ai_followup_enabled: boolean | null
          ai_summarizer_enabled: boolean | null
          created_at: string | null
          id: string
          summary_detail_level: string | null
          updated_at: string | null
          user_id: string
          voice_command_enabled: boolean | null
          voice_keyword: string | null
        }
        Insert: {
          ai_followup_enabled?: boolean | null
          ai_summarizer_enabled?: boolean | null
          created_at?: string | null
          id?: string
          summary_detail_level?: string | null
          updated_at?: string | null
          user_id: string
          voice_command_enabled?: boolean | null
          voice_keyword?: string | null
        }
        Update: {
          ai_followup_enabled?: boolean | null
          ai_summarizer_enabled?: boolean | null
          created_at?: string | null
          id?: string
          summary_detail_level?: string | null
          updated_at?: string | null
          user_id?: string
          voice_command_enabled?: boolean | null
          voice_keyword?: string | null
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          auth_token: string | null
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          integration_name: string
          integration_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_token?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          integration_name: string
          integration_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_token?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          integration_name?: string
          integration_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meeting_messages: {
        Row: {
          id: string
          meeting_id: string
          user_id: string
          user_name: string
          message: string
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          meeting_id: string
          user_id: string
          user_name: string
          message: string
          timestamp?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          meeting_id?: string
          user_id?: string
          user_name?: string
          message?: string
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meeting_participants: {
        Row: {
          created_at: string | null
          id: string
          meeting_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_preferences: {
        Row: {
          auto_recording: boolean | null
          auto_transcription: boolean | null
          buffer_time: number | null
          created_at: string | null
          default_duration: number | null
          default_platform: string | null
          id: string
          live_summarization: boolean | null
          real_time_translation: boolean | null
          speaker_recognition: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_recording?: boolean | null
          auto_transcription?: boolean | null
          buffer_time?: number | null
          created_at?: string | null
          default_duration?: number | null
          default_platform?: string | null
          id?: string
          live_summarization?: boolean | null
          real_time_translation?: boolean | null
          speaker_recognition?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_recording?: boolean | null
          auto_transcription?: boolean | null
          buffer_time?: number | null
          created_at?: string | null
          default_duration?: number | null
          default_platform?: string | null
          id?: string
          live_summarization?: boolean | null
          real_time_translation?: boolean | null
          speaker_recognition?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meeting_summaries: {
        Row: {
          action_items: string[] | null
          created_at: string | null
          id: string
          key_points: string[] | null
          meeting_id: string | null
          summary: string
          transcript: string | null
        }
        Insert: {
          action_items?: string[] | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          meeting_id?: string | null
          summary: string
          transcript?: string | null
        }
        Update: {
          action_items?: string[] | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          meeting_id?: string | null
          summary?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_summaries_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          host_id: string | null
          id: string
          meeting_url: string | null
          recording_url: string | null
          transcript_url: string | null
          summary: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          host_id?: string | null
          id?: string
          meeting_url?: string | null
          recording_url?: string | null
          transcript_url?: string | null
          summary?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          host_id?: string | null
          id?: string
          meeting_url?: string | null
          recording_url?: string | null
          transcript_url?: string | null
          summary?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          app_notifications: boolean | null
          created_at: string | null
          do_not_disturb_end: string | null
          do_not_disturb_start: string | null
          email_notifications: boolean | null
          id: string
          meeting_reminders: boolean | null
          slack_notifications: boolean | null
          summary_notifications: boolean | null
          task_reminders: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_notifications?: boolean | null
          created_at?: string | null
          do_not_disturb_end?: string | null
          do_not_disturb_start?: string | null
          email_notifications?: boolean | null
          id?: string
          meeting_reminders?: boolean | null
          slack_notifications?: boolean | null
          summary_notifications?: boolean | null
          task_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_notifications?: boolean | null
          created_at?: string | null
          do_not_disturb_end?: string | null
          do_not_disturb_start?: string | null
          email_notifications?: boolean | null
          id?: string
          meeting_reminders?: boolean | null
          slack_notifications?: boolean | null
          summary_notifications?: boolean | null
          task_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          lead_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recordings: {
        Row: {
          id: string
          meeting_id: string | null
          title: string
          description: string | null
          file_url: string | null
          transcript_url: string | null
          duration: number | null
          file_size: number | null
          status: string | null
          created_at: string | null
          updated_at: string | null
          created_by: string | null
          participants_count: number | null
          views_count: number | null
          is_favorite: boolean | null
        }
        Insert: {
          id?: string
          meeting_id?: string | null
          title: string
          description?: string | null
          file_url?: string | null
          transcript_url?: string | null
          duration?: number | null
          file_size?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by?: string | null
          participants_count?: number | null
          views_count?: number | null
          is_favorite?: boolean | null
        }
        Update: {
          id?: string
          meeting_id?: string | null
          title?: string
          description?: string | null
          file_url?: string | null
          transcript_url?: string | null
          duration?: number | null
          file_size?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          created_by?: string | null
          participants_count?: number | null
          views_count?: number | null
          is_favorite?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recordings_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recordings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          meeting_id: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          created_by: string | null
          department_id: string | null
          id: string
          invited_at: string | null
          joined_at: string | null
          role_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          language: string | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          working_hours_end?: string | null
          working_hours_start?: string | null
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
  public: {
    Enums: {},
  },
} as const
