
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUserId } from "./auth/authService";

export interface UserFavoriteStation {
  id: string;
  stationcode: string;
  created_at: string;
  user_id?: string;
}

/**
 * Gestion des stations favorites avec Supabase
 */
export async function addFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des favoris.",
        variant: "destructive",
      });
      return false;
    }

    // Vérifier si pas déjà en favoris
    const { data: existingFavorite } = await supabase
      .from('user_favorite_stations')
      .select('id')
      .eq('user_id', userId)
      .eq('stationcode', stationcode)
      .single();

    if (existingFavorite) {
      toast({
        title: "Déjà en favoris",
        description: "Cette station est déjà dans vos favoris.",
      });
      return true;
    }

    // Ajouter aux favoris
    const { error } = await supabase
      .from('user_favorite_stations')
      .insert({
        user_id: userId,
        stationcode: stationcode
      });

    if (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la station aux favoris.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Favori ajouté",
      description: "Station ajoutée à vos favoris.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error adding favorite:', error);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
}

export async function removeFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour gérer vos favoris.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_favorite_stations')
      .delete()
      .eq('user_id', userId)
      .eq('stationcode', stationcode);

    if (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la station des favoris.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Favori supprimé",
      description: "Station supprimée de vos favoris.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error removing favorite:', error);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
}

export async function getFavoriteStations(): Promise<UserFavoriteStation[]> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.log('User not authenticated');
      return [];
    }

    const { data: favorites, error } = await supabase
      .from('user_favorite_stations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return favorites || [];
  } catch (error) {
    console.error('Unexpected error fetching favorites:', error);
    return [];
  }
}

export async function isFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return false;
    }

    const { data: favorite } = await supabase
      .from('user_favorite_stations')
      .select('id')
      .eq('user_id', userId)
      .eq('stationcode', stationcode)
      .single();

    return !!favorite;
  } catch (error) {
    console.error('Error checking if station is favorite:', error);
    return false;
  }
}
