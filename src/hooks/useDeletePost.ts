
import { useState } from 'react';
import { deletePostService } from '@/services/forum/deletePostService';
import { toast } from '@/hooks/use-toast';

export const useDeletePost = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const checkDeletePermission = async (postId: string) => {
    try {
      console.log('Checking delete permission for post:', postId);
      const permission = await deletePostService.canDeletePost(postId);
      console.log('Delete permission result:', permission);
      setCanDelete(permission);
      return permission;
    } catch (error) {
      console.error('Error checking delete permission:', error);
      setCanDelete(false);
      return false;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      console.log('Deleting post:', postId);
      setIsDeleting(true);
      
      const success = await deletePostService.deletePost(postId);
      console.log('Post deletion result:', success);
      
      if (success) {
        toast({
          title: "Post supprimé",
          description: "Votre post a été supprimé avec succès.",
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer le post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    canDelete,
    checkDeletePermission,
    deletePost
  };
};
