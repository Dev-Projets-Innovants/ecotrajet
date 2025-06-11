
import React, { useState } from 'react';
import { MessageSquare, Star, Send, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ShareExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareExperienceModal: React.FC<ShareExperienceModalProps> = ({ open, onOpenChange }) => {
  const [experience, setExperience] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!experience.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez partager votre expérience avant de soumettre.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send the data to an API
    toast({
      title: "Merci pour votre contribution !",
      description: "Votre expérience a été partagée avec succès.",
    });
    
    // Reset form and close modal
    setExperience('');
    setName('');
    setRating('5');
    setSelectedFile(null);
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    // Reset form when closing
    setExperience('');
    setName('');
    setRating('5');
    setSelectedFile(null);
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="bg-eco-light-green p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-eco-green" />
            </div>
            <span>Partagez votre expérience</span>
          </DialogTitle>
          <DialogDescription>
            Votre témoignage est précieux ! Partagez votre expérience avec ÉcoTrajet pour inspirer d'autres utilisateurs.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="experience" className="text-base font-medium">
              Votre expérience *
            </Label>
            <Textarea
              id="experience"
              placeholder="Partagez votre expérience avec ÉcoTrajet..."
              className="h-32 mt-2"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="name" className="text-base font-medium">
              Votre nom
            </Label>
            <Input
              id="name"
              placeholder="Comment souhaitez-vous être identifié(e) ?"
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Laissez vide pour rester anonyme
            </p>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-2 block">
              Évaluez votre satisfaction
            </Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value.toString())}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      parseInt(rating) >= value
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="photo" className="text-base font-medium">
              Ajouter une photo (optionnel)
            </Label>
            <div className="mt-2 flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="flex items-center space-x-2"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Choisir une image</span>
              </Button>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'Aucun fichier sélectionné'}
              </span>
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-eco-green hover:bg-eco-dark-green text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              Partager mon expérience
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareExperienceModal;
