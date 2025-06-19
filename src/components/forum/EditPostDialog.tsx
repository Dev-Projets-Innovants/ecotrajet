
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditPostForm from './EditPostForm';
import { ForumPost, ForumCategory } from '@/services/forum/types';

interface EditPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: ForumPost;
  categories: ForumCategory[];
  onPostUpdated: (updatedPost: ForumPost) => void;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({
  isOpen,
  onClose,
  post,
  categories,
  onPostUpdated
}) => {
  console.log('EditPostDialog rendered with post:', post.id, 'isOpen:', isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le post</DialogTitle>
        </DialogHeader>
        
        <EditPostForm
          post={post}
          categories={categories}
          onClose={onClose}
          onPostUpdated={onPostUpdated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
