
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGeminiRecommendations } from '@/hooks/useGeminiRecommendations';
import { toast } from '@/hooks/use-toast';

const PersonalizeGuideButton = () => {
  const { user } = useAuth();
  const { getPersonalizedGuide, isLoading } = useGeminiRecommendations();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    experience: '',
    interests: '',
    goals: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour personnaliser votre guide",
        variant: "destructive"
      });
      return;
    }

    try {
      const guide = await getPersonalizedGuide(user.id, 'premiers-pas');
      if (guide) {
        toast({
          title: "Guide personnalisé créé !",
          description: "Votre guide ÉcoTrajet a été personnalisé selon vos préférences",
        });
        setIsOpen(false);
        // Ici on pourrait rediriger vers une page dédiée ou afficher le guide
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer votre guide personnalisé",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-eco-green hover:bg-eco-green/90 text-white">
          <Sparkles className="mr-2 h-4 w-4" />
          Personnaliser mon guide ÉcoTrajet avec l'IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-eco-green" />
            Personnaliser votre guide ÉcoTrajet
          </DialogTitle>
          <DialogDescription>
            Répondez à quelques questions pour obtenir un guide personnalisé adapté à vos besoins
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="city">Votre ville</Label>
            <Input
              id="city"
              placeholder="ex: Paris, Lyon, Marseille..."
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="experience">Votre niveau d'expérience</Label>
            <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debutant">Débutant - Je découvre l'éco-mobilité</SelectItem>
                <SelectItem value="intermediaire">Intermédiaire - J'ai quelques habitudes éco</SelectItem>
                <SelectItem value="avance">Avancé - J'utilise déjà plusieurs modes éco</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="interests">Vos centres d'intérêt</Label>
            <Textarea
              id="interests"
              placeholder="ex: vélo, transport en commun, marche, économies, santé..."
              value={formData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="goals">Vos objectifs</Label>
            <Textarea
              id="goals"
              placeholder="ex: réduire mon empreinte carbone, économiser de l'argent, améliorer ma santé..."
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-eco-green hover:bg-eco-green/90">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                'Générer mon guide'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizeGuideButton;
