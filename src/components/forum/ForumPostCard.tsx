
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ForumPost, ForumCategory } from '@/services/forum';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useEditPost } from '@/hooks/useEditPost';
import { useDeletePost } from '@/hooks/useDeletePost';
import EditPostDialog from './EditPostDialog';
import DeletePostDialog from './DeletePostDialog';
import PostCardHeader from './PostCardHeader';
import PostCardActions from './PostCardActions';
import PostCardContent from './PostCardContent';
import PostCardInteractions from './PostCardInteractions';
import PostCardStatus from './PostCardStatus';

interface ForumPostCardProps {
  post: ForumPost;
  showRealTimeUpdates?: boolean;
  categories?: ForumCategory[];
  onPostUpdated?: (updatedPost: ForumPost) => void;
  onPostDeleted?: (postId: string) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ 
  post, 
  showRealTimeUpdates = false,
  categories = [],
  onPostUpdated,
  onPostDeleted
}) => {
  const navigate = useNavigate();
  const { 
    isLiked, 
    isChecking, 
    isToggling, 
    likesCount, 
    commentsCount, 
    toggleLike 
  } = usePostInteractions(post.id, post.likes_count, post.comments_count);

  const { canEdit, checkEditPermission } = useEditPost();
  const { canDelete, isDeleting, checkDeletePermission, deletePost } = useDeletePost();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<ForumPost>(post);

  console.log('ForumPostCard rendered for post:', post.id, 'canEdit:', canEdit, 'canDelete:', canDelete);

  useEffect(() => {
    console.log('Checking permissions for post:', post.id);
    checkEditPermission(post.id);
    checkDeletePermission(post.id);
  }, [post.id, checkEditPermission, checkDeletePermission]);

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

  const handleDeleteClick = () => {
    console.log('Delete button clicked for post:', post.id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await deletePost(post.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      } else {
        // Si on est sur la page de détail du post, rediriger vers la communauté
        navigate('/community');
      }
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <PostCardHeader
            post={currentPost}
            getUserDisplayName={getUserDisplayName}
            getUserInitials={getUserInitials}
            formatDate={formatDate}
          />
          
          <PostCardActions
            canEdit={canEdit}
            canDelete={canDelete}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>
        
        {/* Statut du post */}
        <PostCardStatus post={currentPost} />
      </CardHeader>

      <CardContent className="pt-0">
        <PostCardContent post={currentPost} />
        
        <PostCardInteractions
          postId={currentPost.id}
          isLiked={isLiked}
          isToggling={isToggling}
          isChecking={isChecking}
          likesCount={likesCount}
          commentsCount={commentsCount}
          toggleLike={toggleLike}
        />
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

      {/* Dialog de suppression */}
      <DeletePostDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          console.log('Closing delete dialog');
          setIsDeleteDialogOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        post={currentPost}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default ForumPostCard;
