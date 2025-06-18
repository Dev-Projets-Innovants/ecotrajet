
import { useState, useEffect } from 'react';
import { forumService, ForumComment } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';

interface CommentWithReplies extends ForumComment {
  replies?: CommentWithReplies[];
  isLiked?: boolean;
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLikeComment = async (commentId: string) => {
    // Cette fonction est appelée par les CommentItem pour notifier les changements
    // Nous pourrions ici mettre à jour le cache local si nécessaire
    console.log('Comment like toggled:', commentId);
  };

  return {
    comments,
    isLoading,
    fetchComments,
    handleLikeComment,
  };
};
