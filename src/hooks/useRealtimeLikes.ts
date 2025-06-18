
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

export const useRealtimeLikes = (postId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

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

      const channel = supabase
        .channel(`user-likes-${postId}-${userIdentifier}`)
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
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    const cleanup = setupRealtimeListener();

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [postId]);

  return { 
    isLiked, 
    isChecking, 
    isToggling, 
    setIsToggling, 
    refetch: checkUserLike 
  };
};
