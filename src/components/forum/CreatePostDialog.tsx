
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ForumCategory, forumService } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';
import PostFormRules from './PostFormRules';
import PostFormFields from './PostFormFields';

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
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    location: '',
    tags: '',
    user_name: '',
    user_email: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le contenu sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category_id: formData.category_id || undefined,
        location: formData.location.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        user_name: formData.user_name.trim() || undefined,
        user_email: formData.user_email.trim() || undefined,
        image_url: formData.image_url || undefined,
      };

      const { error } = await forumService.createPost(postData);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Votre post a été créé avec succès !",
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        category_id: '',
        location: '',
        tags: '',
        user_name: '',
        user_email: '',
        image_url: '',
      });

      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le post. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
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

        <PostFormRules />

        <form onSubmit={handleSubmit}>
          <PostFormFields
            formData={formData}
            categories={categories}
            onFormDataChange={handleFormDataChange}
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
          />

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-eco-green hover:bg-eco-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
