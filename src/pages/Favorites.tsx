
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bike, Clock } from 'lucide-react';
import { getFavoriteStations, removeFavoriteStation, UserFavoriteStation } from '@/services/velibFavoritesService';
import { VelibStationWithAvailability, getStationByCode } from '@/services/velibStationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface FavoriteStationWithDetails extends UserFavoriteStation {
  stationDetails?: VelibStationWithAvailability;
  loading?: boolean;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteStationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadFavorites = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        await loadFavorites();
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadFavorites();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          setFavorites([]);
        } else {
          setIsAuthenticated(true);
          loadFavorites();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteStations = await getFavoriteStations();
      const favoritesWithDetails: FavoriteStationWithDetails[] = favoriteStations.map(fav => ({
        ...fav,
        loading: true
      }));
      
      setFavorites(favoritesWithDetails);

      // Load station details for each favorite
      for (let i = 0; i < favoriteStations.length; i++) {
        const favorite = favoriteStations[i];
        try {
          const stationDetails = await getStationByCode(favorite.stationcode);
          setFavorites(prev => prev.map(fav => 
            fav.id === favorite.id 
              ? { ...fav, stationDetails, loading: false }
              : fav
          ));
        } catch (error) {
          console.error(`Error loading details for station ${favorite.stationcode}:`, error);
          setFavorites(prev => prev.map(fav => 
            fav.id === favorite.id 
              ? { ...fav, loading: false }
              : fav
          ));
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos stations favorites.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFavorite = async (stationcode: string) => {
    const success = await removeFavoriteStation(stationcode);
    if (success) {
      setFavorites(prev => prev.filter(fav => fav.stationcode !== stationcode));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes stations favorites</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Mes stations favorites</h1>
        <p className="text-gray-600 mb-8">
          Vous devez être connecté pour voir vos stations favorites.
        </p>
        <Button onClick={() => navigate('/signin')}>
          Se connecter
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Mes stations favorites</h1>
        <div className="flex flex-col items-center space-y-4">
          <Heart className="h-16 w-16 text-gray-300" />
          <p className="text-gray-600 text-lg">
            Vous n'avez pas encore de stations favorites.
          </p>
          <p className="text-gray-500">
            Ajoutez des stations à vos favoris en cliquant sur le cœur dans les détails d'une station.
          </p>
          <Button onClick={() => navigate('/map')}>
            Explorer les stations Vélib'
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes stations favorites</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {favorite.stationDetails?.name || `Station ${favorite.stationcode}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFavorite(favorite.stationcode)}
                className="text-red-500 hover:text-red-700"
              >
                <Heart className="h-5 w-5 fill-current" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {favorite.loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : favorite.stationDetails ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{favorite.stationDetails.nom_arrondissement_communes}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bike className="h-4 w-4 text-eco-green" />
                      <span>{favorite.stationDetails.numbikesavailable || 0} vélos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <span>{favorite.stationDetails.numdocksavailable || 0} places</span>
                    </div>
                  </div>

                  {favorite.stationDetails.ebike > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Bike className="h-4 w-4" />
                      <span>{favorite.stationDetails.ebike} vélos électriques</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>
                      Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/map?station=${favorite.stationcode}`)}
                  >
                    Voir sur la carte
                  </Button>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Station non trouvée
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
