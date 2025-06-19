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
      alert_notifications_history: {
        Row: {
          alert_id: string | null
          alert_type: string | null
          current_value: number | null
          email: string
          email_status: string | null
          id: string
          sent_at: string | null
          station_name: string | null
          threshold: number | null
        }
        Insert: {
          alert_id?: string | null
          alert_type?: string | null
          current_value?: number | null
          email: string
          email_status?: string | null
          id?: string
          sent_at?: string | null
          station_name?: string | null
          threshold?: number | null
        }
        Update: {
          alert_id?: string | null
          alert_type?: string | null
          current_value?: number | null
          email?: string
          email_status?: string | null
          id?: string
          sent_at?: string | null
          station_name?: string | null
          threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_notifications_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "user_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          reward_points: number | null
          target_value: number
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          reward_points?: number | null
          target_value: number
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          reward_points?: number | null
          target_value?: number
          title?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string | null
          user_identifier: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          user_identifier?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          user_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_reported: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_identifier: string | null
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string | null
          user_identifier: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id?: string | null
          user_identifier?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string | null
          user_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          category_id: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_approved: boolean | null
          is_pinned: boolean | null
          is_reported: boolean | null
          likes_count: number | null
          location: string | null
          reported_count: number | null
          shares_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_identifier: string | null
          user_name: string | null
          views_count: number | null
        }
        Insert: {
          category_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          location?: string | null
          reported_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
          user_name?: string | null
          views_count?: number | null
        }
        Update: {
          category_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          location?: string | null
          reported_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
          user_name?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reports: {
        Row: {
          comment_id: string | null
          created_at: string | null
          description: string | null
          id: string
          post_id: string | null
          reason: string
          reporter_identifier: string | null
          reporter_user_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reporter_identifier?: string | null
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reporter_identifier?: string | null
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transport_modes: {
        Row: {
          calories_per_km: number | null
          co2_factor_per_km: number
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          calories_per_km?: number | null
          co2_factor_per_km: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          calories_per_km?: number | null
          co2_factor_per_km?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_notification_sent: string | null
          notification_frequency: string | null
          stationcode: string
          threshold: number
          user_email: string | null
          user_id: string | null
          user_identifier: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_notification_sent?: string | null
          notification_frequency?: string | null
          stationcode: string
          threshold?: number
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_notification_sent?: string | null
          notification_frequency?: string | null
          stationcode?: string
          threshold?: number
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_stationcode_fkey"
            columns: ["stationcode"]
            isOneToOne: false
            referencedRelation: "velib_stations"
            referencedColumns: ["stationcode"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_description: string
          badge_icon: string
          badge_title: string
          created_at: string | null
          earned_date: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_description: string
          badge_icon: string
          badge_title: string
          created_at?: string | null
          earned_date?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string
          badge_icon?: string
          badge_title?: string
          created_at?: string | null
          earned_date?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          id: string
          is_completed: boolean | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_experiences: {
        Row: {
          category: string | null
          created_at: string
          experience_text: string
          id: string
          is_approved: boolean
          name: string | null
          rating: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          experience_text: string
          id?: string
          is_approved?: boolean
          name?: string | null
          rating: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          experience_text?: string
          id?: string
          is_approved?: boolean
          name?: string | null
          rating?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_favorite_stations: {
        Row: {
          created_at: string | null
          id: string
          stationcode: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          stationcode: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          stationcode?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_favorite_stations_stationcode"
            columns: ["stationcode"]
            isOneToOne: false
            referencedRelation: "velib_stations"
            referencedColumns: ["stationcode"]
          },
          {
            foreignKeyName: "user_favorite_stations_stationcode_fkey"
            columns: ["stationcode"]
            isOneToOne: false
            referencedRelation: "velib_stations"
            referencedColumns: ["stationcode"]
          },
        ]
      }
      user_statistics: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          total_calories_burned: number | null
          total_co2_saved_kg: number | null
          total_distance_km: number | null
          total_trips: number | null
          trees_equivalent: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          total_calories_burned?: number | null
          total_co2_saved_kg?: number | null
          total_distance_km?: number | null
          total_trips?: number | null
          trees_equivalent?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          total_calories_burned?: number | null
          total_co2_saved_kg?: number | null
          total_distance_km?: number | null
          total_trips?: number | null
          trees_equivalent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_trips: {
        Row: {
          calories_burned: number | null
          co2_saved_kg: number | null
          created_at: string | null
          destination: string
          distance_km: number
          id: string
          origin: string
          transport_mode_id: string
          trip_date: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          co2_saved_kg?: number | null
          created_at?: string | null
          destination: string
          distance_km: number
          id?: string
          origin: string
          transport_mode_id: string
          trip_date?: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          co2_saved_kg?: number | null
          created_at?: string | null
          destination?: string
          distance_km?: number
          id?: string
          origin?: string
          transport_mode_id?: string
          trip_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trips_transport_mode_id_fkey"
            columns: ["transport_mode_id"]
            isOneToOne: false
            referencedRelation: "transport_modes"
            referencedColumns: ["id"]
          },
        ]
      }
      velib_availability_history: {
        Row: {
          ebike: number
          id: string
          is_installed: boolean | null
          is_renting: boolean | null
          is_returning: boolean | null
          mechanical: number
          numbikesavailable: number
          numdocksavailable: number
          stationcode: string
          timestamp: string | null
        }
        Insert: {
          ebike?: number
          id?: string
          is_installed?: boolean | null
          is_renting?: boolean | null
          is_returning?: boolean | null
          mechanical?: number
          numbikesavailable: number
          numdocksavailable: number
          stationcode: string
          timestamp?: string | null
        }
        Update: {
          ebike?: number
          id?: string
          is_installed?: boolean | null
          is_renting?: boolean | null
          is_returning?: boolean | null
          mechanical?: number
          numbikesavailable?: number
          numdocksavailable?: number
          stationcode?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "velib_availability_history_stationcode_fkey"
            columns: ["stationcode"]
            isOneToOne: false
            referencedRelation: "velib_stations"
            referencedColumns: ["stationcode"]
          },
        ]
      }
      velib_stations: {
        Row: {
          capacity: number
          code_insee_commune: string | null
          coordonnees_geo_lat: number
          coordonnees_geo_lon: number
          created_at: string | null
          id: string
          name: string
          nom_arrondissement_communes: string | null
          station_opening_hours: string | null
          stationcode: string
          updated_at: string | null
        }
        Insert: {
          capacity: number
          code_insee_commune?: string | null
          coordonnees_geo_lat: number
          coordonnees_geo_lon: number
          created_at?: string | null
          id?: string
          name: string
          nom_arrondissement_communes?: string | null
          station_opening_hours?: string | null
          stationcode: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          code_insee_commune?: string | null
          coordonnees_geo_lat?: number
          coordonnees_geo_lon?: number
          created_at?: string | null
          id?: string
          name?: string
          nom_arrondissement_communes?: string | null
          station_opening_hours?: string | null
          stationcode?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_delete_post: {
        Args: { post_uuid: string }
        Returns: boolean
      }
      clean_old_availability_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_post_with_relations: {
        Args: { post_uuid: string }
        Returns: boolean
      }
      get_current_user_identifier: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
