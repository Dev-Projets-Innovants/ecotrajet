
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { User, Settings, Shield, Activity, Bell, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/Layout";
import { toast } from "@/hooks/use-toast";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <Layout title="Profil Administrateur">
        <div className="min-h-screen bg-gray-50 pt-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile?.is_admin) {
    navigate('/dashboard');
    return null;
  }

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout title="Profil Administrateur">
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Profile Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </h1>
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrateur
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{user.email}</p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier le profil
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Paramètres du compte
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevoir les alertes importantes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-500">Sécurité renforcée</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            {/* Admin Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Paramètres d'administration
                </CardTitle>
                <CardDescription>
                  Configuration et préférences administratives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode maintenance</p>
                    <p className="text-sm text-gray-500">Activer la maintenance du site</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Logs détaillés</p>
                    <p className="text-sm text-gray-500">Enregistrement étendu des activités</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Voir les logs d'activité
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Actions rapides
                </CardTitle>
                <CardDescription>
                  Accès rapide aux fonctions principales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Gestion des utilisateurs
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Statistiques et analyses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/notifications')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications système
                </Button>
              </CardContent>
            </Card>

            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Aperçu sécurité
                </CardTitle>
                <CardDescription>
                  État de la sécurité du compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dernière connexion</span>
                  <span className="text-sm text-gray-500">Il y a 2 heures</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sessions actives</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Niveau de sécurité</span>
                  <Badge className="bg-green-100 text-green-800">Élevé</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
