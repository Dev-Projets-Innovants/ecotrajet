
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { AlertNotificationHistory } from '@/services/supabaseVelibService';
import NotificationHistoryItem from './NotificationHistoryItem';

interface NotificationHistoryProps {
  notificationHistory: AlertNotificationHistory[];
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ notificationHistory }) => {
  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'Vélos disponibles';
      case 'docks_available': return 'Places libres';
      case 'ebikes_available': return 'Vélos électriques';
      case 'mechanical_bikes': return 'Vélos mécaniques';
      default: return type;
    }
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Historique des emails envoyés</span>
        </CardTitle>
        <CardDescription>
          Les 50 derniers emails d'alerte envoyés
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notificationHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun email d'alerte envoyé pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {notificationHistory.map((notification) => (
              <NotificationHistoryItem
                key={notification.id}
                notification={notification}
                getAlertTypeLabel={getAlertTypeLabel}
                getEmailStatusColor={getEmailStatusColor}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationHistory;
