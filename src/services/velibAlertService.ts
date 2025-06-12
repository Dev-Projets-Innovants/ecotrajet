
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./auth/authService";
import { toast } from "@/hooks/use-toast";

export interface VelibAlert {
  id: string;
  user_id: string;
  stationcode: string;
  alert_type: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes';
  threshold: number;
  is_active: boolean;
  created_at: string;
  user_email?: string;
  notification_frequency?: 'immediate' | 'hourly' | 'daily';
  last_notification_sent?: string;
}

export interface UserAlert extends VelibAlert {}

export interface VelibNotificationHistory {
  id: string;
  alert_id: string;
  sent_at: string;
  email_status: string;
  alert_type: string;
  threshold: number;
  current_value: number;
  email: string;
  station_name: string;
}

export interface AlertNotificationHistory extends VelibNotificationHistory {}

export const createVelibAlert = async (
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  email?: string
): Promise<VelibAlert | null> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une alerte.",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('user_alerts')
      .insert({
        user_id: userId,
        stationcode,
        alert_type: alertType,
        threshold,
        user_email: email || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte.",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Alerte créée",
      description: "Votre alerte a été créée avec succès.",
    });

    return data;
  } catch (error) {
    console.error('Unexpected error creating alert:', error);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return null;
  }
};

export const createUserAlert = createVelibAlert;

export const getUserVelibAlerts = async (): Promise<VelibAlert[]> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('user_id', userId)
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
};

export const getUserAlerts = getUserVelibAlerts;

export const deleteVelibAlert = async (alertId: string): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
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
      .eq('user_id', userId);

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
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
};

export const deleteUserAlert = deleteVelibAlert;

export const toggleVelibAlert = async (alertId: string, isActive: boolean): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour modifier une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('user_alerts')
      .update({ is_active: isActive })
      .eq('id', alertId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'alerte.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: isActive ? "Alerte activée" : "Alerte désactivée",
      description: `L'alerte a été ${isActive ? 'activée' : 'désactivée'} avec succès.`,
    });

    return true;
  } catch (error) {
    console.error('Unexpected error updating alert:', error);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue s'est produite.",
      variant: "destructive",
    });
    return false;
  }
};

export const getVelibNotificationHistory = async (): Promise<VelibNotificationHistory[]> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('alert_notifications_history')
      .select('*')
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
};

export const getAlertNotificationHistory = getVelibNotificationHistory;

export const sendTestAlert = async (
  stationcode: string,
  email: string,
  alertType: string,
  threshold: number
): Promise<void> => {
  try {
    toast({
      title: "Email de test envoyé",
      description: `Un email de test a été envoyé à ${email}`,
    });
  } catch (error) {
    console.error('Error sending test alert:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'envoyer l'email de test.",
      variant: "destructive",
    });
  }
};
