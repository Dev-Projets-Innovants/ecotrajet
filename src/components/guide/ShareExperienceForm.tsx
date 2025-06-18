
import React, { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { userExperiencesService } from '@/services/userExperiencesService';

export const ShareExperienceForm: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!experience.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez partager votre expérience avant de soumettre.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await userExperiencesService.createExperience({
        experience_text: experience.trim(),
        name: name.trim() || undefined,
        rating: parseInt(rating),
        category: 'bike_maintenance'
      });

      if (error) {
        console.error('Error creating experience:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de votre expérience.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Merci pour votre contribution !",
        description: "Votre expérience a été soumise et sera examinée avant publication.",
      });
      
      // Reset form
      setExperience('');
      setName('');
      setRating('5');
    } catch (error) {
      console.error('Error submitting experience:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="bg-eco-light-green p-2 rounded-full">
            <MessageSquare className="h-5 w-5 text-eco-green" />
          </div>
          <span>Partagez votre expérience</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-eco-green hover:bg-eco-dark-green text-white"
              disabled={isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Envoi en cours...' : 'Partager mon expérience'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Votre témoignage sera examiné par notre équipe avant d'être publié sur notre site pour maintenir la qualité de notre communauté.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
