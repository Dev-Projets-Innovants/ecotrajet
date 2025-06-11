
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

export interface VelibAlertRequest {
  email: string;
  stationName: string;
  stationCode: string;
  alertType: string;
  threshold: number;
  currentValue: number;
  alertId: string;
}
