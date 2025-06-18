
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export const likesService = {
  // Likes for posts
  async togglePostLike(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        return await supabase
          .from('forum_post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Add like
        return await supabase
          .from('forum_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
      }
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_identifier', userIdentifier)
        .single();

      if (existingLike) {
        // Remove like
        return await supabase
          .from('forum_post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Add like
        return await supabase
          .from('forum_post_likes')
          .insert({
            post_id: postId,
            user_identifier: userIdentifier,
          });
      }
    }
  },

  async getPostLikes(postId: string) {
    return await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', postId);
  },

  async hasUserLikedPost(postId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      return !!data;
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      const { data } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_identifier', userIdentifier)
        .single();

      return !!data;
    }
  },

  // Likes for comments
  async toggleCommentLike(commentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        return await supabase
          .from('forum_comment_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Add like
        return await supabase
          .from('forum_comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });
      }
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_identifier', userIdentifier)
        .single();

      if (existingLike) {
        // Remove like
        return await supabase
          .from('forum_comment_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Add like
        return await supabase
          .from('forum_comment_likes')
          .insert({
            comment_id: commentId,
            user_identifier: userIdentifier,
          });
      }
    }
  },

  async hasUserLikedComment(commentId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('forum_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      return !!data;
    } else {
      const userIdentifier = getCurrentUserIdentifier();
      
      const { data } = await supabase
        .from('forum_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_identifier', userIdentifier)
        .single();

      return !!data;
    }
  },
};
