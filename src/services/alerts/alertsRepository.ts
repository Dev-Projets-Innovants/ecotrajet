
import { supabase } from "@/integrations/supabase/client";
import { UserAlert, AlertNotificationHistory } from "@/types/alerts";

export async function createAlertInDatabase(
  userIdentifier: string,
  stationcode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  userEmail?: string,
  notificationFrequency: 'immediate' | 'hourly' | 'daily' = 'immediate'
) {
  console.log('Creating alert with data:', {
    userIdentifier,
    stationcode,
    alertType,
    threshold,
    userEmail,
    notificationFrequency
  });

  const { data, error } = await supabase
    .from('user_alerts')
    .insert({
      user_identifier: userIdentifier,
      stationcode,
      alert_type: alertType,
      threshold,
      user_email: userEmail,
      notification_frequency: notificationFrequency,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Database error details:', error);
    throw new Error(`Error creating alert: ${error.message} (Code: ${error.code})`);
  }

  console.log('Alert created successfully:', data);
  return data;
}

export async function fetchUserAlerts(userIdentifier: string): Promise<UserAlert[]> {
  const { data, error } = await supabase
    .from('user_alerts')
    .select('*')
    .eq('user_identifier', userIdentifier)
    .eq('is_active', true);

  if (error) {
    throw new Error(`Error fetching alerts: ${error.message}`);
  }

  // Correction des types avec assertions appropriées
  return (data || []).map(alert => ({
    id: alert.id,
    stationcode: alert.stationcode,
    alert_type: alert.alert_type as UserAlert['alert_type'],
    threshold: alert.threshold,
    is_active: alert.is_active,
    created_at: alert.created_at,
    user_email: alert.user_email,
    notification_frequency: alert.notification_frequency as UserAlert['notification_frequency'],
    last_notification_sent: alert.last_notification_sent
  }));
}

export async function deactivateAlert(alertId: string, userIdentifier: string) {
  const { error } = await supabase
    .from('user_alerts')
    .update({ is_active: false })
    .eq('id', alertId)
    .eq('user_identifier', userIdentifier);

  if (error) {
    throw new Error(`Error deleting alert: ${error.message}`);
  }
}

export async function fetchNotificationHistory(userEmail: string): Promise<AlertNotificationHistory[]> {
  const { data, error } = await supabase
    .from('alert_notifications_history')
    .select('*')
    .eq('email', userEmail)
    .order('sent_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching notification history: ${error.message}`);
  }

  // Correction des types avec assertions appropriées
  return (data || []).map(notification => ({
    id: notification.id,
    alert_id: notification.alert_id,
    sent_at: notification.sent_at,
    email: notification.email,
    station_name: notification.station_name,
    alert_type: notification.alert_type,
    threshold: notification.threshold,
    current_value: notification.current_value,
    email_status: notification.email_status as AlertNotificationHistory['email_status']
  }));
}

export async function getStationName(stationcode: string): Promise<string> {
  const { data, error } = await supabase
    .from('velib_stations')
    .select('name')
    .eq('stationcode', stationcode)
    .single();

  if (error || !data) {
    throw new Error('Station not found');
  }

  return data.name;
}
