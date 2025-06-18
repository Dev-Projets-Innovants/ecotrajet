
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import PostFormRules from './PostFormRules';
import PostFormFields from './PostFormFields';
import { ForumCategory } from '@/services/forum';
import { usePostForm } from './hooks/usePostForm';

interface CreatePostFormProps {
  categories: ForumCategory[];
  onPostCreated: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  categories,
  onPostCreated,
  onClose,
}) => {
  const {
    formData,
    isSubmitting,
    handleSubmit,
    handleFormDataChange,
    handleImageUploaded,
    handleImageRemoved,
    isFormValid,
  } = usePostForm(onPostCreated, onClose);

  return (
    <>
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
            onClick={onClose}
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
    </>
  );
};

export default CreatePostForm;
