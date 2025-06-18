
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';
import type { ForumPost } from './types';

export const postsService = {
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
};
