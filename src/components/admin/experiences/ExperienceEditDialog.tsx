
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserExperience } from '@/services/userExperiencesService';

interface ExperienceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  experience: UserExperience | null;
  editForm: {
    name: string;
    experience_text: string;
    rating: number;
    category: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{
    name: string;
    experience_text: string;
    rating: number;
    category: string;
  }>>;
  onSave: () => void;
}

const ExperienceEditDialog: React.FC<ExperienceEditDialogProps> = ({
  isOpen,
  onClose,
  experience,
  editForm,
  setEditForm,
  onSave
}) => {
  if (!experience) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier l'expérience</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Nom</label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Nom de l'auteur"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <Input
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              placeholder="Catégorie"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Note</label>
            <Input
              type="number"
              min="1"
              max="5"
              value={editForm.rating}
              onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Expérience</label>
            <Textarea
              value={editForm.experience_text}
              onChange={(e) => setEditForm({ ...editForm, experience_text: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceEditDialog;
