
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

// Helper function to get user email from localStorage
const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};

/**
 * Gestion des alertes utilisateur avec Supabase
 */
export async function createUserAlert(
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  userEmail?: string,
  notificationFrequency: 'immediate' | 'hourly' | 'daily' = 'immediate'
): Promise<boolean> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const email = userEmail || getCurrentUserEmail();
    if (!email) {
      toast({
        title: "Email requis",
        description: "Une adresse email est nécessaire pour les alertes.",
        variant: "destructive",
      });
      return false;
    }

    // Créer l'alerte dans Supabase
    const { data, error } = await supabase
      .from('user_alerts')
      .insert({
        stationcode,
        alert_type: alertType,
        threshold,
        user_email: email,
        notification_frequency: notificationFrequency,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Alerte créée",
      description: "Vous serez notifié par email quand les conditions seront remplies.",
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error creating alert:', error);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
}

export async function getUserAlerts(): Promise<UserAlert[]> {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      console.log('User not authenticated');
      return [];
    }

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      console.log('No user email found');
      return [];
    }

    // Récupérer les alertes depuis Supabase basées sur l'email
    const { data, error } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('user_email', userEmail)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data || [];
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

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      toast({
        title: "Erreur",
        description: "Email utilisateur introuvable.",
        variant: "destructive",
      });
      return false;
    }

    // Supprimer l'alerte dans Supabase (seulement si elle appartient à l'utilisateur)
    const { error } = await supabase
      .from('user_alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte.",
        variant: "destructive",
      });
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
    // Vérifier que l'utilisateur est authentifié
    if (!isUserAuthenticated()) {
      return [];
    }

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      return [];
    }

    // Récupérer l'historique depuis Supabase
    const { data, error } = await supabase
      .from('alert_notifications_history')
      .select('*')
      .eq('email', userEmail)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }

    return data || [];
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

    // Appeler l'edge function pour envoyer l'email
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
        description: "Impossible d'envoyer l'email de test. Vérifiez la configuration.",
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
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
}
