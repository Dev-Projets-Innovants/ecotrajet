
import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ForumPost } from '@/services/forum/types';

interface PostCardHeaderProps {
  post: ForumPost;
  getUserDisplayName: () => string;
  getUserInitials: () => string;
  formatDate: (dateString: string) => string;
}

const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  post,
  getUserDisplayName,
  getUserInitials,
  formatDate
}) => {
  return (
    <div className="flex items-center space-x-3 flex-1">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-eco-light-green text-eco-green">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-900 truncate">
            {getUserDisplayName()}
          </span>
          {post.forum_categories && (
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: post.forum_categories.color + '20',
                color: post.forum_categories.color,
                borderColor: post.forum_categories.color + '40'
              }}
            >
              {post.forum_categories.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm space-x-2">
          <Clock className="h-3 w-3" />
          <span>{formatDate(post.created_at)}</span>
          {post.location && (
            <>
              <MapPin className="h-3 w-3 ml-2" />
              <span className="truncate">{post.location}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCardHeader;
