
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinOff, ExternalLink, Bike } from 'lucide-react';
import { GeocodingResult } from '@/services/routingService';
import { toast } from '@/components/ui/use-toast';
import AddressInput from '../route/AddressInput';

interface RouteFormProps {
  selectedTransportType: string | null;
  setSelectedTransportType: (type: string) => void;
}

const RouteForm = ({ selectedTransportType, setSelectedTransportType }: RouteFormProps) => {
  const [startAddress, setStartAddress] = useState<GeocodingResult | null>(null);
  const [endAddress, setEndAddress] = useState<GeocodingResult | null>(null);

  // Définir automatiquement le mode vélo
  React.useEffect(() => {
    if (!selectedTransportType) {
      setSelectedTransportType("bike");
    }
  }, [selectedTransportType, setSelectedTransportType]);

  const handleStartAddressSelect = (address: GeocodingResult) => {
    setStartAddress(address);
  };

  const handleEndAddressSelect = (address: GeocodingResult) => {
    setEndAddress(address);
  };

  const handleOpenGoogleMaps = () => {
    if (!startAddress || !endAddress) {
      toast({
        title: "Adresses manquantes",
        description: "Veuillez sélectionner un point de départ et une destination.",
        variant: "destructive",
      });
      return;
    }

    // Construire l'URL Google Maps avec le mode vélo
    const origin = `${startAddress.lat},${startAddress.lng}`;
    const destination = `${endAddress.lat},${endAddress.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}/@${startAddress.lat},${startAddress.lng},14z/data=!3m1!4b1!4m4!4m3!1m1!4e2!3e1`;
    
    // Ouvrir Google Maps dans un nouvel onglet
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: "Redirection vers Google Maps ✅",
      description: "L'itinéraire vélo s'ouvre dans un nouvel onglet.",
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-eco-dark-blue mb-2">
          Planificateur d'itinéraires vélo
        </h2>
        <p className="text-gray-600">
          Entrez vos points de départ et d'arrivée pour voir l'itinéraire vélo sur Google Maps
        </p>
      </div>

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
        
        {/* Section Transport Mode avec design moderne et image */}
        <div className="relative overflow-hidden bg-gradient-to-r from-eco-green/10 to-eco-blue/10 p-6 rounded-xl border border-eco-green/20">
          {/* Image de fond */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Vélib' Paris"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Contenu par-dessus l'image */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-eco-green p-2 rounded-full">
                  <Bike className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-eco-dark-blue text-lg">Mode de transport</h3>
                  <p className="text-sm text-gray-600">Mobilité écologique</p>
                </div>
              </div>
              <div className="bg-eco-green/10 px-3 py-1 rounded-full">
                <span className="text-eco-green font-medium text-sm">✓ Vélo sélectionné</span>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/50">
              <div className="flex items-center gap-3 mb-3">
                <Bike className="h-5 w-5 text-eco-green" />
                <span className="font-medium text-eco-dark-blue">Vélib' Paris</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Mode optimisé pour les trajets écologiques et la santé. 
                Profitez du réseau Vélib' avec plus de 1 400 stations dans Paris !
              </p>
              <div className="flex gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Zéro émission
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Exercice physique
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Économique
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-eco-green hover:bg-eco-dark-green text-white py-3 text-lg"
          onClick={handleOpenGoogleMaps}
          disabled={!startAddress || !endAddress}
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Voir l'itinéraire vélo sur Google Maps
        </Button>

        {startAddress && endAddress && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Aperçu du trajet :</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-eco-green mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  <strong>Départ :</strong> {startAddress.display_name}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinOff className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  <strong>Arrivée :</strong> {endAddress.display_name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteForm;
