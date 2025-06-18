
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';
import { forumService } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

interface PostInteractions {
  isLiked: boolean;
  isChecking: boolean;
  isToggling: boolean;
  likesCount: number;
  commentsCount: number;
  setIsToggling: (value: boolean) => void;
  toggleLike: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePostInteractions = (postId: string, initialLikesCount = 0, initialCommentsCount = 0): PostInteractions => {
  const [isLiked, setIsLiked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  const checkUserLike = async () => {
    try {
      setIsChecking(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', postId);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const userIdentifier = getCurrentUserIdentifier();
        query = query.eq('user_identifier', userIdentifier);
      }

      const { data } = await query.single();
      setIsLiked(!!data);
    } catch (error) {
      console.log('No like found for user:', error);
      setIsLiked(false);
    } finally {
      setIsChecking(false);
    }
  };

  const toggleLike = async () => {
    if (isToggling || isChecking) {
      console.log('Like action blocked - already in progress');
      return;
    }
    
    console.log('Toggling like for post:', postId, 'current state:', isLiked);
    setIsToggling(true);
    
    try {
      await forumService.togglePostLike(postId);
      console.log('Like toggle successful');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker ce post",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    checkUserLike();

    // Écouter les changements de likes en temps réel pour cet utilisateur
    const getUserIdentifier = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? user.id : getCurrentUserIdentifier();
    };

    const setupRealtimeListener = async () => {
      const userIdentifier = await getUserIdentifier();
      const { data: { user } } = await supabase.auth.getUser();

      console.log('Setting up realtime listener for user:', user ? user.id : userIdentifier);

      // Écouter les changements du post (compteurs)
      const postChannel = supabase
        .channel(`post-interactions-${postId}`)
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
            setLikesCount(Math.max(0, payload.new.likes_count || 0));
            setCommentsCount(Math.max(0, payload.new.comments_count || 0));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'forum_post_likes',
            filter: `post_id=eq.${postId}`
          },
          (payload) => {
            console.log('Like INSERT received:', payload);
            const isCurrentUser = user 
              ? payload.new.user_id === user.id
              : payload.new.user_identifier === userIdentifier;
            
            if (isCurrentUser) {
              console.log('Setting isLiked to true for current user');
              setIsLiked(true);
            }
            // Mettre à jour le compteur pour tous les utilisateurs
            setLikesCount(prev => Math.max(0, prev + 1));
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
          (payload) => {
            console.log('Like DELETE received:', payload);
            const isCurrentUser = user 
              ? payload.old.user_id === user.id
              : payload.old.user_identifier === userIdentifier;
            
            if (isCurrentUser) {
              console.log('Setting isLiked to false for current user');
              setIsLiked(false);
            }
            // Mettre à jour le compteur pour tous les utilisateurs
            setLikesCount(prev => Math.max(0, prev - 1));
          }
        )
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
            setCommentsCount(prev => Math.max(0, prev + 1));
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
            setCommentsCount(prev => Math.max(0, prev - 1));
          }
        )
        .subscribe();

      return () => supabase.removeChannel(postChannel);
    };

    const cleanup = setupRealtimeListener();

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [postId]);

  // Mettre à jour les compteurs initiaux quand ils changent
  useEffect(() => {
    setLikesCount(Math.max(0, initialLikesCount));
  }, [initialLikesCount]);

  useEffect(() => {
    setCommentsCount(Math.max(0, initialCommentsCount));
  }, [initialCommentsCount]);

  return { 
    isLiked, 
    isChecking, 
    isToggling, 
    likesCount,
    commentsCount,
    setIsToggling, 
    toggleLike,
    refetch: checkUserLike 
  };
};
