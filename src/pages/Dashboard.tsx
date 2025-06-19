
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Car, Flame, Award, Target, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { useUserBadges } from '@/hooks/useUserBadges';
import { useUserChallenges } from '@/hooks/useUserChallenges';
import { useUserTrips } from '@/hooks/useUserTrips';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: statistics } = useUserStatistics();
  const { data: badges } = useUserBadges();
  const { data: challenges } = useUserChallenges();
  const { data: recentTrips } = useUserTrips(5); // Derniers 5 trajets

  // Valeurs par défaut si pas de données
  const stats = statistics || {
    total_trips: 0,
    total_distance_km: 0,
    total_co2_saved_kg: 0,
    total_calories_burned: 0,
    trees_equivalent: 0
  };

  const displayName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Utilisateur' 
    : 'Utilisateur';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* En-tête avec nom réel de l'utilisateur */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour {displayName} ! 👋
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre impact environnemental et de vos progrès.
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Économisé</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.total_co2_saved_kg.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Équivalent à {stats.trees_equivalent.toFixed(1)} arbres plantés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trajets Écologiques</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_trips}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total_distance_km.toFixed(1)} km parcourus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Brûlées</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.total_calories_burned}
            </div>
            <p className="text-xs text-muted-foreground">
              Grâce aux transports actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Obtenus</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{badges?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Accomplissements débloqués
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="trips">Mes Trajets</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trajets récents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Trajets Récents
                </CardTitle>
                <CardDescription>
                  Vos derniers déplacements écologiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTrips && recentTrips.length > 0 ? (
                  <div className="space-y-4">
                    {recentTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">
                            {trip.origin} → {trip.destination}
                          </p>
                          <p className="text-xs text-gray-600">
                            {trip.transport_mode.name} • {trip.distance_km} km
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            -{trip.co2_saved_kg.toFixed(2)} kg CO₂
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(trip.trip_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Aucun trajet enregistré pour le moment
                    </p>
                    <Button asChild>
                      <Link to="/carbon-calculator">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un trajet
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progression des défis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Défis en Cours
                </CardTitle>
                <CardDescription>
                  Vos objectifs écologiques actuels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenges && challenges.length > 0 ? (
                  <div className="space-y-4">
                    {challenges.slice(0, 3).map((challenge) => {
                      const progressPercentage = Math.min(
                        (challenge.current_value / challenge.challenge.target_value) * 100,
                        100
                      );
                      
                      return (
                        <div key={challenge.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm">{challenge.challenge.title}</p>
                            <Badge variant={challenge.is_completed ? "default" : "secondary"}>
                              {challenge.is_completed ? "Terminé" : "En cours"}
                            </Badge>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <p className="text-xs text-gray-600">
                            {challenge.current_value} / {challenge.challenge.target_value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Aucun défi en cours
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Trajets</CardTitle>
              <CardDescription>
                Tous vos déplacements écologiques enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTrips && recentTrips.length > 0 ? (
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {trip.origin} → {trip.destination}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(trip.trip_date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">{trip.transport_mode.name}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Distance:</span>
                          <p className="font-medium">{trip.distance_km} km</p>
                        </div>
                        <div>
                          <span className="text-gray-600">CO₂ économisé:</span>
                          <p className="font-medium text-green-600">
                            {trip.co2_saved_kg.toFixed(2)} kg
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Calories:</span>
                          <p className="font-medium text-orange-600">
                            {trip.calories_burned} cal
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun trajet enregistré</h3>
                  <p className="text-gray-600 mb-6">
                    Commencez à enregistrer vos trajets écologiques pour voir votre impact !
                  </p>
                  <Button asChild>
                    <Link to="/carbon-calculator">
                      <Plus className="h-4 w-4 mr-2" />
                      Enregistrer mon premier trajet
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges && challenges.length > 0 ? (
              challenges.map((challenge) => {
                const progressPercentage = Math.min(
                  (challenge.current_value / challenge.challenge.target_value) * 100,
                  100
                );
                
                return (
                  <Card key={challenge.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{challenge.challenge.title}</CardTitle>
                          <CardDescription>{challenge.challenge.description}</CardDescription>
                        </div>
                        <Badge variant={challenge.is_completed ? "default" : "secondary"}>
                          {challenge.is_completed ? "Terminé" : "En cours"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="flex justify-between text-sm">
                          <span>Progression: {challenge.current_value} / {challenge.challenge.target_value}</span>
                          <span className="font-medium">+{challenge.challenge.reward_points} pts</span>
                        </div>
                        {challenge.is_completed && challenge.completed_at && (
                          <p className="text-sm text-green-600">
                            ✅ Terminé le {new Date(challenge.completed_at).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-2">
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun défi disponible</h3>
                    <p className="text-gray-600">
                      Les défis apparaîtront ici au fur et à mesure que vous utilisez l'application.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges && badges.length > 0 ? (
              badges.map((badge) => (
                <Card key={badge.id}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{badge.badge_icon}</div>
                    <h3 className="font-semibold mb-2">{badge.badge_title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{badge.badge_description}</p>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(badge.earned_date).toLocaleDateString('fr-FR')}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <Card>
                  <CardContent className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun badge obtenu</h3>
                    <p className="text-gray-600 mb-6">
                      Commencez à utiliser l'application pour débloquer vos premiers badges !
                    </p>
                    <Button asChild>
                      <Link to="/carbon-calculator">
                        <Plus className="h-4 w-4 mr-2" />
                        Commencer un trajet
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
