
import React, { useState } from 'react';
import { X, Image, MapPin, Tag, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ForumCategory, forumService } from '@/services/forumService';
import { toast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

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

        {/* Règles de modération */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm text-orange-700">
            <strong>Règles de la communauté :</strong> Respectez autrui, restez constructif, 
            partagez responsable. Les contenus inappropriés peuvent être supprimés.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user_name">Votre nom (optionnel)</Label>
              <Input
                id="user_name"
                placeholder="ex: Marie Dupont"
                value={formData.user_name}
                onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="user_email">Votre email (optionnel)</Label>
              <Input
                id="user_email"
                type="email"
                placeholder="ex: marie@example.com"
                value={formData.user_email}
                onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Donnez un titre accrocheur à votre post..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
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
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              placeholder="Partagez vos expériences, conseils, questions..."
              className="min-h-[120px]"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="flex items-center">
              <Image className="h-4 w-4 mr-1" />
              Image (optionnel)
            </Label>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
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
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Séparez les tags par des virgules
            </p>
          </div>

          <DialogFooter>
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
