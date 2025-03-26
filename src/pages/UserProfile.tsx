
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Edit,
  Settings,
  LogOut,
  Award,
  Bike,
  Leaf,
  Route,
  MapPin,
  Shield,
  BarChart,
  User,
  Mail,
  Lock,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const UserProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Moreau',
    email: 'alex.moreau@exemple.fr',
    city: 'Nantes',
    bio: 'Adepte de la mobilité douce et passionné de vélo urbain. Je participe aux défis ÉcoTrajet depuis 6 mois.',
    preferences: {
      emailNotifications: true,
      appNotifications: true,
      weeklyReport: true,
      dataSharing: false,
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: value
      }
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

  // User stats
  const userStats = {
    level: 3,
    levelName: "Éco-Voyageur",
    nextLevel: "Gardien de la Planète",
    progress: 68,
    pointsToNextLevel: 320,
    co2Saved: 183.5,
    totalTrips: 145,
    totalDistanceKm: 870,
    badges: [
      { id: 1, name: "Premier Trajet", icon: "🚲", date: "10 Jan 2023" },
      { id: 2, name: "Économie de CO2", icon: "🌱", date: "15 Fév 2023" },
      { id: 3, name: "Semaine Parfaite", icon: "🏆", date: "3 Mar 2023" },
      { id: 4, name: "Explorer Urbain", icon: "🗺️", date: "22 Avr 2023" },
    ],
    recentActivity: [
      { id: 1, type: "Trajet", description: "Trajet domicile-travail à vélo", date: "Aujourd'hui", points: 15, co2Saved: 2.1 },
      { id: 2, type: "Badge", description: "Badge 'Semaine Parfaite' débloqué", date: "Hier", points: 50, co2Saved: 0 },
      { id: 3, type: "Défi", description: "Défi 'Zéro émission' complété", date: "3 jours", points: 100, co2Saved: 12.5 },
    ]
  };

  return (
    <Layout title="Profil Utilisateur">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-eco-green">Mon Profil</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar with user info */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="https://i.pravatar.cc/150?img=4" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-xl">{formData.name}</h2>
                <div className="text-eco-green text-sm font-medium">{userStats.levelName}</div>
                <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{formData.city}</span>
                </div>
                
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Niveau {userStats.level}</span>
                    <span>Niveau {userStats.level + 1}</span>
                  </div>
                  <Progress value={userStats.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userStats.pointsToNextLevel} points pour devenir {userStats.nextLevel}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
                  <div className="p-2">
                    <div className="text-2xl font-bold text-eco-green">{userStats.co2Saved}</div>
                    <div className="text-xs text-muted-foreground">kg CO₂ économisés</div>
                  </div>
                  <div className="p-2">
                    <div className="text-2xl font-bold text-eco-green">{userStats.totalTrips}</div>
                    <div className="text-xs text-muted-foreground">Trajets</div>
                  </div>
                  <div className="p-2">
                    <div className="text-2xl font-bold text-eco-green">{userStats.totalDistanceKm}</div>
                    <div className="text-xs text-muted-foreground">km parcourus</div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Badges obtenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {userStats.badges.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium text-center">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full text-eco-green">
                  <Award className="h-4 w-4 mr-2" />
                  Voir tous les badges
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos</CardTitle>
                    <CardDescription>Votre profil personnel et information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet</Label>
                          <Input 
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input 
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Biographie</Label>
                          <Input 
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {formData.bio}
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{formData.city}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        className="bg-eco-green hover:bg-eco-dark-green"
                        onClick={handleSaveProfile}
                      >
                        Enregistrer
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Activité récente</h3>
                  <div className="space-y-4">
                    {userStats.recentActivity.map(activity => (
                      <Card key={activity.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-eco-light-green p-2">
                              {activity.type === "Trajet" && <Bike className="h-5 w-5 text-eco-green" />}
                              {activity.type === "Badge" && <Award className="h-5 w-5 text-eco-green" />}
                              {activity.type === "Défi" && <Leaf className="h-5 w-5 text-eco-green" />}
                            </div>
                            <div>
                              <div className="font-medium">{activity.description}</div>
                              <div className="text-xs text-muted-foreground">{activity.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">+{activity.points} pts</div>
                            {activity.co2Saved > 0 && (
                              <div className="text-xs text-green-500">-{activity.co2Saved} kg CO₂</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="py-4">
                  <CardHeader>
                    <CardTitle>Historique d'activité</CardTitle>
                    <CardDescription>Vos trajets et actions écologiques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6">
                      <div className="absolute top-0 bottom-0 left-2.5 w-px bg-border"></div>
                      
                      <div className="mb-8 relative">
                        <div className="absolute -left-6 mt-1.5 rounded-full bg-eco-green p-1">
                          <Bike className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h4 className="font-semibold">Trajet domicile-travail</h4>
                            <span className="text-xs text-muted-foreground">Aujourd'hui, 08:30</span>
                          </div>
                          <div className="text-sm mb-2">
                            Trajet effectué à vélo - 5,2 km
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-500 flex items-center">
                              <Leaf className="h-3.5 w-3.5 mr-1" /> 
                              -1,2 kg CO₂
                            </span>
                            <span className="text-eco-green">+15 points</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8 relative">
                        <div className="absolute -left-6 mt-1.5 rounded-full bg-amber-500 p-1">
                          <Award className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h4 className="font-semibold">Badge débloqué : "Semaine Parfaite"</h4>
                            <span className="text-xs text-muted-foreground">Hier, 19:45</span>
                          </div>
                          <div className="text-sm mb-2">
                            Vous avez effectué au moins un trajet écologique chaque jour de la semaine !
                          </div>
                          <div className="flex justify-between text-xs">
                            <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                              Nouveau badge
                            </Badge>
                            <span className="text-eco-green">+50 points</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8 relative">
                        <div className="absolute -left-6 mt-1.5 rounded-full bg-blue-500 p-1">
                          <Route className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h4 className="font-semibold">Covoiturage avec 3 collègues</h4>
                            <span className="text-xs text-muted-foreground">3 jours, 17:15</span>
                          </div>
                          <div className="text-sm mb-2">
                            Trajet effectué en covoiturage - 15,8 km
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-green-500 flex items-center">
                              <Leaf className="h-3.5 w-3.5 mr-1" /> 
                              -3,5 kg CO₂
                            </span>
                            <span className="text-eco-green">+25 points</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="mt-4 w-full">
                        Voir l'historique complet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Stats Tab */}
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes statistiques</CardTitle>
                    <CardDescription>Suivez votre impact environnemental</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-sm">CO₂ économisé</h3>
                              <Leaf className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-green-500 mb-1">
                              {userStats.co2Saved} kg
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Équivalent à la plantation de 8 arbres
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium text-sm">Distance parcourue</h3>
                              <Route className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-3xl font-bold text-blue-500 mb-1">
                              {userStats.totalDistanceKm} km
                            </div>
                            <p className="text-xs text-muted-foreground">
                              En {userStats.totalTrips} trajets écologiques
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm mb-3">Répartition des trajets</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Vélo</span>
                                <span className="text-xs">58%</span>
                              </div>
                              <Progress value={58} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Transport en commun</span>
                                <span className="text-xs">22%</span>
                              </div>
                              <Progress value={22} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Covoiturage</span>
                                <span className="text-xs">15%</span>
                              </div>
                              <Progress value={15} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs">Marche</span>
                                <span className="text-xs">5%</span>
                              </div>
                              <Progress value={5} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm mb-3">Réalisations</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-eco-green">12</div>
                            <div className="text-xs text-muted-foreground">Badges gagnés</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-eco-green">5</div>
                            <div className="text-xs text-muted-foreground">Défis complétés</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-eco-green">3</div>
                            <div className="text-xs text-muted-foreground">Mois consécutifs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du compte</CardTitle>
                    <CardDescription>Gérez vos préférences et informations personnelles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Informations personnelles
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="settings-name">Nom complet</Label>
                          <Input id="settings-name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="settings-email">Email</Label>
                          <Input id="settings-email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="settings-city">Ville</Label>
                          <Input id="settings-city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications" className="flex-1">Notifications par email</Label>
                          <Switch 
                            id="email-notifications" 
                            checked={formData.preferences.emailNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="app-notifications" className="flex-1">Notifications dans l'application</Label>
                          <Switch 
                            id="app-notifications" 
                            checked={formData.preferences.appNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange('appNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="weekly-report" className="flex-1">Rapport hebdomadaire</Label>
                          <Switch 
                            id="weekly-report" 
                            checked={formData.preferences.weeklyReport}
                            onCheckedChange={(checked) => handlePreferenceChange('weeklyReport', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Confidentialité
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="data-sharing" className="flex-1">
                            <div>Partage des données de mobilité</div>
                            <span className="text-xs text-muted-foreground">Autorise le partage anonyme pour améliorer le service</span>
                          </Label>
                          <Switch 
                            id="data-sharing" 
                            checked={formData.preferences.dataSharing}
                            onCheckedChange={(checked) => handlePreferenceChange('dataSharing', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Changer de mot de passe
                      </Button>
                      <Button variant="outline" className="w-full flex items-center justify-center text-eco-green">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Aide & Support
                      </Button>
                      <Button variant="outline" className="w-full flex items-center justify-center text-red-500">
                        <LogOut className="h-4 w-4 mr-2" />
                        Se déconnecter
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-eco-green hover:bg-eco-dark-green"
                      onClick={handleSaveProfile}
                    >
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
