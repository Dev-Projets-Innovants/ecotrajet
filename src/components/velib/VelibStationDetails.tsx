import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, Bell, Bike, ParkingCircle, Zap, AlertCircle, Mail, TestTube } from 'lucide-react';
import { 
  VelibStationWithAvailability,
  createUserAlert,
  addFavoriteStation,
  removeFavoriteStation,
  getFavoriteStations,
  subscribeToStationUpdates,
  sendTestAlert
} from '@/services/supabaseVelibService';
import { toast } from '@/components/ui/use-toast';

interface VelibStationDetailsProps {
  station: VelibStationWithAvailability;
}

const VelibStationDetails: React.FC<VelibStationDetailsProps> = ({ station }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(1);
  const [alertType, setAlertType] = useState<'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes'>('bikes_available');
  const [userEmail, setUserEmail] = useState('');
  const [notificationFrequency, setNotificationFrequency] = useState<'immediate' | 'hourly' | 'daily'>('immediate');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authenticated);
    };
    checkAuth();

    if (isAuthenticated) {
      checkIfFavorite();
    }

    const subscription = subscribeToStationUpdates(station.stationcode, (payload) => {
      console.log('Station update received:', payload);
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
    if (!userEmail.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email pour recevoir les notifications.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail.includes('@')) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    const success = await createUserAlert(
      station.stationcode, 
      alertType, 
      alertThreshold,
      userEmail,
      notificationFrequency
    );
    
    if (success) {
      setAlertThreshold(1);
      setUserEmail('');
    }
  };

  const handleSendTestAlert = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email pour le test.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      await sendTestAlert(station.stationcode, userEmail, alertType, alertThreshold);
    } finally {
      setIsSendingTest(false);
    }
  };

  const getStatusColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'Vélos disponibles';
      case 'docks_available': return 'Places libres';
      case 'ebikes_available': return 'Vélos électriques';
      case 'mechanical_bikes': return 'Vélos mécaniques';
      default: return type;
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'immediate': return 'Immédiat';
      case 'hourly': return 'Toutes les heures';
      case 'daily': return 'Une fois par jour';
      default: return freq;
    }
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

        {/* Informations complémentaires avec vélos mécaniques */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Vélos mécaniques: {station.mechanical || 0}</div>
          <div>Capacité totale: {station.capacity} emplacements</div>
          {station.nom_arrondissement_communes && (
            <div>Secteur: {station.nom_arrondissement_communes}</div>
          )}
          {station.last_updated && (
            <div>Mis à jour: {new Date(station.last_updated).toLocaleTimeString()}</div>
          )}
        </div>

        {/* Statut de la station */}
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${station.is_installed ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>
            {station.is_installed ? 'Station active' : 'Station hors service'}
          </span>
        </div>

        {/* Section création d'alerte par email */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Alerte par email</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-xs text-gray-600">Votre email</Label>
              <div className="flex items-center space-x-1 mt-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600">Type d'alerte</Label>
              <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bikes_available">Vélos disponibles</SelectItem>
                  <SelectItem value="mechanical_bikes">Vélos mécaniques</SelectItem>
                  <SelectItem value="ebikes_available">Vélos électriques</SelectItem>
                  <SelectItem value="docks_available">Places libres</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Seuil</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Fréquence</Label>
                <Select value={notificationFrequency} onValueChange={(value: any) => setNotificationFrequency(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immédiat</SelectItem>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Une fois par jour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleCreateAlert} size="sm" className="flex-1">
                <Bell className="h-4 w-4 mr-2" />
                Créer l'alerte
              </Button>
              <Button 
                onClick={handleSendTestAlert} 
                disabled={isSendingTest}
                variant="outline" 
                size="sm"
              >
                <TestTube className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              💡 Vous recevrez un email quand il y aura au moins {alertThreshold} {getAlertTypeLabel(alertType).toLowerCase()} disponible(s).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VelibStationDetails;
