
import { toast } from "@/components/ui/use-toast";

export interface UserFavoriteStation {
  id: string;
  stationcode: string;
  created_at: string;
}

// Helper function to check if user is authenticated using the local storage method
const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Helper function to get a mock user ID for the current session
const getCurrentUserId = (): string => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    // Generate a consistent mock user ID based on session
    return 'mock-user-' + Math.random().toString(36).substring(2, 15);
  }
  // Use email as basis for consistent mock user ID
  return 'user-' + btoa(userEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
};

/**
 * Gestion des stations favorites
 */
export async function addFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des favoris.",
        variant: "destructive",
      });
      return false;
    }

    const currentUserId = getCurrentUserId();
    const favorite = {
      id: 'fav-' + Date.now(),
      user_id: currentUserId,
      stationcode,
      created_at: new Date().toISOString()
    };

    // Stocker dans localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    
    // Vérifier si pas déjà en favoris
    const alreadyExists = existingFavorites.some((fav: any) => 
      fav.stationcode === stationcode && fav.user_id === currentUserId
    );

    if (alreadyExists) {
      toast({
        title: "Déjà en favoris",
        description: "Cette station est déjà dans vos favoris.",
      });
      return true;
    }

    existingFavorites.push(favorite);
    localStorage.setItem('userFavorites', JSON.stringify(existingFavorites));

    toast({
      title: "Favori ajouté",
      description: "Station ajoutée à vos favoris.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error adding favorite:', error);
    return false;
  }
}

export async function removeFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour gérer vos favoris.",
        variant: "destructive",
      });
      return false;
    }

    const currentUserId = getCurrentUserId();
    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    const updatedFavorites = favorites.filter((fav: any) => 
      !(fav.stationcode === stationcode && fav.user_id === currentUserId)
    );
    
    localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));

    toast({
      title: "Favori supprimé",
      description: "Station supprimée de vos favoris.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error removing favorite:', error);
    return false;
  }
}

export async function getFavoriteStations(): Promise<UserFavoriteStation[]> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      console.log('User not authenticated via localStorage');
      return [];
    }

    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
    const currentUserId = getCurrentUserId();
    
    // Filtrer par utilisateur actuel
    return favorites.filter((fav: any) => fav.user_id === currentUserId);
  } catch (error) {
    console.error('Unexpected error fetching favorites:', error);
    return [];
  }
}
