
import { useState } from 'react';
import { forumService, ForumCategory } from '@/services/forum';
import { toast } from '@/hooks/use-toast';

interface PostFormData {
  title: string;
  content: string;
  category_id: string;
  location: string;
  tags: string;
  user_name: string;
  user_email: string;
  image_url: string;
}

const initialFormData: PostFormData = {
  title: '',
  content: '',
  category_id: '',
  location: '',
  tags: '',
  user_name: '',
  user_email: '',
  image_url: '',
};

export const usePostForm = (onPostCreated: () => void, onClose: () => void) => {
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
  };

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
    
    console.log('Form submission started with data:', formData);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
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

      console.log('Sending post data:', postData);

      const { error } = await forumService.createPost(postData);
      
      if (error) {
        console.error('Create post error:', error);
        throw error;
      }

      console.log('Post created successfully');

      toast({
        title: "Succès",
        description: "Votre post a été créé avec succès !",
      });

      // Reset form and close dialog
      resetForm();
      onPostCreated();
      onClose();
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

  const handleFormDataChange = (updates: Partial<PostFormData>) => {
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
    const isValid = formData.user_name.trim() &&
           formData.user_email.trim() &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email) &&
           formData.title.trim().length >= 5 &&
           formData.category_id &&
           formData.content.trim().length >= 20;
    
    console.log('Form validation check:', {
      user_name: formData.user_name.trim(),
      user_email: formData.user_email.trim(),
      email_valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email),
      title_length: formData.title.trim().length,
      category_id: formData.category_id,
      content_length: formData.content.trim().length,
      isValid
    });
    
    return isValid;
  };

  return {
    formData,
    isSubmitting,
    resetForm,
    handleSubmit,
    handleFormDataChange,
    handleImageUploaded,
    handleImageRemoved,
    isFormValid,
  };
};
