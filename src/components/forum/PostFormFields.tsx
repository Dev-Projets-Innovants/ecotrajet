
import React from 'react';
import { Image, MapPin, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ForumCategory } from '@/services/forum';
import ImageUpload from './ImageUpload';

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

interface PostFormFieldsProps {
  formData: PostFormData;
  categories: ForumCategory[];
  onFormDataChange: (updates: Partial<PostFormData>) => void;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

const PostFormFields: React.FC<PostFormFieldsProps> = ({
  formData,
  categories,
  onFormDataChange,
  onImageUploaded,
  onImageRemoved,
}) => {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user_name">
            Votre nom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="user_name"
            placeholder="ex: Marie Dupont"
            value={formData.user_name}
            onChange={(e) => onFormDataChange({ user_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="user_email">
            Votre email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="user_email"
            type="email"
            placeholder="ex: marie@example.com"
            value={formData.user_email}
            onChange={(e) => onFormDataChange({ user_email: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">
          Titre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Donnez un titre accrocheur à votre post..."
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
          required
          minLength={5}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          Entre 5 et 200 caractères
        </p>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">
          Catégorie <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.category_id} 
          onValueChange={(value) => onFormDataChange({ category_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisissez une catégorie..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content">
          Contenu <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Partagez vos expériences, conseils, questions... (minimum 20 caractères)"
          className="min-h-[120px]"
          value={formData.content}
          onChange={(e) => onFormDataChange({ content: e.target.value })}
          required
          minLength={20}
          maxLength={2000}
        />
        <p className="text-xs text-gray-500 mt-1">
          Entre 20 et 2000 caractères ({formData.content.length}/2000)
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <Label className="flex items-center">
          <Image className="h-4 w-4 mr-1" />
          Image (optionnel)
        </Label>
        <ImageUpload
          onImageUploaded={onImageUploaded}
          onImageRemoved={onImageRemoved}
          imageUrl={formData.image_url}
        />
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location" className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Localisation (optionnel)
        </Label>
        <Input
          id="location"
          placeholder="ex: Paris 15e, Métro ligne 1..."
          value={formData.location}
          onChange={(e) => onFormDataChange({ location: e.target.value })}
          maxLength={100}
        />
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags" className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          Tags (optionnel)
        </Label>
        <Input
          id="tags"
          placeholder="ex: vélo, entretien, sécurité (séparés par des virgules)"
          value={formData.tags}
          onChange={(e) => onFormDataChange({ tags: e.target.value })}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          Séparez les tags par des virgules (maximum 5 tags)
        </p>
      </div>
    </div>
  );
};

export default PostFormFields;
