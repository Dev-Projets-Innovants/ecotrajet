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
      user_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          stationcode: string
          threshold: number
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          stationcode: string
          threshold?: number
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          stationcode?: string
          threshold?: number
          user_id?: string | null
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
            foreignKeyName: "user_favorite_stations_stationcode_fkey"
            columns: ["stationcode"]
            isOneToOne: false
            referencedRelation: "velib_stations"
            referencedColumns: ["stationcode"]
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
      clean_old_availability_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
