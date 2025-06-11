
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface VelibStationWithAvailability {
  stationcode: string;
  name: string;
  coordonnees_geo_lat: number;
  coordonnees_geo_lon: number;
  capacity: number;
  nom_arrondissement_communes: string | null;
  code_insee_commune: string | null;
  station_opening_hours: string | null;
  // Données de disponibilité les plus récentes
  numbikesavailable?: number;
  numdocksavailable?: number;
  mechanical?: number;
  ebike?: number;
  is_renting?: boolean;
  is_returning?: boolean;
  is_installed?: boolean;
  last_updated?: string;
}

export interface UserAlert {
  id: string;
  stationcode: string;
  alert_type: 'bikes_available' | 'docks_available' | 'ebikes_available';
  threshold: number;
  is_active: boolean | null;
  created_at: string | null;
  user_email?: string | null;
  notification_frequency?: 'immediate' | 'hourly' | 'daily' | null;
  last_notification_sent?: string | null;
}

export interface UserFavoriteStation {
  id: string;
  stationcode: string;
  created_at: string;
}

export interface AlertNotificationHistory {
  id: string;
  alert_id: string | null;
  sent_at: string | null;
  email: string;
  station_name: string | null;
  alert_type: string | null;
  threshold: number | null;
  current_value: number | null;
  email_status: 'sent' | 'failed' | 'pending' | null;
}

/**
 * Récupère toutes les stations avec leur disponibilité la plus récente
 */
export async function getStationsWithAvailability(options?: {
  limit?: number;
  geoFilter?: { lat: number; lng: number; distance: number };
}): Promise<VelibStationWithAvailability[]> {
  try {
    let query = supabase
      .from('velib_stations')
      .select(`
        *,
        velib_availability_history!inner (
          numbikesavailable,
          numdocksavailable,
          mechanical,
          ebike,
          is_renting,
          is_returning,
          is_installed,
          timestamp
        )
      `)
      .order('timestamp', { foreignTable: 'velib_availability_history', ascending: false })
      .limit(1, { foreignTable: 'velib_availability_history' });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les stations Vélib'.",
        variant: "destructive",
      });
      return [];
    }

    return data?.map(station => ({
      stationcode: station.stationcode,
      name: station.name,
      coordonnees_geo_lat: station.coordonnees_geo_lat,
      coordonnees_geo_lon: station.coordonnees_geo_lon,
      capacity: station.capacity,
      nom_arrondissement_communes: station.nom_arrondissement_communes,
      code_insee_commune: station.code_insee_commune,
      station_opening_hours: station.station_opening_hours,
      numbikesavailable: station.velib_availability_history[0]?.numbikesavailable || 0,
      numdocksavailable: station.velib_availability_history[0]?.numdocksavailable || 0,
      mechanical: station.velib_availability_history[0]?.mechanical || 0,
      ebike: station.velib_availability_history[0]?.ebike || 0,
      is_renting: station.velib_availability_history[0]?.is_renting || false,
      is_returning: station.velib_availability_history[0]?.is_returning || false,
      is_installed: station.velib_availability_history[0]?.is_installed || false,
      last_updated: station.velib_availability_history[0]?.timestamp,
    })) || [];
  } catch (error) {
    console.error('Unexpected error fetching stations:', error);
    return [];
  }
}

/**
 * Déclenche la synchronisation des données Vélib'
 */
export async function triggerVelibSync(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-velib-data');
    
    if (error) {
      console.error('Error triggering sync:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser les données Vélib'.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Synchronisation réussie",
      description: `${data.stations_synced || 'Toutes les'} stations ont été mises à jour.`,
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error triggering sync:', error);
    return false;
  }
}

/**
 * Gestion des alertes utilisateur
 */
export async function createUserAlert(
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available',
  threshold: number,
  userEmail?: string,
  notificationFrequency: 'immediate' | 'hourly' | 'daily' = 'immediate'
): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_alerts')
      .insert({
        user_id: user.id, // Ajouter l'ID de l'utilisateur authentifié
        stationcode,
        alert_type: alertType,
        threshold,
        user_email: userEmail,
        notification_frequency: notificationFrequency,
        is_active: true
      });

    if (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Alerte créée",
      description: userEmail 
        ? "Vous serez notifié par email quand les conditions seront remplies."
        : "Alerte créée avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error creating alert:', error);
    return false;
  }
}

export async function getUserAlerts(): Promise<UserAlert[]> {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('user_id', user.id) // Filtrer par l'ID de l'utilisateur
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return (data || []).map(alert => ({
      ...alert,
      alert_type: alert.alert_type as 'bikes_available' | 'docks_available' | 'ebikes_available',
      notification_frequency: alert.notification_frequency as 'immediate' | 'hourly' | 'daily' | null
    }));
  } catch (error) {
    console.error('Unexpected error fetching alerts:', error);
    return [];
  }
}

export async function deleteUserAlert(alertId: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour supprimer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', user.id); // S'assurer que l'utilisateur ne peut supprimer que ses propres alertes

    if (error) {
      console.error('Error deleting alert:', error);
      return false;
    }

    toast({
      title: "Alerte supprimée",
      description: "L'alerte a été supprimée avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting alert:', error);
    return false;
  }
}

/**
 * Récupère l'historique des notifications pour un utilisateur
 */
export async function getAlertNotificationHistory(): Promise<AlertNotificationHistory[]> {
  try {
    const { data, error } = await supabase
      .from('alert_notifications_history')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }

    return (data || []).map(notification => ({
      ...notification,
      email_status: notification.email_status as 'sent' | 'failed' | 'pending' | null
    }));
  } catch (error) {
    console.error('Unexpected error fetching notification history:', error);
    return [];
  }
}

/**
 * Envoie un email de test pour une alerte
 */
export async function sendTestAlert(
  stationcode: string,
  email: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available',
  threshold: number
): Promise<boolean> {
  try {
    // Récupérer les informations de la station
    const { data: stationData, error: stationError } = await supabase
      .from('velib_stations')
      .select('name')
      .eq('stationcode', stationcode)
      .single();

    if (stationError || !stationData) {
      toast({
        title: "Erreur",
        description: "Station introuvable.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase.functions.invoke('send-velib-alert', {
      body: {
        email,
        stationName: stationData.name,
        stationCode: stationcode,
        alertType,
        threshold,
        currentValue: threshold + 1, // Valeur de test
        alertId: 'test-' + Date.now()
      }
    });

    if (error) {
      console.error('Error sending test alert:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email de test.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Email de test envoyé",
      description: "Vérifiez votre boîte de réception.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error sending test alert:', error);
    return false;
  }
}

/**
 * Gestion des stations favorites
 */
export async function addFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des favoris.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_favorite_stations')
      .insert({ 
        user_id: user.id, // Ajouter l'ID de l'utilisateur authentifié
        stationcode 
      });

    if (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter cette station aux favoris.",
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
    return false;
  }
}

export async function removeFavoriteStation(stationcode: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
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
      .eq('stationcode', stationcode)
      .eq('user_id', user.id); // S'assurer que l'utilisateur ne peut supprimer que ses propres favoris

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('user_favorite_stations')
      .select('*')
      .eq('user_id', user.id) // Filtrer par l'ID de l'utilisateur
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching favorites:', error);
    return [];
  }
}

/**
 * Subscription aux mises à jour en temps réel
 */
export function subscribeToStationUpdates(
  stationcode: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`station-${stationcode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'velib_availability_history',
        filter: `stationcode=eq.${stationcode}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToUserAlerts(callback: (payload: any) => void) {
  return supabase
    .channel('user-alerts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_alerts',
      },
      callback
    )
    .subscribe();
}
