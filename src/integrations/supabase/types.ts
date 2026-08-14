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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          genre_type: Database["public"]["Enums"]["genre_type"]
          id: string
          name_bn: string
          name_en: string
          slug: string
        }
        Insert: {
          created_at?: string
          genre_type: Database["public"]["Enums"]["genre_type"]
          id?: string
          name_bn: string
          name_en: string
          slug: string
        }
        Update: {
          created_at?: string
          genre_type?: Database["public"]["Enums"]["genre_type"]
          id?: string
          name_bn?: string
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          created_at: string
          id: string
          part_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          part_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          part_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          writer_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          writer_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          writer_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          reaction: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          reaction?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          reaction?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          body: string
          created_at: string
          id: string
          is_draft: boolean
          is_premium: boolean
          part_number: number
          published_at: string | null
          story_id: string
          title: string
          updated_at: string
          word_count: number
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          is_draft?: boolean
          is_premium?: boolean
          part_number?: number
          published_at?: string | null
          story_id: string
          title: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_draft?: boolean
          is_premium?: boolean
          part_number?: number
          published_at?: string | null
          story_id?: string
          title?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "parts_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          category_id: string | null
          category_ids: string[]
          cover_url: string | null
          created_at: string
          description: string | null
          genre: Database["public"]["Enums"]["genre_type"]
          genres: Database["public"]["Enums"]["genre_type"][]
          id: string
          is_published: boolean
          is_regional: boolean
          pen_name_override: string | null
          status: Database["public"]["Enums"]["story_status"]
          tags: string[]
          title: string
          updated_at: string
          writer_id: string
        }
        Insert: {
          category_id?: string | null
          category_ids?: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          genre?: Database["public"]["Enums"]["genre_type"]
          genres?: Database["public"]["Enums"]["genre_type"][]
          id?: string
          is_published?: boolean
          is_regional?: boolean
          pen_name_override?: string | null
          status?: Database["public"]["Enums"]["story_status"]
          tags?: string[]
          title: string
          updated_at?: string
          writer_id: string
        }
        Update: {
          category_id?: string | null
          category_ids?: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          genre?: Database["public"]["Enums"]["genre_type"]
          genres?: Database["public"]["Enums"]["genre_type"][]
          id?: string
          is_published?: boolean
          is_regional?: boolean
          pen_name_override?: string | null
          status?: Database["public"]["Enums"]["story_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      writer_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          default_pen_name: string | null
          handle: string
          id: string
          real_name: string | null
          updated_at: string
          use_pen_name: boolean
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          default_pen_name?: string | null
          handle: string
          id: string
          real_name?: string | null
          updated_at?: string
          use_pen_name?: boolean
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          default_pen_name?: string | null
          handle?: string
          id?: string
          real_name?: string | null
          updated_at?: string
          use_pen_name?: boolean
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
      genre_type: "fiction" | "nonfiction" | "experience"
      story_status: "ongoing" | "completed" | "hiatus"
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
      genre_type: ["fiction", "nonfiction", "experience"],
      story_status: ["ongoing", "completed", "hiatus"],
    },
  },
} as const
