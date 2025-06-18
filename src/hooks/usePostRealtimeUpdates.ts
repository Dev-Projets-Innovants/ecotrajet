
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';

interface RealtimeUpdateCallbacks {
  onLikeStateChange: (isLiked: boolean) => void;
  onLikesCountChange: (count: number) => void;
  onCommentsCountChange: (count: number) => void;
}

export const usePostRealtimeUpdates = (
  postId: string, 
  callbacks: RealtimeUpdateCallbacks
) => {
  useEffect(() => {
    const setupRealtimeListener = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userIdentifier = user ? user.id : getCurrentUserIdentifier();

      console.log('Setting up realtime listener for user:', user ? user.id : userIdentifier);

      // Listen to post updates (counters)
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
            callbacks.onLikesCountChange(Math.max(0, payload.new.likes_count || 0));
            callbacks.onCommentsCountChange(Math.max(0, payload.new.comments_count || 0));
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
              callbacks.onLikeStateChange(true);
            }
            // Update counter for all users
            callbacks.onLikesCountChange(prev => Math.max(0, prev + 1));
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
              callbacks.onLikeStateChange(false);
            }
            // Update counter for all users
            callbacks.onLikesCountChange(prev => Math.max(0, prev - 1));
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
            callbacks.onCommentsCountChange(prev => Math.max(0, prev + 1));
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
            callbacks.onCommentsCountChange(prev => Math.max(0, prev - 1));
          }
        )
        .subscribe();

      return () => supabase.removeChannel(postChannel);
    };

    const cleanup = setupRealtimeListener();

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [postId, callbacks]);
};
