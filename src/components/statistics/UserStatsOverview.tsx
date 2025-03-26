
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bike, Car, Train, TrendingUp } from 'lucide-react';

interface UserStatsOverviewProps {
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

const UserStatsOverview: React.FC<UserStatsOverviewProps> = ({ timeframe = 'overall' }) => {
  // In a real application, this data would come from an API
  const stats = {
    overall: {
      totalTrips: 142,
      ecoTrips: 98,
      distance: 743,
      co2Saved: 87
    },
    daily: {
      totalTrips: 4,
      ecoTrips: 3,
      distance: 12,
      co2Saved: 2
    },
    weekly: {
      totalTrips: 23,
      ecoTrips: 16,
      distance: 124,
      co2Saved: 15
    },
    monthly: {
      totalTrips: 48,
      ecoTrips: 34,
      distance: 276,
      co2Saved: 32
    }
  };

  const currentStats = stats[timeframe as keyof typeof stats];
  const ecoPercentage = Math.round((currentStats.ecoTrips / currentStats.totalTrips) * 100);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Trajets totaux</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.totalTrips}</div>
          <p className="text-xs text-muted-foreground">
            trajets enregistrés
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Trajets écologiques</CardTitle>
          <Bike className="h-4 w-4 text-eco-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.ecoTrips}</div>
          <Progress value={ecoPercentage} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {ecoPercentage}% de vos trajets
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Distance parcourue</CardTitle>
          <Train className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.distance} km</div>
          <p className="text-xs text-muted-foreground">
            en modes de transport divers
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">CO2 économisé</CardTitle>
          <Car className="h-4 w-4 text-eco-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentStats.co2Saved} kg</div>
          <p className="text-xs text-muted-foreground">
            par rapport à la voiture
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsOverview;
