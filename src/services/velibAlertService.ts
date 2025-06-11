import { toast } from "@/components/ui/use-toast";
import { UserAlert, AlertNotificationHistory } from "@/types/alerts";
import { isUserAuthenticated, getCurrentUserId, getCurrentUserEmail } from "./auth/mockAuthService";
import { 
  createAlertInDatabase, 
  fetchUserAlerts, 
  deactivateAlert, 
  fetchNotificationHistory,
  getStationName 
} from "./alerts/alertsRepository";
import { sendAlertEmail } from "./alerts/emailService";

// Re-export types for backward compatibility
export type { UserAlert, AlertNotificationHistory };

/**
 * Crée une nouvelle alerte utilisateur
 */
export async function createUserAlert(
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  userEmail?: string,
  notificationFrequency: 'immediate' | 'hourly' | 'daily' = 'immediate'
): Promise<boolean> {
  try {
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const mockUserId = getCurrentUserId();
    console.log('Creating alert for user:', mockUserId);
    
    await createAlertInDatabase(mockUserId, stationcode, alertType, threshold, userEmail, notificationFrequency);

    toast({
      title: "Alerte créée",
      description: userEmail 
        ? "Vous serez notifié par email quand les conditions seront remplies."
        : "Alerte créée avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Error creating alert:', error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible de créer l'alerte.",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Récupère les alertes de l'utilisateur
 */
export async function getUserAlerts(): Promise<UserAlert[]> {
  try {
    if (!isUserAuthenticated()) {
      console.log('User not authenticated via localStorage');
      return [];
    }

    const currentUserId = getCurrentUserId();
    return await fetchUserAlerts(currentUserId);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

/**
 * Supprime une alerte utilisateur
 */
export async function deleteUserAlert(alertId: string): Promise<boolean> {
  try {
    if (!isUserAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour supprimer une alerte.",
        variant: "destructive",
      });
      return false;
    }

    const currentUserId = getCurrentUserId();
    await deactivateAlert(alertId, currentUserId);

    toast({
      title: "Alerte supprimée",
      description: "L'alerte a été supprimée avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting alert:', error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer l'alerte.",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Récupère l'historique des notifications
 */
export async function getAlertNotificationHistory(): Promise<AlertNotificationHistory[]> {
  try {
    if (!isUserAuthenticated()) {
      return [];
    }

    const currentUserEmail = getCurrentUserEmail();
    if (!currentUserEmail) {
      return [];
    }

    return await fetchNotificationHistory(currentUserEmail);
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return [];
  }
}

/**
 * Envoie un email de test
 */
export async function sendTestAlert(
  stationcode: string,
  email: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number
): Promise<boolean> {
  try {
    const stationName = await getStationName(stationcode);
    await sendAlertEmail(email, stationName, stationcode, alertType, threshold, threshold + 1, 'test-' + Date.now());

    toast({
      title: "Email de test envoyé",
      description: "Vérifiez votre boîte de réception.",
    });
    
    return true;
  } catch (error) {
    console.error('Error sending test alert:', error);
    toast({
      title: "Erreur d'envoi",
      description: "Impossible d'envoyer l'email de test.",
      variant: "destructive",
    });
    return false;
  }
}
