
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Leaf, AlertCircle, Car, Bike, Train, Bus } from 'lucide-react';

const CarbonCalculator = () => {
  const { toast } = useToast();
  const [distance, setDistance] = useState<number>(10);
  const [transportType, setTransportType] = useState<string>("car");
  const [frequency, setFrequency] = useState<number>(5);
  const [results, setResults] = useState<{ 
    current: number;
    alternative: number;
    saved: number;
    trees: number;
  } | null>(null);

  // Emission factors in kg CO2 per km
  const emissionFactors = {
    car: 0.192,
    motorbike: 0.103,
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0
  };

  const alternatives = {
    car: ["bus", "train", "bike"],
    motorbike: ["bus", "train", "bike"],
    bus: ["bike", "train"],
    train: ["bike"],
    bike: [],
    walk: []
  };

  const calculateEmissions = () => {
    if (!distance || !transportType || !frequency) {
      toast({
        title: "Données manquantes",
        description: "Veuillez compléter tous les champs du calculateur.",
        variant: "destructive",
      });
      return;
    }

    // Weekly emissions calculation
    const weeklyEmissions = distance * emissionFactors[transportType as keyof typeof emissionFactors] * frequency;
    const yearlyEmissions = weeklyEmissions * 52;
    
    // Find best alternative
    let bestAlternative = transportType;
    let bestAlternativeEmissions = yearlyEmissions;
    
    (alternatives[transportType as keyof typeof alternatives] || []).forEach((alt) => {
      const altEmissions = distance * emissionFactors[alt as keyof typeof emissionFactors] * frequency * 52;
      if (altEmissions < bestAlternativeEmissions) {
        bestAlternative = alt;
        bestAlternativeEmissions = altEmissions;
      }
    });
    
    // Calculate savings
    const savedEmissions = yearlyEmissions - bestAlternativeEmissions;
    // Rough calculation: 1 mature tree absorbs ~22kg CO2 per year
    const treesEquivalent = Math.round(savedEmissions / 22);
    
    setResults({
      current: Math.round(yearlyEmissions * 10) / 10,
      alternative: Math.round(bestAlternativeEmissions * 10) / 10,
      saved: Math.round(savedEmissions * 10) / 10,
      trees: treesEquivalent
    });
    
    toast({
      title: "Calcul terminé",
      description: "Votre empreinte carbone a été calculée avec succès.",
    });
  };

  const getTransportIcon = (type: string) => {
    switch(type) {
      case 'car': return <Car className="h-6 w-6" />;
      case 'bike': return <Bike className="h-6 w-6" />;
      case 'train': return <Train className="h-6 w-6" />;
      case 'bus': return <Bus className="h-6 w-6" />;
      default: return <Car className="h-6 w-6" />;
    }
  };

  return (
    <Layout title="Calculateur d'empreinte carbone">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-eco-green">Calculateur d'empreinte carbone</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Évaluez l'impact de vos déplacements quotidiens et découvrez comment réduire votre empreinte carbone.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vos habitudes de déplacement</CardTitle>
              <CardDescription>Renseignez les informations sur vos trajets habituels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mode de transport principal</label>
                <Select 
                  value={transportType} 
                  onValueChange={setTransportType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre mode de transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Voiture</SelectItem>
                    <SelectItem value="motorbike">Moto / Scooter</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train / Métro</SelectItem>
                    <SelectItem value="bike">Vélo</SelectItem>
                    <SelectItem value="walk">Marche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Distance moyenne par trajet (km)</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[distance]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(values) => setDistance(values[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-20"
                    min={1}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de trajets par semaine</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[frequency]}
                    min={1}
                    max={14}
                    step={1}
                    onValueChange={(values) => setFrequency(values[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={14}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={calculateEmissions} 
                className="w-full bg-eco-green hover:bg-eco-dark-green"
              >
                Calculer mon empreinte
              </Button>
            </CardFooter>
          </Card>
          
          {results ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-eco-green" />
                  Résultats du calcul
                </CardTitle>
                <CardDescription>Votre impact carbone annuel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avec votre mode de transport actuel :</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransportIcon(transportType)}
                      <span className="font-medium">{transportType === 'car' ? 'Voiture' : 
                              transportType === 'motorbike' ? 'Moto/Scooter' : 
                              transportType === 'bus' ? 'Bus' : 
                              transportType === 'train' ? 'Train/Métro' : 
                              transportType === 'bike' ? 'Vélo' : 'Marche'}</span>
                    </div>
                    <span className="text-xl font-bold">{results.current} kg CO₂</span>
                  </div>
                </div>
                
                {results.alternative < results.current && (
                  <div className="p-4 bg-eco-light-green dark:bg-eco-dark-green/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Alternative recommandée :</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTransportIcon(alternatives[transportType as keyof typeof alternatives][0])}
                        <span className="font-medium">
                          {alternatives[transportType as keyof typeof alternatives][0] === 'car' ? 'Voiture' : 
                          alternatives[transportType as keyof typeof alternatives][0] === 'bus' ? 'Bus' : 
                          alternatives[transportType as keyof typeof alternatives][0] === 'train' ? 'Train/Métro' : 
                          alternatives[transportType as keyof typeof alternatives][0] === 'bike' ? 'Vélo' : 'Marche'}
                        </span>
                      </div>
                      <span className="text-xl font-bold">{results.alternative} kg CO₂</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-100 dark:border-green-900/30">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Économies potentielles :</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-eco-green">CO₂ économisé par an</span>
                        <span className="text-xl font-bold text-eco-green">{results.saved} kg</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Équivalent à l'absorption annuelle de {results.trees} arbres
                      </div>
                    </div>
                  </div>
                )}
                
                {results.alternative >= results.current && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex gap-2 items-center text-amber-500">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Déjà optimal !</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Votre mode de transport actuel est déjà l'un des plus écologiques. Continuez comme ça !
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setResults(null)}
                  className="text-eco-green hover:text-eco-dark-green hover:bg-eco-light-green"
                >
                  Nouveau calcul
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <CardContent className="text-center py-12">
                <Leaf className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Remplissez le formulaire et cliquez sur "Calculer" pour voir votre impact carbone.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CarbonCalculator;
