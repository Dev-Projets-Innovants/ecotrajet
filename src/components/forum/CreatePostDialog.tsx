
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ForumCategory } from '@/services/forum';
import CreatePostForm from './CreatePostForm';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  categories: ForumCategory[];
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau post</DialogTitle>
          <DialogDescription>
            Partagez vos expériences, conseils ou questions avec la communauté ÉcoTrajet
          </DialogDescription>
        </DialogHeader>

        <CreatePostForm
          categories={categories}
          onPostCreated={onPostCreated}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
