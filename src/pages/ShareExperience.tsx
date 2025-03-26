
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Send, Image as ImageIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const ShareExperience = () => {
  const [experience, setExperience] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    // For now, we'll just show a success message and redirect
    toast({
      title: "Merci pour votre contribution !",
      description: "Votre expérience a été partagée avec succès.",
    });
    
    // Redirect to the guide page after submission
    setTimeout(() => {
      navigate('/guide');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link to="/guide" className="inline-flex items-center text-eco-green hover:text-eco-dark-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Guide
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-eco-light-green p-2.5 rounded-full mr-3">
                  <MessageSquare className="h-6 w-6 text-eco-green" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">Partagez votre expérience</h1>
              </div>
              
              <p className="text-gray-600 mb-8">
                Votre témoignage est précieux ! Partagez votre expérience avec ÉcoTrajet pour inspirer d'autres utilisateurs et nous aider à améliorer notre service.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="experience" className="text-base font-medium">
                    Votre expérience *
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Partagez votre expérience avec ÉcoTrajet..."
                    className="h-40 mt-2"
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
                          className={`h-8 w-8 ${
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
                      <ImageIcon className="h-5 w-5" />
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
                      <div className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <Button
                    type="submit"
                    className="bg-eco-green hover:bg-eco-dark-green text-white px-8"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Partager mon expérience
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShareExperience;
