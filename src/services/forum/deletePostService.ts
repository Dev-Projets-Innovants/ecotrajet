
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export const deletePostService = {
  // Vérifier si l'utilisateur peut supprimer le post
  async canDeletePost(postId: string): Promise<boolean> {
    try {
      console.log('Checking if user can delete post:', postId);
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current authenticated user:', user?.id);

      const { data: post, error } = await supabase
        .from('forum_posts')
        .select('user_id, user_identifier, user_name, user_email')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post for delete check:', error);
        return false;
      }

      if (!post) {
        console.log('Post not found for delete check');
        return false;
      }

      console.log('Post data for delete check:', post);

      // Vérifier si l'utilisateur connecté est l'auteur
      if (user && post.user_id === user.id) {
        console.log('User can delete: authenticated user is the author');
        return true;
      }

      // Vérifier si l'utilisateur anonyme est l'auteur
      const currentUserIdentifier = getCurrentUserIdentifier();
      if (!user && post.user_identifier === currentUserIdentifier) {
        console.log('User can delete: anonymous user identifier matches');
        return true;
      }

      console.log('User cannot delete post - not the author');
      return false;
    } catch (error) {
      console.error('Error checking delete permissions:', error);
      return false;
    }
  },

  // Supprimer un post
  async deletePost(postId: string): Promise<boolean> {
    console.log('Starting post deletion process for:', postId);
    
    const canDelete = await this.canDeletePost(postId);
    if (!canDelete) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce post');
    }

    console.log('User authorized to delete, proceeding with deletion');

    try {
      // Utiliser la fonction SQL pour supprimer le post et ses relations
      const { data, error } = await supabase.rpc('delete_post_with_relations', {
        post_uuid: postId
      });

      if (error) {
        console.error('Error deleting post:', error);
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      console.log('Post deleted successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  }
};
