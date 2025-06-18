
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Calendar, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ForumPost, forumService } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';

interface ForumPostCardProps {
  post: ForumPost;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfLiked();
  }, [post.id]);

  const checkIfLiked = async () => {
    try {
      const liked = await forumService.hasUserLikedPost(post.id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation lors du clic sur like
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await forumService.togglePostLike(post.id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      toast({
        title: isLiked ? "Like retiré" : "Post liké",
        description: isLiked ? "Vous avez retiré votre like" : "Merci pour votre soutien !",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker ce post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: `${window.location.origin}/community/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
      toast({
        title: "Lien copié",
        description: "Le lien du post a été copié dans le presse-papiers",
      });
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/community/post/${post.id}`);
  };

  const handleCardClick = () => {
    navigate(`/community/post/${post.id}`);
  };

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
    return post.user_name || 'Utilisateur anonyme';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-eco-light-green text-eco-green">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {getUserDisplayName()}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.created_at)}
                </span>
              </div>
              {post.location && (
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.location}
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Category Badge */}
        {post.forum_categories && (
          <Badge 
            variant="outline" 
            className="mb-3"
            style={{ 
              borderColor: post.forum_categories.color, 
              color: post.forum_categories.color 
            }}
          >
            {post.forum_categories.name}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {post.title}
        </h3>

        {/* Content */}
        <div className="text-gray-700 mb-4 leading-relaxed">
          {post.content.length > 300 ? (
            <>
              {post.content.substring(0, 300)}...
              <span className="text-eco-green hover:underline ml-2">
                Lire plus
              </span>
            </>
          ) : (
            post.content
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Image */}
        {post.image_url && (
          <div className="mb-4">
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart 
                className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} 
              />
              {likesCount}
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCommentClick}
              className="text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments_count}
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare} 
              className="text-gray-500 hover:bg-green-50 hover:text-green-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>

          {post.is_pinned && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Épinglé
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumPostCard;
