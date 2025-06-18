
import { useState, useCallback } from 'react';
import { usePostLikes } from './usePostLikes';
import { usePostComments } from './usePostComments';
import { usePostRealtimeUpdates } from './usePostRealtimeUpdates';

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
  const [likesCount, setLikesCount] = useState(Math.max(0, initialLikesCount));
  const [commentsCount, setCommentsCount] = useState(Math.max(0, initialCommentsCount));
  const [isLiked, setIsLiked] = useState(false);

  const likesHook = usePostLikes(postId, initialLikesCount);
  const commentsHook = usePostComments(initialCommentsCount);

  const realtimeCallbacks = useCallback(() => ({
    onLikeStateChange: (liked: boolean) => setIsLiked(liked),
    onLikesCountChange: (count: number | ((prev: number) => number)) => {
      if (typeof count === 'function') {
        setLikesCount(count);
      } else {
        setLikesCount(count);
      }
    },
    onCommentsCountChange: (count: number | ((prev: number) => number)) => {
      if (typeof count === 'function') {
        setCommentsCount(count);
      } else {
        setCommentsCount(count);
      }
    }
  }), []);

  usePostRealtimeUpdates(postId, realtimeCallbacks());

  return {
    isLiked: likesHook.isLiked || isLiked,
    isChecking: likesHook.isChecking,
    isToggling: likesHook.isToggling,
    likesCount: Math.max(0, likesHook.likesCount, likesCount),
    commentsCount: Math.max(0, commentsHook.commentsCount, commentsCount),
    setIsToggling: likesHook.setIsToggling,
    toggleLike: likesHook.toggleLike,
    refetch: likesHook.refetch
  };
};
