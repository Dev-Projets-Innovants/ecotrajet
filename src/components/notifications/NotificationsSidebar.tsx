
import React from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface NotificationsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Nouveau défi complété !',
    message: 'Félicitations ! Vous avez terminé le défi "30 km à vélo cette semaine".',
    time: '2 minutes',
    read: false,
    icon: Trophy
  },
  {
    id: 2,
    type: 'info',
    title: 'Nouvelle station Vélib\'',
    message: 'Une nouvelle station Vélib\' a été installée près de chez vous.',
    time: '1 heure',
    read: false,
    icon: Info
  },
  {
    id: 3,
    type: 'warning',
    title: 'Station hors service',
    message: 'La station République est temporairement hors service.',
    time: '3 heures',
    read: true,
    icon: AlertCircle
  },
  {
    id: 4,
    type: 'success',
    title: 'Objectif mensuel atteint',
    message: 'Vous avez économisé 15kg de CO2 ce mois-ci !',
    time: '1 jour',
    read: true,
    icon: CheckCircle
  },
  {
    id: 5,
    type: 'info',
    title: 'Nouveau contenu disponible',
    message: 'Découvrez notre nouvel article sur la sécurité à vélo.',
    time: '2 jours',
    read: true,
    icon: Info
  }
];

const NotificationsSidebar: React.FC<NotificationsSidebarProps> = ({ open, onOpenChange }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log('Marking all notifications as read');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-eco-green" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="text-eco-green hover:text-eco-dark-green"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-500">Vous êtes à jour !</p>
            </div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 hover:bg-gray-100' 
                        : 'bg-eco-light-green/20 hover:bg-eco-light-green/30 border border-eco-green/20'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 mt-1 ${getIconColor(notification.type)}`}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-eco-green rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-sm ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Il y a {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSidebar;
