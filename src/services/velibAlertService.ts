
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./auth/authService";
import { toast } from "@/components/ui/use-toast";

export interface VelibAlert {
  id: string;
  user_id: string;
  stationcode: string;
  alert_type: 'bikes_available' | 'docks_available';
  threshold: number;
  is_active: boolean;
  created_at: string;
  email?: string;
}

export interface VelibNotificationHistory {
  id: string;
  alert_id: string;
  sent_at: string;
  notification_type: string;
  message: string;
}

export const createVelibAlert = async (
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available',
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
      .from('velib_alerts')
      .insert({
        user_id: userId,
        stationcode,
        alert_type: alertType,
        threshold,
        email: email || null,
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

export const getUserVelibAlerts = async (): Promise<VelibAlert[]> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('velib_alerts')
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
      .from('velib_alerts')
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
      .from('velib_alerts')
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
      .from('velib_notification_history')
      .select(`
        *,
        velib_alerts!inner(user_id)
      `)
      .eq('velib_alerts.user_id', userId)
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
