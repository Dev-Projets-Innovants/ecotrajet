
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff, Route, Bike, Zap, Car, Navigation } from 'lucide-react';

interface RouteFormProps {
  selectedTransportType: string | null;
  setSelectedTransportType: (type: string) => void;
}

const RouteForm = ({ selectedTransportType, setSelectedTransportType }: RouteFormProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Point de départ" 
        />
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPinOff className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Destination" 
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-3">Mode de transport</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant={selectedTransportType === "walking" ? "default" : "outline"} 
            className="flex items-center justify-center gap-2"
            onClick={() => setSelectedTransportType("walking")}
          >
            <Route className="h-4 w-4" />
            <span>À pied</span>
          </Button>
          <Button 
            variant={selectedTransportType === "bike" ? "default" : "outline"} 
            className="flex items-center justify-center gap-2"
            onClick={() => setSelectedTransportType("bike")}
          >
            <Bike className="h-4 w-4" />
            <span>Vélo</span>
          </Button>
          <Button 
            variant={selectedTransportType === "public" ? "default" : "outline"} 
            className="flex items-center justify-center gap-2"
            onClick={() => setSelectedTransportType("public")}
          >
            <Zap className="h-4 w-4" />
            <span>Transport</span>
          </Button>
          <Button 
            variant={selectedTransportType === "car" ? "default" : "outline"} 
            className="flex items-center justify-center gap-2"
            onClick={() => setSelectedTransportType("car")}
          >
            <Car className="h-4 w-4" />
            <span>Voiture</span>
          </Button>
        </div>
      </div>
      
      <Button className="w-full bg-eco-green hover:bg-eco-dark-green">
        <Navigation className="h-4 w-4 mr-2" />
        Calculer l'itinéraire
      </Button>
      
      <div className="p-4 bg-white rounded-lg border space-y-3">
        <div className="font-medium">Résultats de la recherche</div>
        <div className="text-sm text-gray-500">
          Entrez un point de départ et une destination pour voir les options d'itinéraires écologiques
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
