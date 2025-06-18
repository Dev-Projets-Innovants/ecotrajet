
import { supabase } from '@/integrations/supabase/client';

export interface AdminForumComment {
  id: string;
  content: string;
  user_name?: string;
  user_email?: string;
  user_id?: string;
  user_identifier?: string;
  post_id: string;
  parent_comment_id?: string;
  likes_count: number;
  is_approved: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  forum_posts?: {
    id: string;
    title: string;
  };
}

export const commentsModerationService = {
  // Récupérer tous les commentaires pour modération
  async getAllComments(filters?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    search?: string;
  }) {
    let query = supabase
      .from('forum_comments')
      .select(`
        *,
        forum_posts (
          id,
          title
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
      filteredData = filteredData.filter(comment => 
        comment.content.toLowerCase().includes(searchTerm) ||
        (comment.user_name && comment.user_name.toLowerCase().includes(searchTerm))
      );
    }

    return filteredData;
  },

  // Approuver un commentaire
  async approveComment(commentId: string) {
    const { data, error } = await supabase
      .from('forum_comments')
      .update({ 
        is_approved: true,
        is_reported: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Rejeter un commentaire
  async rejectComment(commentId: string) {
    const { data, error } = await supabase
      .from('forum_comments')
      .update({ 
        is_approved: false,
        is_reported: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtenir les statistiques de modération des commentaires
  async getModerationStats() {
    const { data: allComments, error } = await supabase
      .from('forum_comments')
      .select('is_approved, is_reported');

    if (error) throw error;

    const stats = {
      total: allComments?.length || 0,
      pending: allComments?.filter(c => !c.is_approved && !c.is_reported).length || 0,
      approved: allComments?.filter(c => c.is_approved).length || 0,
      rejected: allComments?.filter(c => c.is_reported).length || 0,
    };

    return stats;
  }
};
