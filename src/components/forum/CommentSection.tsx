
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { comments, isLoading, fetchComments, handleLikeComment } = useComments(postId);

  const handleReply = (parentId: string) => {
    setReplyTo(parentId);
  };

  const handleCommentCreated = async () => {
    setReplyTo(null);
    await fetchComments();
  };

  const handleCancelReply = () => {
    setReplyTo(null);
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
      <CommentForm
        postId={postId}
        replyTo={replyTo}
        onCommentCreated={handleCommentCreated}
        onCancelReply={handleCancelReply}
      />

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
