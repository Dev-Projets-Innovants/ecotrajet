
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Bell, Bike, ParkingCircle, Zap, AlertCircle } from 'lucide-react';
import { 
  VelibStationWithAvailability,
  createUserAlert,
  addFavoriteStation,
  removeFavoriteStation,
  getFavoriteStations,
  subscribeToStationUpdates
} from '@/services/supabaseVelibService';
import { toast } from '@/components/ui/use-toast';

interface VelibStationDetailsProps {
  station: VelibStationWithAvailability;
}

const VelibStationDetails: React.FC<VelibStationDetailsProps> = ({ station }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(1);
  const [alertType, setAlertType] = useState<'bikes_available' | 'docks_available' | 'ebikes_available'>('bikes_available');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      const authenticated = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authenticated);
    };
    checkAuth();

    // Vérifier si la station est en favori
    if (isAuthenticated) {
      checkIfFavorite();
    }

    // S'abonner aux mises à jour en temps réel de cette station
    const subscription = subscribeToStationUpdates(station.stationcode, (payload) => {
      console.log('Station update received:', payload);
      // Ici on pourrait mettre à jour les données de la station en temps réel
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [station.stationcode, isAuthenticated]);

  const checkIfFavorite = async () => {
    try {
      const favorites = await getFavoriteStations();
      setIsFavorite(favorites.some(fav => fav.stationcode === station.stationcode));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour gérer vos favoris.",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      const success = await removeFavoriteStation(station.stationcode);
      if (success) setIsFavorite(false);
    } else {
      const success = await addFavoriteStation(station.stationcode);
      if (success) setIsFavorite(true);
    }
  };

  const handleCreateAlert = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer des alertes.",
        variant: "destructive",
      });
      return;
    }

    const success = await createUserAlert(station.stationcode, alertType, alertThreshold);
    if (success) {
      // Réinitialiser le formulaire
      setAlertThreshold(1);
    }
  };

  const getStatusColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{station.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={isFavorite ? 'text-red-500' : 'text-gray-400'}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de disponibilité */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Bike className={`h-5 w-5 mb-1 ${getStatusColor(station.numbikesavailable || 0, station.capacity)}`} />
            <span className="font-medium">{station.numbikesavailable || 0}</span>
            <span className="text-xs text-gray-500">Vélos</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Zap className={`h-5 w-5 mb-1 ${getStatusColor(station.ebike || 0, station.numbikesavailable || 0)}`} />
            <span className="font-medium">{station.ebike || 0}</span>
            <span className="text-xs text-gray-500">Électriques</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <ParkingCircle className={`h-5 w-5 mb-1 ${getStatusColor(station.numdocksavailable || 0, station.capacity)}`} />
            <span className="font-medium">{station.numdocksavailable || 0}</span>
            <span className="text-xs text-gray-500">Places</span>
          </div>
        </div>

        {/* Statut de la station */}
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${station.is_installed ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>
            {station.is_installed ? 'Station active' : 'Station hors service'}
          </span>
        </div>

        {/* Informations complémentaires */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Capacité totale: {station.capacity} emplacements</div>
          {station.nom_arrondissement_communes && (
            <div>Secteur: {station.nom_arrondissement_communes}</div>
          )}
          {station.last_updated && (
            <div>Mis à jour: {new Date(station.last_updated).toLocaleTimeString()}</div>
          )}
        </div>

        {/* Section création d'alerte */}
        {isAuthenticated && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Créer une alerte</span>
            </div>
            
            <div className="space-y-2">
              <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type d'alerte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bikes_available">Vélos disponibles</SelectItem>
                  <SelectItem value="ebikes_available">Vélos électriques</SelectItem>
                  <SelectItem value="docks_available">Places libres</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Seuil:</span>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
              
              <Button onClick={handleCreateAlert} size="sm" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Créer l'alerte
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VelibStationDetails;
