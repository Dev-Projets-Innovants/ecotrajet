
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';
import { ForumPost } from './types';

export const editPostService = {
  // Vérifier si l'utilisateur peut éditer le post
  async canEditPost(postId: string): Promise<boolean> {
    try {
      console.log('Checking if user can edit post:', postId);
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current authenticated user:', user?.id);

      const { data: post, error } = await supabase
        .from('forum_posts')
        .select('user_id, user_identifier, user_name, user_email')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post for edit check:', error);
        return false;
      }

      if (!post) {
        console.log('Post not found for edit check');
        return false;
      }

      console.log('Post data for edit check:', post);

      // Vérifier si l'utilisateur connecté est l'auteur
      if (user && post.user_id === user.id) {
        console.log('User can edit: authenticated user is the author');
        return true;
      }

      // Vérifier si l'utilisateur anonyme est l'auteur
      const currentUserIdentifier = getCurrentUserIdentifier();
      if (!user && post.user_identifier === currentUserIdentifier) {
        console.log('User can edit: anonymous user identifier matches');
        return true;
      }

      console.log('User cannot edit post - not the author');
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
    console.log('Starting post update process for:', postId);
    
    const canEdit = await this.canEditPost(postId);
    if (!canEdit) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce post');
    }

    console.log('User authorized to edit, proceeding with update');

    // Préparer les données de mise à jour
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Nettoyer les valeurs null/undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null || updateData[key] === undefined || updateData[key] === '') {
        updateData[key] = null;
      }
    });

    console.log('Update data prepared:', updateData);

    const { data, error } = await supabase
      .from('forum_posts')
      .update(updateData)
      .eq('id', postId)
      .select(`
        *,
        forum_categories (
          id,
          name,
          color,
          icon,
          description,
          is_active,
          created_at,
          updated_at
        )
      `)
      .single();

    if (error) {
      console.error('Error updating post in database:', error);
      throw new Error(`Erreur lors de la modification: ${error.message}`);
    }

    if (!data) {
      throw new Error('Aucune donnée retournée après la modification');
    }

    console.log('Post updated successfully in database:', data);
    return data;
  }
};
