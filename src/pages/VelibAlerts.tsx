
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Trash2, AlertCircle, MapPin } from 'lucide-react';
import { 
  getUserAlerts, 
  deleteUserAlert, 
  UserAlert,
  subscribeToUserAlerts 
} from '@/services/supabaseVelibService';
import { toast } from '@/components/ui/use-toast';

const VelibAlerts = () => {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authenticated);

    if (authenticated) {
      loadAlerts();
      
      // S'abonner aux mises à jour des alertes
      const subscription = subscribeToUserAlerts((payload) => {
        console.log('Alert update received:', payload);
        loadAlerts(); // Recharger les alertes
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

  const handleDeleteAlert = async (alertId: string) => {
    const success = await deleteUserAlert(alertId);
    if (success) {
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'Vélos disponibles';
      case 'docks_available': return 'Places libres';
      case 'ebikes_available': return 'Vélos électriques';
      default: return type;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'bg-green-100 text-green-800';
      case 'docks_available': return 'bg-blue-100 text-blue-800';
      case 'ebikes_available': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout title="Mes alertes Vélib'">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Connexion requise</h2>
              <p className="text-gray-600 mb-6">
                Vous devez être connecté pour gérer vos alertes Vélib'.
              </p>
              <Button onClick={() => window.location.href = '/signin'}>
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mes alertes Vélib'">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mes alertes Vélib'</h1>
          <p className="text-gray-600">
            Gérez vos notifications pour les stations Vélib' qui vous intéressent.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Chargement de vos alertes...</div>
          </div>
        ) : alerts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucune alerte configurée</h2>
              <p className="text-gray-600 mb-6">
                Visitez une station sur la carte pour créer votre première alerte.
              </p>
              <Button onClick={() => window.location.href = '/map'}>
                <MapPin className="h-4 w-4 mr-2" />
                Aller à la carte
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
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
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={getAlertTypeColor(alert.alert_type)}>
                        {getAlertTypeLabel(alert.alert_type)}
                      </Badge>
                      <span className="ml-2 text-sm text-gray-600">
                        Seuil: {alert.threshold}
                      </span>
                    </div>
                    <Bell className={`h-4 w-4 ${alert.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VelibAlerts;
