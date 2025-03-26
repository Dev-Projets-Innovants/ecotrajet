
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, TreePine, Bike } from 'lucide-react';

const CommunityProgress = () => {
  const communityStats = {
    participants: 1283,
    co2Saved: 14580,
    trees: 729,
    trips: 8940,
    progress: 78
  };

  return (
    <>
      <Card className="col-span-1 bg-gradient-to-br from-eco-light-green to-eco-green text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-white">
            <Users className="h-5 w-5 mr-2" />
            Communauté
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{communityStats.participants}</div>
          <p className="text-sm opacity-90">participants actifs</p>
          
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Objectif communautaire</div>
            <Progress value={communityStats.progress} className="h-2 bg-white/30" />
            <div className="flex justify-between mt-1 text-xs">
              <span>En cours</span>
              <span>{communityStats.progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <TreePine className="h-5 w-5 mr-2 text-eco-green" />
            Impact environnemental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{communityStats.co2Saved} kg</div>
          <p className="text-sm text-gray-500">de CO2 économisés</p>
          
          <div className="mt-4 text-sm text-gray-500">
            Équivalent à {communityStats.trees} arbres plantés
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Bike className="h-5 w-5 mr-2 text-eco-blue" />
            Mobilité verte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{communityStats.trips}</div>
          <p className="text-sm text-gray-500">trajets écologiques réalisés</p>
          
          <div className="mt-4 text-sm text-gray-500">
            Cette semaine : +348 trajets
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CommunityProgress;
