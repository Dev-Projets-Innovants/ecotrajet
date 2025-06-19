
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ForumPost } from '@/services/forum/types';

interface PostCardContentProps {
  post: ForumPost;
}

const PostCardContent: React.FC<PostCardContentProps> = ({ post }) => {
  return (
    <div className="space-y-4">
      <div>
        <Link to={`/community/post/${post.id}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-eco-green transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-700 line-clamp-3 mb-3">
          {post.content}
        </p>

        {/* Image */}
        {post.image_url && (
          <div className="mb-4">
            <img
              src={post.image_url}
              alt="Image du post"
              className="w-full h-64 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCardContent;
