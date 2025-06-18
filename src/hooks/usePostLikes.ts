
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserIdentifier } from '@/services/auth/mockAuthService';
import { forumService } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

interface PostLikesHook {
  isLiked: boolean;
  isChecking: boolean;
  isToggling: boolean;
  likesCount: number;
  setIsToggling: (value: boolean) => void;
  toggleLike: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePostLikes = (postId: string, initialLikesCount = 0): PostLikesHook => {
  const [isLiked, setIsLiked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

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

  // Update likes count when initial value changes
  useEffect(() => {
    setLikesCount(Math.max(0, initialLikesCount));
  }, [initialLikesCount]);

  useEffect(() => {
    checkUserLike();
  }, [postId]);

  return { 
    isLiked, 
    isChecking, 
    isToggling, 
    likesCount,
    setIsToggling, 
    toggleLike,
    refetch: checkUserLike 
  };
};
