
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
import { ForumCategory, forumService } from '@/services/forum';
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

  const validateForm = () => {
    const errors = [];

    // Validation du nom
    if (!formData.user_name.trim()) {
      errors.push("Le nom est obligatoire");
    }

    // Validation de l'email
    if (!formData.user_email.trim()) {
      errors.push("L'email est obligatoire");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      errors.push("L'email n'est pas valide");
    }

    // Validation du titre
    if (!formData.title.trim()) {
      errors.push("Le titre est obligatoire");
    } else if (formData.title.trim().length < 5) {
      errors.push("Le titre doit contenir au moins 5 caractères");
    } else if (formData.title.trim().length > 200) {
      errors.push("Le titre ne peut pas dépasser 200 caractères");
    }

    // Validation de la catégorie
    if (!formData.category_id) {
      errors.push("La catégorie est obligatoire");
    }

    // Validation du contenu
    if (!formData.content.trim()) {
      errors.push("Le contenu est obligatoire");
    } else if (formData.content.trim().length < 20) {
      errors.push("Le contenu doit contenir au moins 20 caractères");
    } else if (formData.content.trim().length > 2000) {
      errors.push("Le contenu ne peut pas dépasser 2000 caractères");
    }

    // Validation des tags
    if (formData.tags) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tags.length > 5) {
        errors.push("Vous ne pouvez pas ajouter plus de 5 tags");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Erreur de validation",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category_id: formData.category_id,
        location: formData.location.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        user_name: formData.user_name.trim(),
        user_email: formData.user_email.trim(),
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

  // Vérifier si le formulaire est valide pour activer/désactiver le bouton
  const isFormValid = () => {
    return formData.user_name.trim() &&
           formData.user_email.trim() &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email) &&
           formData.title.trim().length >= 5 &&
           formData.category_id &&
           formData.content.trim().length >= 20;
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
              disabled={isSubmitting || !isFormValid()}
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
