
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  VelibStationWithAvailability
} from '@/services/velibStationService';
import {
  addFavoriteStation,
  removeFavoriteStation,
  isFavoriteStation
} from '@/services/velibFavoritesService';
import { subscribeToStationUpdates } from '@/services/velibRealtimeService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFavorite = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const favorite = await isFavoriteStation(station.stationcode);
          setIsFavorite(favorite);
        }
      } catch (error) {
        console.error('Error checking auth and favorite status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFavorite();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (!session) {
          setIsFavorite(false);
        } else {
          // Recheck favorite status when user signs in
          isFavoriteStation(station.stationcode).then(setIsFavorite);
        }
      }
    );

    const stationSubscription = subscribeToStationUpdates(station.stationcode, (payload) => {
      console.log('Station update received:', payload);
    });

    return () => {
      subscription.unsubscribe();
      if (stationSubscription) {
        stationSubscription.unsubscribe();
      }
    };
  }, [station.stationcode]);

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

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

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
