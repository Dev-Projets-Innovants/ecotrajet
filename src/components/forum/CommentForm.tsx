
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { forumService } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';

interface CommentFormProps {
  postId: string;
  replyTo: string | null;
  onCommentCreated: () => void;
  onCancelReply: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  replyTo,
  onCommentCreated,
  onCancelReply,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onCommentCreated();
      
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

  return (
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
                onClick={onCancelReply}
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
  );
};

export default CommentForm;
