
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Tag, Clock, User, Flag, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ForumPost, ForumCategory } from '@/services/forum';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useEditPost } from '@/hooks/useEditPost';
import EditPostDialog from './EditPostDialog';

interface ForumPostCardProps {
  post: ForumPost;
  showRealTimeUpdates?: boolean;
  categories?: ForumCategory[];
  onPostUpdated?: (updatedPost: ForumPost) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ 
  post, 
  showRealTimeUpdates = false,
  categories = [],
  onPostUpdated
}) => {
  const { 
    isLiked, 
    isChecking, 
    isToggling, 
    likesCount, 
    commentsCount, 
    toggleLike 
  } = usePostInteractions(post.id, post.likes_count, post.comments_count);

  const { canEdit, checkEditPermission } = useEditPost();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<ForumPost>(post);

  console.log('ForumPostCard rendered for post:', post.id, 'canEdit:', canEdit);

  useEffect(() => {
    console.log('Checking edit permission for post:', post.id);
    checkEditPermission(post.id);
  }, [post.id, checkEditPermission]);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserDisplayName = () => {
    return currentPost.user_name || 'Utilisateur anonyme';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handlePostUpdated = (updatedPost: ForumPost) => {
    console.log('Post updated in ForumPostCard:', updatedPost.id);
    setCurrentPost(updatedPost);
    if (onPostUpdated) {
      onPostUpdated(updatedPost);
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked for post:', post.id);
    setIsEditDialogOpen(true);
  };

  const getPostStatus = () => {
    if (!currentPost.is_approved && !currentPost.is_reported) {
      return (
        <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
          En attente de modération
        </Badge>
      );
    }
    if (currentPost.is_reported) {
      return (
        <Badge variant="destructive" className="text-xs">
          Rejeté
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
                {currentPost.forum_categories && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: currentPost.forum_categories.color + '20',
                      color: currentPost.forum_categories.color,
                      borderColor: currentPost.forum_categories.color + '40'
                    }}
                  >
                    {currentPost.forum_categories.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-gray-500 text-sm space-x-2">
                <Clock className="h-3 w-3" />
                <span>{formatDate(currentPost.created_at)}</span>
                {currentPost.location && (
                  <>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span className="truncate">{currentPost.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Bouton d'édition */}
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditClick}
              className="text-gray-400 hover:text-gray-600"
              title="Modifier ce post"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Statut du post */}
        {getPostStatus() && (
          <div className="mt-2">
            {getPostStatus()}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <Link to={`/community/post/${currentPost.id}`} className="block group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-eco-green transition-colors mb-2">
                {currentPost.title}
              </h3>
            </Link>
            
            <p className="text-gray-700 line-clamp-3 mb-3">
              {currentPost.content}
            </p>

            {/* Image */}
            {currentPost.image_url && (
              <div className="mb-4">
                <img
                  src={currentPost.image_url}
                  alt="Image du post"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Tags */}
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {currentPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
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
              
              <Link to={`/community/post/${currentPost.id}`}>
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
        </div>
      </CardContent>

      {/* Dialog d'édition */}
      {canEdit && categories.length > 0 && (
        <EditPostDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            console.log('Closing edit dialog');
            setIsEditDialogOpen(false);
          }}
          post={currentPost}
          categories={categories}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </Card>
  );
};

export default ForumPostCard;
