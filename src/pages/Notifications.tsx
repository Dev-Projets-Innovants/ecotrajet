
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Award, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  Check,
  X,
  Trash2,
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Types for notifications
type NotificationType = 'system' | 'achievement' | 'alert' | 'social' | 'event';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Nouveau badge débloqué !',
      message: 'Félicitations ! Vous avez débloqué le badge "Cycliste urbain" pour avoir effectué 20 trajets à vélo.',
      date: 'Aujourd\'hui',
      isRead: false,
      actionUrl: '/rewards',
      actionLabel: 'Voir mes badges',
    },
    {
      id: '2',
      type: 'system',
      title: 'Mise à jour de l\'application',
      message: 'La version 2.5 d\'ÉcoTrajet est disponible avec de nouvelles fonctionnalités pour suivre vos trajets.',
      date: 'Hier',
      isRead: true,
    },
    {
      id: '3',
      type: 'alert',
      title: 'Alerte météo',
      message: 'Des pluies sont prévues demain matin. Pensez à adapter votre trajet et à vous équiper.',
      date: '2 jours',
      isRead: false,
    },
    {
      id: '4',
      type: 'social',
      title: 'Marie vous a mentionné',
      message: 'Marie Dupont vous a mentionné dans un post sur le forum communautaire à propos des pistes cyclables.',
      date: '3 jours',
      isRead: false,
      actionUrl: '/community',
      actionLabel: 'Voir le post',
    },
    {
      id: '5',
      type: 'event',
      title: 'Événement à venir',
      message: 'Rappel : Le défi "Semaine sans voiture" commence lundi prochain. Êtes-vous prêt à relever le défi ?',
      date: '5 jours',
      isRead: true,
      actionUrl: '/challenges',
      actionLabel: 'Voir le défi',
    },
    {
      id: '6',
      type: 'system',
      title: 'Synchronisation réussie',
      message: 'Vos données ont été correctement synchronisées avec votre compte ÉcoTrajet.',
      date: '1 semaine',
      isRead: true,
    },
    {
      id: '7',
      type: 'achievement',
      title: 'Niveau supérieur !',
      message: 'Vous êtes passé au niveau "Éco-Aventurier". Découvrez les nouvelles récompenses disponibles.',
      date: '1 semaine',
      isRead: true,
      actionUrl: '/rewards',
      actionLabel: 'Voir mon niveau',
    },
  ]);

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(notif => !notif.isRead);
    return notifications.filter(notif => notif.type === activeTab);
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée avec succès.",
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    toast({
      title: "Tout marqué comme lu",
      description: "Toutes les notifications ont été marquées comme lues.",
    });
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "Notifications effacées",
      description: "Toutes les notifications ont été supprimées.",
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'social':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-eco-green" />;
      default:
        return <Bell className="h-5 w-5 text-eco-green" />;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <Layout title="Notifications">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-eco-green">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}.` : 'Vous êtes à jour !'}
            </p>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Actions
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer tout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">
              Tout
              {notifications.length > 0 && (
                <Badge className="ml-1 bg-eco-green">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lu
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-eco-green">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="achievement">Badges</TabsTrigger>
            <TabsTrigger value="event">Événements</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${!notification.isRead ? 'border-l-4 border-l-eco-green' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-start gap-4 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-medium ${!notification.isRead ? 'text-eco-green' : ''}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">{notification.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                          {notification.actionUrl && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                                // In a real app, navigate to the URL
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Aucune notification</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Vous n'avez aucune notification dans cette catégorie. Elles apparaîtront ici lorsque vous en recevrez.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Préférences de notification</CardTitle>
            <CardDescription>Configurez quelles notifications vous souhaitez recevoir</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Accès aux paramètres",
                  description: "Redirection vers les paramètres de notification du profil.",
                });
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Gérer mes préférences de notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
