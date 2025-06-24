import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bike, 
  Train, 
  MapPin, 
  Clock, 
  Leaf, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import PersonalizeGuideButton from "@/components/guide/PersonalizeGuideButton";
import PersonalizedGuideSection from "@/components/guide/PersonalizedGuideSection";

const Guide = () => {
  const [activeTab, setActiveTab] = useState("premiers-pas");

  const transportModes = [
    {
      id: "bike",
      name: "Vélo",
      icon: <Bike className="h-6 w-6" />,
      description: "Le moyen le plus écologique et économique",
      co2Reduction: "100%",
      cost: "Gratuit",
      health: "Excellent",
      color: "bg-green-500"
    },
    {
      id: "ebike",
      name: "Vélo électrique",
      icon: <Bike className="h-6 w-6" />,
      description: "Parfait pour les longues distances",
      co2Reduction: "95%",
      cost: "Faible",
      health: "Très bon",
      color: "bg-blue-500"
    },
    {
      id: "metro",
      name: "Métro/RER",
      icon: <Train className="h-6 w-6" />,
      description: "Transport en commun rapide",
      co2Reduction: "80%",
      cost: "Modéré",
      health: "Bon",
      color: "bg-purple-500"
    }
  ];

  const safetyTips = [
    {
      category: "Équipement",
      tips: [
        "Portez toujours un casque",
        "Utilisez des éclairages avant et arrière",
        "Portez des vêtements réfléchissants"
      ]
    },
    {
      category: "Circulation",
      tips: [
        "Respectez le code de la route",
        "Signalez vos changements de direction",
        "Gardez une distance de sécurité"
      ]
    },
    {
      category: "Météo",
      tips: [
        "Adaptez votre vitesse par temps de pluie",
        "Évitez les sorties par temps de gel",
        "Protégez-vous du soleil"
      ]
    }
  ];

  return (
    <Layout title="Guide ÉcoTrajet">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Guide de l'Éco-Mobilité
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Tout ce que vous devez savoir pour adopter une mobilité respectueuse de l'environnement
          </p>
          
          {/* Bouton de personnalisation */}
          <div className="mb-6">
            <PersonalizeGuideButton />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="premiers-pas">Premiers pas</TabsTrigger>
            <TabsTrigger value="transports">Transports</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
            <TabsTrigger value="communaute">Communauté</TabsTrigger>
          </TabsList>

          <TabsContent value="premiers-pas" className="space-y-6">
            {/* Section du guide personnalisé */}
            <PersonalizedGuideSection section="premiers-pas" />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Guide Général
                </CardTitle>
                <CardDescription>
                  Les bases pour commencer votre transition vers l'éco-mobilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-eco-light-green/20 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-eco-green text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Évaluez vos trajets actuels</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Analysez vos déplacements quotidiens pour identifier les opportunités d'amélioration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-eco-light-green/20 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-eco-green text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Choisissez votre mode de transport</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Sélectionnez les moyens de transport les plus adaptés à vos besoins
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-eco-light-green/20 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-eco-green text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Planifiez vos trajets</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Utilisez notre planificateur pour optimiser vos déplacements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transports" className="space-y-6">
            <div className="grid gap-6">
              {transportModes.map((mode) => (
                <Card key={mode.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${mode.color} text-white rounded-lg`}>
                          {mode.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{mode.name}</CardTitle>
                          <CardDescription>{mode.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mode.co2Reduction}</div>
                        <div className="text-sm text-gray-500">Réduction CO₂</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{mode.cost}</div>
                        <div className="text-sm text-gray-500">Coût</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{mode.health}</div>
                        <div className="text-sm text-gray-500">Santé</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="securite" className="space-y-6">
            <div className="grid gap-6">
              {safetyTips.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communaute" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-eco-green" />
                  Rejoignez la communauté
                </CardTitle>
                <CardDescription>
                  Partagez vos expériences et apprenez des autres
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Notre communauté vous permet de poser des questions, partager vos trajets, 
                  et découvrir de nouvelles façons de vous déplacer de manière écologique.
                </p>
                <div className="flex space-x-4">
                  <Button asChild>
                    <a href="/community">
                      Voir la communauté
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Guide;
