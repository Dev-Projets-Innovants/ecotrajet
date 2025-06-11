
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getUserAlerts, 
  deleteUserAlert, 
  UserAlert,
  subscribeToUserAlerts,
  getAlertNotificationHistory,
  AlertNotificationHistory
} from '@/services/supabaseVelibService';
import { toast } from '@/components/ui/use-toast';
import AlertsHeader from '@/components/velib/alerts/AlertsHeader';
import AuthRequired from '@/components/velib/alerts/AuthRequired';
import AlertsList from '@/components/velib/alerts/AlertsList';
import NotificationHistory from '@/components/velib/alerts/NotificationHistory';

const VelibAlerts = () => {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<AlertNotificationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authenticated);

    if (authenticated) {
      loadAlerts();
      loadNotificationHistory();
      
      const subscription = subscribeToUserAlerts((payload) => {
        console.log('Alert update received:', payload);
        loadAlerts();
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const userAlerts = await getUserAlerts();
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos alertes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      const history = await getAlertNotificationHistory();
      setNotificationHistory(history);
    } catch (error) {
      console.error('Error loading notification history:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    const success = await deleteUserAlert(alertId);
    if (success) {
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout title="Mes alertes Vélib'">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <AuthRequired />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mes alertes Vélib'">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <AlertsHeader />

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">Mes alertes actives</TabsTrigger>
            <TabsTrigger value="history">Historique des emails</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <AlertsList
              alerts={alerts}
              isLoading={isLoading}
              onDeleteAlert={handleDeleteAlert}
            />
          </TabsContent>

          <TabsContent value="history">
            <NotificationHistory notificationHistory={notificationHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VelibAlerts;
