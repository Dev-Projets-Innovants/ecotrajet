
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export const commentsService = {
  async getComments(postId: string) {
    return await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });
  },

  async createComment(comment: {
    post_id: string;
    content: string;
    parent_comment_id?: string;
    user_name?: string;
    user_email?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return await supabase
        .from('forum_comments')
        .insert({
          ...comment,
          user_id: user.id,
          user_name: comment.user_name || user.user_metadata?.first_name || null,
          user_email: comment.user_email || user.email || null,
        })
        .select()
        .single();
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      return await supabase
        .from('forum_comments')
        .insert({
          ...comment,
          user_identifier: userIdentifier,
        })
        .select()
        .single();
    }
  },

  async updateComment(id: string, content: string) {
    return await supabase
      .from('forum_comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();
  },

  async deleteComment(id: string) {
    return await supabase
      .from('forum_comments')
      .delete()
      .eq('id', id);
  },
};
