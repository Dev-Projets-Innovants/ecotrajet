
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from './ImageUpload';
import { useEditPost } from '@/hooks/useEditPost';
import { ForumPost, ForumCategory } from '@/services/forum/types';

interface EditPostFormProps {
  post: ForumPost;
  categories: ForumCategory[];
  onClose: () => void;
  onPostUpdated: (updatedPost: ForumPost) => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  categories,
  onClose,
  onPostUpdated
}) => {
  const { isEditing, updatePost } = useEditPost();
  
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    category_id: post.category_id || '',
    location: post.location || '',
    image_url: post.image_url || '',
    tags: post.tags ? post.tags.join(', ') : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      title: formData.title,
      content: formData.content,
      category_id: formData.category_id || null,
      location: formData.location || null,
      image_url: formData.image_url || null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null
    };

    const updatedPost = await updatePost(post.id, updates);
    if (updatedPost) {
      onPostUpdated(updatedPost);
      onClose();
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Titre de votre post"
          required
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="content">Contenu *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Partagez votre expérience, vos conseils ou vos questions..."
          required
          minLength={10}
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select 
          value={formData.category_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Paris, Lyon, Marseille..."
          maxLength={50}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="vélo, transport, écologie (séparés par des virgules)"
        />
      </div>

      <ImageUpload
        currentImageUrl={formData.image_url}
        onImageUpload={handleImageUpload}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isEditing || !formData.title.trim() || !formData.content.trim()}
          className="bg-eco-green hover:bg-eco-green/90"
        >
          {isEditing ? 'Modification...' : 'Modifier le post'}
        </Button>
      </div>
    </form>
  );
};

export default EditPostForm;
