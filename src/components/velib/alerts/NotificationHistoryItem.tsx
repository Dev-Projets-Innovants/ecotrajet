
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AlertNotificationHistory } from '@/services/supabaseVelibService';

interface NotificationHistoryItemProps {
  notification: AlertNotificationHistory;
  getAlertTypeLabel: (type: string) => string;
  getEmailStatusColor: (status: string) => string;
}

const NotificationHistoryItem: React.FC<NotificationHistoryItemProps> = ({
  notification,
  getAlertTypeLabel,
  getEmailStatusColor
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium text-sm">
          {notification.station_name}
        </div>
        <div className="text-xs text-gray-600">
          {getAlertTypeLabel(notification.alert_type)} • Seuil: {notification.threshold} • Valeur: {notification.current_value}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(notification.sent_at).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <CheckCircle 
          className={`h-4 w-4 ${getEmailStatusColor(notification.email_status)}`}
        />
        <span className={`text-sm ${getEmailStatusColor(notification.email_status)}`}>
          {notification.email_status === 'sent' ? 'Envoyé' : 
           notification.email_status === 'failed' ? 'Échec' : 'En cours'}
        </span>
      </div>
    </div>
  );
};

export default NotificationHistoryItem;
