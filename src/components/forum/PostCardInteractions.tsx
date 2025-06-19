
import React from 'react';
import { Heart, MessageCircle, Share2, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PostCardInteractionsProps {
  postId: string;
  isLiked: boolean;
  isToggling: boolean;
  isChecking: boolean;
  likesCount: number;
  commentsCount: number;
  toggleLike: () => Promise<void>;
}

const PostCardInteractions: React.FC<PostCardInteractionsProps> = ({
  postId,
  isLiked,
  isToggling,
  isChecking,
  likesCount,
  commentsCount,
  toggleLike
}) => {
  return (
    <div className="flex items-center justify-between pt-2 border-t">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          disabled={isToggling || isChecking}
          className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </Button>
        
        <Link to={`/community/post/${postId}`}>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-blue-50 hover:text-blue-600">
            <MessageCircle className="h-4 w-4 mr-1" />
            {commentsCount}
          </Button>
        </Link>
        
        <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-green-50 hover:text-green-600">
          <Share2 className="h-4 w-4 mr-1" />
          Partager
        </Button>
      </div>

      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
        <Flag className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PostCardInteractions;
