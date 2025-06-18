
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_identifier: string | null;
  category_id: string | null;
  title: string;
  content: string;
  image_url: string | null;
  location: string | null;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_pinned: boolean;
  is_approved: boolean;
  is_reported: boolean;
  reported_count: number;
  created_at: string;
  updated_at: string;
  forum_categories?: ForumCategory;
}

export interface ForumComment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_identifier: string | null;
  content: string;
  likes_count: number;
  is_approved: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPostLike {
  id: string;
  post_id: string;
  user_id: string | null;
  user_identifier: string | null;
  created_at: string;
}

export interface ForumCommentLike {
  id: string;
  comment_id: string;
  user_id: string | null;
  user_identifier: string | null;
  created_at: string;
}

export const forumService = {
  // Categories
  async getCategories() {
    return await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
  },

  // Posts
  async getPosts(categoryId?: string, limit = 20, offset = 0) {
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        forum_categories (
          id,
          name,
          color,
          icon
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    return await query.range(offset, offset + limit - 1);
  },

  async getPostById(id: string) {
    return await supabase
      .from('forum_posts')
      .select(`
        *,
        forum_categories (
          id,
          name,
          color,
          icon
        )
      `)
      .eq('id', id)
      .single();
  },

  async createPost(post: {
    title: string;
    content: string;
    category_id?: string;
    tags?: string[];
    location?: string;
    image_url?: string;
    user_name?: string;
    user_email?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('Creating post with user:', user);
    
    // Si l'utilisateur est connecté, utiliser son ID
    if (user) {
      return await supabase
        .from('forum_posts')
        .insert({
          ...post,
          user_id: user.id,
          user_name: post.user_name || user.user_metadata?.first_name || null,
          user_email: post.user_email || user.email || null,
        })
        .select()
        .single();
    } else {
      // Si l'utilisateur n'est pas connecté, utiliser un identifiant anonyme
      const userIdentifier = getCurrentUserIdentifier();
      return await supabase
        .from('forum_posts')
        .insert({
          ...post,
          user_identifier: userIdentifier,
        })
        .select()
        .single();
    }
  },

  async updatePost(id: string, updates: Partial<ForumPost>) {
    return await supabase
      .from('forum_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deletePost(id: string) {
    return await supabase
      .from('forum_posts')
      .delete()
      .eq('id', id);
  },

  // Comments
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

  // Reports
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
