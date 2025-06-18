
import React from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { UserExperience } from '@/services/userExperiencesService';

interface ExperienceViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experience: UserExperience | null;
}

const ExperienceViewDialog: React.FC<ExperienceViewDialogProps> = ({
  isOpen,
  onClose,
  experience
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de l'expérience</DialogTitle>
          <DialogDescription>
            Soumis par {experience.name || 'Anonyme'} le{' '}
            {new Date(experience.created_at).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Note</h4>
            <div className="flex items-center gap-1">
              {renderStars(experience.rating)}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Catégorie</h4>
            <Badge variant="outline">{experience.category}</Badge>
          </div>
          <div>
            <h4 className="font-medium mb-2">Expérience</h4>
            <Textarea 
              readOnly 
              value={experience.experience_text} 
              className="min-h-[100px] bg-gray-50"
            />
          </div>
          {experience.image_url && (
            <div>
              <h4 className="font-medium mb-2">Image</h4>
              <img 
                src={experience.image_url} 
                alt="Experience" 
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceViewDialog;
