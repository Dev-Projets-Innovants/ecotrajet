
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff, Route, Bike, Zap, Car, Navigation } from 'lucide-react';
import { 
  calculateRoute, 
  GeocodingResult, 
  Route as RouteType, 
  RouteCoordinate 
} from '@/services/routingService';
import { toast } from '@/components/ui/use-toast';
import AddressInput from '../route/AddressInput';
import RouteResults from '../route/RouteResults';

interface RouteFormProps {
  selectedTransportType: string | null;
  setSelectedTransportType: (type: string) => void;
}

const RouteForm = ({ selectedTransportType, setSelectedTransportType }: RouteFormProps) => {
  const [startAddress, setStartAddress] = useState<GeocodingResult | null>(null);
  const [endAddress, setEndAddress] = useState<GeocodingResult | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleStartAddressSelect = (address: GeocodingResult) => {
    setStartAddress(address);
    // Reset route if both addresses are selected
    if (endAddress) {
      setCalculatedRoute(null);
    }
  };

  const handleEndAddressSelect = (address: GeocodingResult) => {
    setEndAddress(address);
    // Reset route if both addresses are selected
    if (startAddress) {
      setCalculatedRoute(null);
    }
  };

  const handleCalculateRoute = async () => {
    if (!startAddress || !endAddress) {
      toast({
        title: "Adresses manquantes",
        description: "Veuillez sélectionner un point de départ et une destination.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTransportType) {
      toast({
        title: "Mode de transport manquant",
        description: "Veuillez sélectionner un mode de transport.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      const start: RouteCoordinate = { lat: startAddress.lat, lng: startAddress.lng };
      const end: RouteCoordinate = { lat: endAddress.lat, lng: endAddress.lng };
      
      // Map transport types to routing profiles
      const profileMap: { [key: string]: 'driving-car' | 'cycling-regular' | 'foot-walking' } = {
        walking: 'foot-walking',
        bike: 'cycling-regular',
        public: 'foot-walking', // Pour les transports publics, on utilise la marche comme approximation
        car: 'driving-car'
      };

      const profile = profileMap[selectedTransportType] || 'foot-walking';
      const route = await calculateRoute(start, end, { profile });
      
      setCalculatedRoute(route);
      
      toast({
        title: "Itinéraire calculé",
        description: `Distance: ${(route.distance / 1000).toFixed(1)} km • Durée: ${Math.ceil(route.duration / 60)} min`,
      });
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer l'itinéraire. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-4">
      <AddressInput
        placeholder="Point de départ"
        icon={<MapPin className="h-5 w-5 text-gray-400" />}
        onAddressSelect={handleStartAddressSelect}
        onCurrentLocation={() => {}}
        value={startAddress?.display_name || ''}
      />
      
      <AddressInput
        placeholder="Destination"
        icon={<MapPinOff className="h-5 w-5 text-gray-400" />}
        onAddressSelect={handleEndAddressSelect}
        value={endAddress?.display_name || ''}
      />
      
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
      
      <Button 
        className="w-full bg-eco-green hover:bg-eco-dark-green"
        onClick={handleCalculateRoute}
        disabled={isCalculating || !startAddress || !endAddress || !selectedTransportType}
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isCalculating ? 'Calcul...' : 'Calculer l\'itinéraire'}
      </Button>
      
      <RouteResults 
        route={calculatedRoute}
        isLoading={isCalculating}
        transportMode={selectedTransportType || 'walking'}
      />
    </div>
  );
};

export default RouteForm;
