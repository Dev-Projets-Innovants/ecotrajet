
import React from 'react';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserExperience } from '@/services/userExperiencesService';

interface ExperienceViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experience: UserExperience | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ExperienceViewDialog: React.FC<ExperienceViewDialogProps> = ({
  isOpen,
  onClose,
  experience,
  onApprove,
  onReject
}) => {
  if (!experience) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Détail de l'expérience</DialogTitle>
          <DialogDescription>
            Soumis par {experience.name || 'Anonyme'} le {new Date(experience.created_at).toLocaleDateString('fr-FR')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Auteur:</label>
            <p className="text-sm text-gray-600">{experience.name || 'Anonyme'}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Note:</label>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(experience.rating)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Catégorie:</label>
            <Badge variant="outline" className="ml-2">{experience.category}</Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Statut:</label>
            <Badge className={experience.is_approved ? "bg-green-500 ml-2" : "bg-amber-500 ml-2"}>
              {experience.is_approved ? 'Approuvé' : 'En attente'}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Expérience:</label>
            <Textarea 
              readOnly 
              value={experience.experience_text} 
              className="min-h-[100px] bg-gray-50 dark:bg-gray-900 mt-1"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={() => onReject(experience.id)}
            disabled={!experience.is_approved}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
          <Button 
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(experience.id)}
            disabled={experience.is_approved}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceViewDialog;
