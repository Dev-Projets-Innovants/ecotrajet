
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  VelibStationWithAvailability
} from '@/services/velibStationService';
import {
  addFavoriteStation,
  removeFavoriteStation,
  getFavoriteStations
} from '@/services/velibFavoritesService';
import { subscribeToStationUpdates } from '@/services/velibRealtimeService';
import { toast } from '@/components/ui/use-toast';
import VelibStationHeader from './VelibStationHeader';
import VelibStationAvailability from './VelibStationAvailability';
import VelibStationInfo from './VelibStationInfo';
import VelibStationStatus from './VelibStationStatus';
import VelibStationAlertForm from './VelibStationAlertForm';

interface VelibStationDetailsProps {
  station: VelibStationWithAvailability;
}

const VelibStationDetails: React.FC<VelibStationDetailsProps> = ({ station }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <Card className="w-full max-w-md">
      <VelibStationHeader
        stationName={station.name}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      
      <CardContent className="space-y-4">
        <VelibStationAvailability
          numbikesavailable={station.numbikesavailable || 0}
          ebike={station.ebike || 0}
          numdocksavailable={station.numdocksavailable || 0}
          capacity={station.capacity}
        />

        <VelibStationInfo
          mechanical={station.mechanical || 0}
          capacity={station.capacity}
          nom_arrondissement_communes={station.nom_arrondissement_communes}
          last_updated={station.last_updated}
        />

        <VelibStationStatus is_installed={station.is_installed || false} />

        <VelibStationAlertForm stationcode={station.stationcode} />
      </CardContent>
    </Card>
  );
};

export default VelibStationDetails;
