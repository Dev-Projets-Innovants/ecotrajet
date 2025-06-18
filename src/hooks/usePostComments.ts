
import { useState, useEffect } from 'react';

interface PostCommentsHook {
  commentsCount: number;
}

export const usePostComments = (initialCommentsCount = 0): PostCommentsHook => {
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  // Update comments count when initial value changes
  useEffect(() => {
    setCommentsCount(Math.max(0, initialCommentsCount));
  }, [initialCommentsCount]);

  return { 
    commentsCount
  };
};
