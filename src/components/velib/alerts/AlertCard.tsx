
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2, Mail, Clock } from 'lucide-react';
import { UserAlert } from '@/services/supabaseVelibService';

interface AlertCardProps {
  alert: UserAlert;
  onDelete: (alertId: string) => void;
  getAlertTypeLabel: (type: string) => string;
  getAlertTypeColor: (type: string) => string;
  getFrequencyLabel: (frequency?: string) => string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onDelete,
  getAlertTypeLabel,
  getAlertTypeColor,
  getFrequencyLabel
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">
            Station {alert.stationcode}
          </CardTitle>
          <CardDescription>
            Créée le {new Date(alert.created_at).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={alert.is_active ? "default" : "secondary"}
            className={alert.is_active ? "bg-green-500" : ""}
          >
            {alert.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(alert.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={getAlertTypeColor(alert.alert_type)}>
                {getAlertTypeLabel(alert.alert_type)}
              </Badge>
              <span className="text-sm text-gray-600">
                Seuil: {alert.threshold}
              </span>
            </div>
            <Bell className={`h-4 w-4 ${alert.is_active ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          
          {alert.user_email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{alert.user_email}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Fréquence: {getFrequencyLabel(alert.notification_frequency)}</span>
          </div>
          
          {alert.last_notification_sent && (
            <div className="text-xs text-gray-500">
              Dernier email: {new Date(alert.last_notification_sent).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
