
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/services/auth/authService";

export interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export class UsersService {
  /**
   * Récupérer tous les utilisateurs
   */
  static async getUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(userId: string, updates: Partial<AdminUser>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }

    return data;
  }

  /**
   * Supprimer un utilisateur
   */
  static async deleteUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }
}
