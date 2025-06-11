
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface UserAlert {
  id: string;
  stationcode: string;
  alert_type: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes';
  threshold: number;
  is_active: boolean | null;
  created_at: string | null;
  user_email?: string | null;
  notification_frequency?: 'immediate' | 'hourly' | 'daily' | null;
  last_notification_sent?: string | null;
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
 * Gestion des alertes utilisateur
 */
export async function createUserAlert(
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  userEmail?: string,
  notificationFrequency: 'immediate' | 'hourly' | 'daily' = 'immediate'
): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié avec notre système local
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const mockUserId = getCurrentUserId();

    // Pour le moment, on stocke les alertes localement en attendant l'implémentation complète
    // Dans une vraie application, ces données iraient dans Supabase avec l'authentification appropriée
    const alert = {
      id: 'alert-' + Date.now(),
      user_id: mockUserId,
      stationcode,
      alert_type: alertType,
      threshold,
      user_email: userEmail,
      notification_frequency: notificationFrequency,
      is_active: true,
      created_at: new Date().toISOString()
    };

    // Stocker temporairement dans localStorage
    const existingAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
    existingAlerts.push(alert);
    localStorage.setItem('userAlerts', JSON.stringify(existingAlerts));

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
    if (!isUserAuthenticated()) {
      console.log('User not authenticated via localStorage');
      return [];
    }

    // Récupérer les alertes depuis localStorage pour le moment
    const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
    const currentUserId = getCurrentUserId();
    
    // Filtrer par utilisateur actuel
    return alerts.filter((alert: any) => alert.user_id === currentUserId);
  } catch (error) {
    console.error('Unexpected error fetching alerts:', error);
    return [];
  }
}

export async function deleteUserAlert(alertId: string): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour supprimer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    // Supprimer de localStorage
    const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
    const currentUserId = getCurrentUserId();
    const updatedAlerts = alerts.filter((alert: any) => 
      !(alert.id === alertId && alert.user_id === currentUserId)
    );
    
    localStorage.setItem('userAlerts', JSON.stringify(updatedAlerts));

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
    // Pour le moment, retourner un historique vide ou simulé
    const mockHistory = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
    return mockHistory;
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
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
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
