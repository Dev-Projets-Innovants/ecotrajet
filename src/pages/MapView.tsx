
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Bike, Zap, Route, Car, Leaf, Filter, Search, Info } from 'lucide-react';

const MapView = () => {
  return (
    <Layout title="Carte interactive">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Carte interactive</h1>
          <p className="text-gray-600">
            Explorez les options de mobilité écologique et planifiez vos trajets de manière responsable.
          </p>
        </div>
        
        {/* Future Map Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Rechercher une adresse..." 
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span>Itinéraire</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Légende</span>
          </Button>
        </div>
        
        {/* Map Container Placeholder */}
        <div className="relative h-[calc(100vh-300px)] min-h-[500px] rounded-xl overflow-hidden shadow-lg mb-6 bg-eco-light-blue">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-eco-green text-xl font-medium mb-3">Carte interactive en développement</div>
            <div className="text-gray-600 max-w-md text-center mb-6">
              Notre équipe travaille sur l'intégration d'une carte interactive complète avec Google Maps.
            </div>
          </div>
        </div>
        
        {/* Legend and Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Bike className="h-5 w-5 text-eco-green" />
              <span>Vélos et trottinettes</span>
            </h3>
            <p className="text-sm text-gray-600">
              Stations de vélos en libre-service, zones de stationnement des trottinettes.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Zap className="h-5 w-5 text-eco-green" />
              <span>Recharge électrique</span>
            </h3>
            <p className="text-sm text-gray-600">
              Bornes de recharge pour véhicules électriques, temps d'attente estimés.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Route className="h-5 w-5 text-eco-green" />
              <span>Itinéraires verts</span>
            </h3>
            <p className="text-sm text-gray-600">
              Pistes cyclables, chemins piétons, voies réservées aux transports en commun.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Car className="h-5 w-5 text-eco-green" />
              <span>Covoiturage et autopartage</span>
            </h3>
            <p className="text-sm text-gray-600">
              Points de rendez-vous covoiturage, stations d'autopartage, véhicules disponibles.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <MapPin className="h-5 w-5 text-eco-green" />
              <span>Points d'intérêt écologiques</span>
            </h3>
            <p className="text-sm text-gray-600">
              Espaces verts, marchés bio, commerces responsables, initiatives locales.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Leaf className="h-5 w-5 text-eco-green" />
              <span>Impact environnemental</span>
            </h3>
            <p className="text-sm text-gray-600">
              Visualisez l'impact CO2 des différents modes de transport et options d'itinéraire.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapView;
