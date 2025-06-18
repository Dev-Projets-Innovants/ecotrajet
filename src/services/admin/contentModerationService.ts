
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '@/services/forum/types';

export interface AdminForumPost extends ForumPost {
  moderatedAt?: string;
  moderatedBy?: string;
}

export const contentModerationService = {
  // Récupérer tous les posts pour modération
  async getAllPosts(filters?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    search?: string;
  }) {
    let query = supabase
      .from('forum_posts')
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
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      switch (filters.status) {
        case 'pending':
          query = query.eq('is_approved', false);
          break;
        case 'approved':
          query = query.eq('is_approved', true);
          break;
        case 'rejected':
          query = query.eq('is_reported', true);
          break;
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filtrer par recherche côté client si nécessaire
    let filteredData = data || [];
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.user_name && post.user_name.toLowerCase().includes(searchTerm))
      );
    }

    return filteredData;
  },

  // Approuver un post
  async approvePost(postId: string) {
    const { data, error } = await supabase
      .from('forum_posts')
      .update({ 
        is_approved: true,
        is_reported: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Rejeter un post
  async rejectPost(postId: string) {
    const { data, error } = await supabase
      .from('forum_posts')
      .update({ 
        is_approved: false,
        is_reported: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtenir les statistiques de modération
  async getModerationStats() {
    const { data: allPosts, error } = await supabase
      .from('forum_posts')
      .select('is_approved, is_reported');

    if (error) throw error;

    const stats = {
      total: allPosts?.length || 0,
      pending: allPosts?.filter(p => !p.is_approved && !p.is_reported).length || 0,
      approved: allPosts?.filter(p => p.is_approved).length || 0,
      rejected: allPosts?.filter(p => p.is_reported).length || 0,
    };

    return stats;
  }
};
