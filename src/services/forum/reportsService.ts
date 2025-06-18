
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export const reportsService = {
  async reportPost(postId: string, reason: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return await supabase
        .from('forum_reports')
        .insert({
          post_id: postId,
          reason,
          description,
          reporter_user_id: user.id,
        });
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      return await supabase
        .from('forum_reports')
        .insert({
          post_id: postId,
          reason,
          description,
          reporter_identifier: userIdentifier,
        });
    }
  },

  async reportComment(commentId: string, reason: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return await supabase
        .from('forum_reports')
        .insert({
          comment_id: commentId,
          reason,
          description,
          reporter_user_id: user.id,
        });
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      return await supabase
        .from('forum_reports')
        .insert({
          comment_id: commentId,
          reason,
          description,
          reporter_identifier: userIdentifier,
        });
    }
  }
};
