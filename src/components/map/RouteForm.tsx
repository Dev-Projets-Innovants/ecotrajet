
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff, Navigation, Bike } from 'lucide-react';
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

  // Définir automatiquement le mode vélo
  React.useEffect(() => {
    if (!selectedTransportType) {
      setSelectedTransportType("bike");
    }
  }, [selectedTransportType, setSelectedTransportType]);

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

    setIsCalculating(true);
    try {
      const start: RouteCoordinate = { lat: startAddress.lat, lng: startAddress.lng };
      const end: RouteCoordinate = { lat: endAddress.lat, lng: endAddress.lng };
      
      // Utiliser uniquement le profil vélo
      const route = await calculateRoute(start, end, { profile: 'cycling-regular' });
      
      setCalculatedRoute(route);
      
      toast({
        title: "Itinéraire vélo calculé ✅",
        description: `Distance: ${(route.distance / 1000).toFixed(1)} km • Durée: ${Math.ceil(route.duration / 60)} min`,
      });
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer l'itinéraire vélo. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-4">
      <AddressInput
        placeholder="Point de départ (ex: Place de la République)"
        icon={<MapPin className="h-5 w-5 text-gray-400" />}
        onAddressSelect={handleStartAddressSelect}
        onCurrentLocation={() => {}}
        value={startAddress?.display_name || ''}
      />
      
      <AddressInput
        placeholder="Destination (ex: Tour Eiffel)"
        icon={<MapPinOff className="h-5 w-5 text-gray-400" />}
        onAddressSelect={handleEndAddressSelect}
        value={endAddress?.display_name || ''}
      />
      
      <div className="bg-white p-4 rounded-lg border border-eco-green/20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Bike className="h-6 w-6 text-eco-green" />
          <h3 className="font-medium text-eco-green">Mode de transport : Vélo</h3>
        </div>
        <div className="text-center">
          <Button 
            variant="default"
            className="bg-eco-green hover:bg-eco-dark-green text-white px-8 py-2"
            disabled
          >
            <Bike className="h-4 w-4 mr-2" />
            <span>Vélo sélectionné</span>
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Mode optimisé pour les trajets écologiques et la santé
          </p>
        </div>
      </div>
      
      <Button 
        className="w-full bg-eco-green hover:bg-eco-dark-green text-white py-3"
        onClick={handleCalculateRoute}
        disabled={isCalculating || !startAddress || !endAddress}
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isCalculating ? 'Calcul de l\'itinéraire vélo...' : 'Calculer l\'itinéraire vélo'}
      </Button>
      
      <RouteResults 
        route={calculatedRoute}
        isLoading={isCalculating}
        transportMode="bike"
      />
    </div>
  );
};

export default RouteForm;
