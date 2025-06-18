import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { forumService, ForumComment } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';

interface CommentSectionProps {
  postId: string;
}

interface CommentWithReplies extends ForumComment {
  replies?: CommentWithReplies[];
  isLiked?: boolean;
}

const CommentItem: React.FC<{
  comment: CommentWithReplies;
  onReply: (parentId: string) => void;
  onLike: (commentId: string) => void;
  level: number;
}> = ({ comment, onReply, onLike, level }) => {
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

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await forumService.getComments(postId);
      
      if (error) throw error;
      
      if (data) {
        // Organiser les commentaires avec leurs réponses
        const commentsWithReplies = organizeComments(data);
        
        // Vérifier les likes pour chaque commentaire
        const commentsWithLikes = await Promise.all(
          commentsWithReplies.map(async (comment) => {
            const isLiked = await forumService.hasUserLikedComment(comment.id);
            return { ...comment, isLiked };
          })
        );
        
        setComments(commentsWithLikes);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const organizeComments = (flatComments: ForumComment[]): CommentWithReplies[] => {
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // Créer une map de tous les commentaires
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organiser en arbre
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await forumService.createComment({
        post_id: postId,
        content: newComment,
        parent_comment_id: replyTo || undefined,
      });

      if (error) throw error;

      setNewComment('');
      setReplyTo(null);
      await fetchComments();
      
      toast({
        title: "Commentaire publié",
        description: "Votre commentaire a été publié avec succès !",
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier le commentaire",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Cette fonction est appelée par les CommentItem pour notifier les changements
    // Nous pourrions ici mettre à jour le cache local si nécessaire
    console.log('Comment like toggled:', commentId);
  };

  const handleReply = (parentId: string) => {
    setReplyTo(parentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulaire de commentaire */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {replyTo && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <span className="text-sm text-blue-700">
                  Réponse à un commentaire
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                  className="text-blue-700 hover:bg-blue-100"
                >
                  Annuler
                </Button>
              </div>
            )}
            
            <Textarea
              placeholder="Écrivez votre commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Soyez respectueux et constructif dans vos commentaires
              </span>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-eco-green hover:bg-eco-green/90"
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLikeComment}
              level={0}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
