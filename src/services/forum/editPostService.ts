
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';
import { ForumPost } from './types';

export const editPostService = {
  // Vérifier si l'utilisateur peut éditer le post
  async canEditPost(postId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: post, error } = await supabase
        .from('forum_posts')
        .select('user_id, user_identifier')
        .eq('id', postId)
        .single();

      if (error || !post) return false;

      // Vérifier si l'utilisateur connecté est l'auteur
      if (user && post.user_id === user.id) {
        return true;
      }

      // Vérifier si l'utilisateur anonyme est l'auteur
      if (!user && post.user_identifier === getCurrentUserIdentifier()) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking edit permissions:', error);
      return false;
    }
  },

  // Modifier un post
  async updatePost(postId: string, updates: {
    title?: string;
    content?: string;
    category_id?: string;
    tags?: string[];
    location?: string;
    image_url?: string;
  }): Promise<ForumPost> {
    const canEdit = await this.canEditPost(postId);
    if (!canEdit) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce post');
    }

    const { data, error } = await supabase
      .from('forum_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        // Le trigger se chargera de remettre is_approved à false si nécessaire
      })
      .eq('id', postId)
      .select(`
        *,
        forum_categories (
          id,
          name,
          color,
          icon
        )
      `)
      .single();

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }

    return data;
  }
};
