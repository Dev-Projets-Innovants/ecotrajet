
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Leaf, Wrench, ArrowRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GuidePreview = () => {
  return (
    <section id="guide" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-eco-light-green rounded-full mb-4">
            <BookOpen className="h-6 w-6 text-eco-green" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Guide ÉcoTrajet</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos ressources complètes pour profiter pleinement de votre expérience ÉcoTrajet 
            et maximiser votre impact environnemental positif.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <Card className="transition-all duration-300 hover:shadow-md border-eco-light-green">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-eco-light-green mb-4">
                <BookOpen className="h-6 w-6 text-eco-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premiers pas</h3>
              <p className="text-gray-600 text-sm mb-4">
                Apprenez les bases pour bien démarrer avec ÉcoTrajet et les Vélib'.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-eco-light-green">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-eco-light-green mb-4">
                <Shield className="h-6 w-6 text-eco-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Conseils de sécurité</h3>
              <p className="text-gray-600 text-sm mb-4">
                Adoptez les bonnes pratiques pour rouler en toute sécurité dans Paris.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-eco-light-green">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-eco-light-green mb-4">
                <Leaf className="h-6 w-6 text-eco-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Impact écologique</h3>
              <p className="text-gray-600 text-sm mb-4">
                Mesurez votre contribution à la protection de l'environnement.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-eco-light-green">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-eco-light-green mb-4">
                <Wrench className="h-6 w-6 text-eco-green" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Entretien du vélo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Astuces pour maintenir votre vélo en parfait état.
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md border-eco-light-green">
            <Link to="/guide/tutorials">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-eco-light-green mb-4">
                  <Video className="h-6 w-6 text-eco-green" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Tutoriels vidéo</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Apprenez par la pratique avec nos tutoriels vidéo détaillés.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <Link to="/guide">
            <Button className="bg-eco-green hover:bg-eco-dark-green text-white">
              Explorer le guide complet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuidePreview;
