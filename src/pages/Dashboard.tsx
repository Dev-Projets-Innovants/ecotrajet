import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Leaf, 
  LogOut, 
  MapPin, 
  Calendar, 
  Droplets, 
  Award, 
  Flame, 
  Wind, 
  Target,
  TrendingUp
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Layout } from "@/components/Layout";
import { toast } from "@/hooks/use-toast";

const userData = {
  name: "Thomas Dubois",
  level: "Aventurier Écologique",
  profileImage: "https://i.pravatar.cc/150?img=37",
  stats: {
    trips: 27,
    co2Saved: 32.4, // en kg
    distance: 128.3, // en km
    calories: 3520, // en calories
    treesEquivalent: 3.2
  },
  badges: [
    { id: 1, title: "Premier Trajet", icon: "🚲", date: "15 mai", description: "Premier trajet effectué avec EcoTrajet" },
    { id: 2, title: "10 Trajets", icon: "🏆", date: "2 juin", description: "10 trajets écologiques complétés" },
    { id: 3, title: "CO2 -10kg", icon: "🌿", date: "8 juin", description: "10kg de CO2 économisés" },
  ],
  challenges: [
    { id: 1, title: "30 jours consécutifs", progress: 70, target: 30, current: 21 },
    { id: 2, title: "Cycliste passionné", progress: 40, target: 200, current: 80 },
    { id: 3, title: "Écologie urbaine", progress: 90, target: 50, current: 45 },
  ]
};

const monthlyTripsData = [
  { name: 'Jan', trips: 4 },
  { name: 'Fév', trips: 6 },
  { name: 'Mar', trips: 8 },
  { name: 'Avr', trips: 10 },
  { name: 'Mai', trips: 12 },
  { name: 'Juin', trips: 18 },
  { name: 'Juil', trips: 27 },
];

const recentTrips = [
  { id: 1, date: "12 juillet", from: "Bastille", to: "République", distance: "3,2 km", co2: "0,8 kg" },
  { id: 2, date: "10 juillet", from: "Nation", to: "Père Lachaise", distance: "2,7 km", co2: "0,6 kg" },
  { id: 3, date: "8 juillet", from: "Châtelet", to: "Gare du Nord", distance: "4,1 km", co2: "1,0 kg" },
];

const weatherData = {
  condition: "Ensoleillé",
  temperature: 24,
  wind: 10, // km/h
  rain: 0,
  advice: "Conditions idéales pour un trajet à vélo ou en trottinette. N'oubliez pas votre crème solaire!"
};

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page.",
        variant: "destructive",
      });
      navigate('/signin', { state: { from: '/dashboard' } });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/');
  };

  return (
    <Layout title="Tableau de bord">
      <div className="min-h-screen bg-gray-50 pt-6">
        <header className="bg-white shadow mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-eco-green">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 bg-white rounded-lg p-6 shadow">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-eco-light-green">
                <AvatarImage src={userData.profileImage} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{userData.name}</h2>
              <div className="flex items-center mt-1 space-x-1">
                <Leaf className="h-4 w-4 text-eco-green" />
                <span className="text-sm font-medium text-eco-green">{userData.level}</span>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6 md:mt-0">
              <Card className="bg-gradient-to-br from-eco-light-green to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Trajets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.stats.trips}</div>
                  <p className="text-xs text-muted-foreground mt-1">trajets écologiques</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-eco-light-green to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">CO₂ Économisé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.stats.co2Saved} kg</div>
                  <p className="text-xs text-muted-foreground mt-1">par rapport à la voiture</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-eco-light-green to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.stats.distance} km</div>
                  <p className="text-xs text-muted-foreground mt-1">parcourus écologiquement</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-eco-light-green to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.stats.calories}</div>
                  <p className="text-xs text-muted-foreground mt-1">calories brûlées</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>Vos trajets écologiques au fil des mois</CardDescription>
              </CardHeader>
              <CardContent className="aspect-video">
                <ChartContainer
                  config={{
                    trips: { 
                      color: "#4CAF50",
                      label: "Trajets"
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyTripsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      className="text-xs sm:text-sm"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-[8px] sm:text-xs" 
                        tick={{ fontSize: 10 }} 
                      />
                      <YAxis className="text-[8px] sm:text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="trips"
                        name="trips"
                        stroke="#4CAF50"
                        fill="#E8F5E9"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Écologique</CardTitle>
                <CardDescription>Votre contribution à la planète</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[240px]">
                <div className="text-6xl mb-4 text-eco-green">🌳</div>
                <div className="text-4xl font-bold text-eco-green">{userData.stats.treesEquivalent}</div>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Équivalent en arbres plantés <br/> grâce à vos trajets écologiques
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Trajets Récents</CardTitle>
                <CardDescription>Vos derniers déplacements écologiques</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Départ</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>CO₂ Économisé</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.date}</TableCell>
                        <TableCell>{trip.from}</TableCell>
                        <TableCell>{trip.to}</TableCell>
                        <TableCell>{trip.distance}</TableCell>
                        <TableCell>{trip.co2}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir tous les trajets
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Météo Paris</CardTitle>
                <CardDescription>Conditions pour vos trajets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-2">☀️</div>
                  <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
                  <p className="text-sm text-center mt-1">{weatherData.condition}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    <div className="flex flex-col items-center">
                      <Wind className="h-5 w-5 text-eco-green mb-1" />
                      <span className="text-sm">{weatherData.wind} km/h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Droplets className="h-5 w-5 text-eco-green mb-1" />
                      <span className="text-sm">{weatherData.rain}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-eco-light-green/20 rounded-lg text-sm">
                    <p>{weatherData.advice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Badges & Récompenses</CardTitle>
                  <CardDescription>Vos derniers accomplissements</CardDescription>
                </div>
                <Award className="h-5 w-5 text-eco-green" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.badges.map((badge) => (
                    <div key={badge.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{badge.title}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                      </div>
                      <Badge variant="outline">{badge.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Tous les badges
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Défis en cours</CardTitle>
                  <CardDescription>Relevez les défis pour gagner des récompenses</CardDescription>
                </div>
                <Target className="h-5 w-5 text-eco-green" />
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {userData.challenges.map((challenge) => (
                    <div key={challenge.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{challenge.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {challenge.current}/{challenge.target}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className="h-full bg-eco-green" 
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir tous les défis
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
