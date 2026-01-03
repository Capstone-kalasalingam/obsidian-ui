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
      academic_calendar_events: {
        Row: {
          class_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          event_type: string
          id: string
          school_id: string | null
          subject: string | null
          title: string
        }
        Insert: {
          class_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type: string
          id?: string
          school_id?: string | null
          subject?: string | null
          title: string
        }
        Update: {
          class_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string
          id?: string
          school_id?: string | null
          subject?: string | null
          title?: string
        }
        Relationships: []
      }
      class_subjects: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          subject_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          subject_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          section: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          section: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_learning_tasks: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          is_active: boolean | null
          subject_id: string
          task_date: string
          task_type: Database["public"]["Enums"]["task_type"] | null
          title: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_active?: boolean | null
          subject_id: string
          task_date: string
          task_type?: Database["public"]["Enums"]["task_type"] | null
          title: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_active?: boolean | null
          subject_id?: string
          task_date?: string
          task_type?: Database["public"]["Enums"]["task_type"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_learning_tasks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_learning_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_learning_tasks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string | null
          id: string
          occupation: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          occupation?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          occupation?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_ai_chats: {
        Row: {
          created_at: string
          id: string
          messages: Json | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json | null
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_daily_activities: {
        Row: {
          activity_date: string
          created_at: string | null
          id: string
          student_id: string
          tasks_completed: number | null
          time_spent_minutes: number | null
        }
        Insert: {
          activity_date?: string
          created_at?: string | null
          id?: string
          student_id: string
          tasks_completed?: number | null
          time_spent_minutes?: number | null
        }
        Update: {
          activity_date?: string
          created_at?: string | null
          id?: string
          student_id?: string
          tasks_completed?: number | null
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_daily_activities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_learning_profiles: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          current_streak_days: number | null
          id: string
          last_activity_date: string | null
          longest_streak_days: number | null
          student_id: string
          total_tasks_completed: number | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak_days?: number | null
          student_id: string
          total_tasks_completed?: number | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak_days?: number | null
          student_id?: string
          total_tasks_completed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_learning_profiles_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parents: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_id: string
          relationship: string | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relationship?: string | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_reflections: {
        Row: {
          confused_about: string | null
          created_at: string
          id: string
          student_id: string
          understood_well: string | null
          want_to_improve: string | null
          week_start: string
        }
        Insert: {
          confused_about?: string | null
          created_at?: string
          id?: string
          student_id: string
          understood_well?: string | null
          want_to_improve?: string | null
          week_start: string
        }
        Update: {
          confused_about?: string | null
          created_at?: string
          id?: string
          student_id?: string
          understood_well?: string | null
          want_to_improve?: string | null
          week_start?: string
        }
        Relationships: []
      }
      student_subject_proficiencies: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          proficiency_level:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          score: number | null
          student_id: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          score?: number | null
          student_id: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          score?: number | null
          student_id?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_subject_proficiencies_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subject_proficiencies_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_task_completions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          student_id: string
          task_id: string
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          student_id: string
          task_id: string
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          student_id?: string
          task_id?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_task_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "daily_learning_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string | null
          class_id: string
          created_at: string | null
          id: string
          roll_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admission_date?: string | null
          class_id: string
          created_at?: string | null
          id?: string
          roll_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admission_date?: string | null
          class_id?: string
          created_at?: string | null
          id?: string
          roll_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_assignments: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          is_class_teacher: boolean | null
          subject_id: string
          teacher_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          is_class_teacher?: boolean | null
          subject_id: string
          teacher_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          is_class_teacher?: boolean | null
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          joining_date: string | null
          qualification: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          joining_date?: string | null
          qualification?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          joining_date?: string | null
          qualification?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "parent" | "teacher" | "school_admin"
      proficiency_level: "weak" | "average" | "strong"
      task_status: "pending" | "in_progress" | "completed" | "skipped"
      task_type: "teacher_defined" | "syllabus_based"
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
      app_role: ["student", "parent", "teacher", "school_admin"],
      proficiency_level: ["weak", "average", "strong"],
      task_status: ["pending", "in_progress", "completed", "skipped"],
      task_type: ["teacher_defined", "syllabus_based"],
    },
  },
} as const
