
import { useState } from 'react';
import { editPostService } from '@/services/forum/editPostService';
import { ForumPost } from '@/services/forum/types';
import { toast } from '@/hooks/use-toast';

export const useEditPost = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const checkEditPermission = async (postId: string) => {
    try {
      const permission = await editPostService.canEditPost(postId);
      setCanEdit(permission);
      return permission;
    } catch (error) {
      console.error('Error checking edit permission:', error);
      setCanEdit(false);
      return false;
    }
  };

  const updatePost = async (postId: string, updates: {
    title?: string;
    content?: string;
    category_id?: string;
    tags?: string[];
    location?: string;
    image_url?: string;
  }): Promise<ForumPost | null> => {
    try {
      setIsEditing(true);
      const updatedPost = await editPostService.updatePost(postId, updates);
      
      toast({
        title: "Post modifié",
        description: "Votre post a été modifié avec succès. Il sera re-examiné avant publication.",
      });

      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le post",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    canEdit,
    checkEditPermission,
    updatePost
  };
};
