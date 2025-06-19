
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ForumPost } from '@/services/forum/types';

interface PostCardStatusProps {
  post: ForumPost;
}

const PostCardStatus: React.FC<PostCardStatusProps> = ({ post }) => {
  if (!post.is_approved && !post.is_reported) {
    return (
      <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
        En attente de modération
      </Badge>
    );
  }
  if (post.is_reported) {
    return (
      <Badge variant="destructive" className="text-xs">
        Rejeté
      </Badge>
    );
  }
  return null;
};

export default PostCardStatus;
