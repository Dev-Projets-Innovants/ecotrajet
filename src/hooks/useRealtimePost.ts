
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

export const useRealtimePost = (postId: string) => {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour récupérer le post initial
  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
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
        .eq('id', postId)
        .single();

      if (error) throw error;

      if (data) {
        const transformedPost = {
          ...data,
          // S'assurer que les compteurs ne sont jamais négatifs
          likes_count: Math.max(0, data.likes_count || 0),
          comments_count: Math.max(0, data.comments_count || 0),
          forum_categories: data.forum_categories ? {
            ...data.forum_categories,
            description: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } : undefined
        };
        setPost(transformedPost);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();

    // Écouter les mises à jour en temps réel du post
    const postChannel = supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forum_posts',
          filter: `id=eq.${postId}`
        },
        (payload) => {
          console.log('Post updated:', payload);
          setPost(prev => prev ? { 
            ...prev, 
            ...payload.new,
            // S'assurer que les compteurs ne sont jamais négatifs
            likes_count: Math.max(0, payload.new.likes_count || 0),
            comments_count: Math.max(0, payload.new.comments_count || 0)
          } : null);
        }
      )
      .subscribe();

    // Écouter les likes du post
    const likesChannel = supabase
      .channel(`post-likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_post_likes',
          filter: `post_id=eq.${postId}`
        },
        () => {
          console.log('New like added');
          setPost(prev => prev ? { 
            ...prev, 
            likes_count: Math.max(0, prev.likes_count + 1) 
          } : null);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'forum_post_likes',
          filter: `post_id=eq.${postId}`
        },
        () => {
          console.log('Like removed');
          setPost(prev => prev ? { 
            ...prev, 
            likes_count: Math.max(0, prev.likes_count - 1) 
          } : null);
        }
      )
      .subscribe();

    // Écouter les commentaires du post
    const commentsChannel = supabase
      .channel(`post-comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          console.log('New comment added');
          setPost(prev => prev ? { 
            ...prev, 
            comments_count: Math.max(0, prev.comments_count + 1) 
          } : null);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'forum_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          console.log('Comment removed');
          setPost(prev => prev ? { 
            ...prev, 
            comments_count: Math.max(0, prev.comments_count - 1) 
          } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [postId]);

  return { post, isLoading, refetch: fetchPost };
};
