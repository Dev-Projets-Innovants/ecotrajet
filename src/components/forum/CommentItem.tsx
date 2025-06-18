
import React, { useState } from 'react';
import { Heart, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { forumService } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

interface CommentWithReplies {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_identifier: string | null;
  content: string;
  likes_count: number;
  is_approved: boolean;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  replies?: CommentWithReplies[];
  isLiked?: boolean;
}

interface CommentItemProps {
  comment: CommentWithReplies;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onLike, level }) => {
  const [localLikesCount, setLocalLikesCount] = useState(comment.likes_count);
  const [isLocallyLiked, setIsLocallyLiked] = useState(comment.isLiked || false);
  const [isLiking, setIsLiking] = useState(false);

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
    return comment.user_name || 'Utilisateur anonyme';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
    // Mise à jour optimiste de l'UI
    const newLikeState = !isLocallyLiked;
    setIsLocallyLiked(newLikeState);
    setLocalLikesCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    try {
      await forumService.toggleCommentLike(comment.id);
      onLike(comment.id); // Callback pour informer le parent
    } catch (error) {
      // Rollback en cas d'erreur
      setIsLocallyLiked(!newLikeState);
      setLocalLikesCount(prev => newLikeState ? prev - 1 : prev + 1);
      
      console.error('Error toggling comment like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker ce commentaire",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-eco-light-green text-eco-green text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900 text-sm">
                  {getUserDisplayName()}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                {comment.content}
              </p>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`hover:bg-red-50 ${isLocallyLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart 
                    className={`h-3 w-3 mr-1 ${isLocallyLiked ? 'fill-current' : ''}`} 
                  />
                  {localLikesCount}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                  className="text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Répondre
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
