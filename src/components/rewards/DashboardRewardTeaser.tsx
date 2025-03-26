
import React from "react";
import { Link } from "react-router-dom";
import { Award, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function DashboardRewardTeaser() {
  // Example data
  const userLevel = {
    level: 2,
    title: "Cycliste Conscient",
    nextLevel: "Aventurier Vert",
    progress: 25
  };
  
  const recentBadges = [
    { id: 1, title: "Premier Trajet", icon: "🚲", date: "15 juin" },
    { id: 2, title: "Semaine Verte", icon: "🌱", date: "22 juin" },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Récompenses</CardTitle>
          <CardDescription>Votre progression et badges récents</CardDescription>
        </div>
        <Award className="h-5 w-5 text-eco-green" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Niveau {userLevel.level}: {userLevel.title}</span>
              <span className="text-sm font-medium">{userLevel.progress}%</span>
            </div>
            <Progress value={userLevel.progress} className="h-2" />
            <div className="mt-1 text-xs text-muted-foreground">
              Prochain niveau: {userLevel.nextLevel}
            </div>
          </div>
          
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">Badges récents</div>
            <div className="space-y-2">
              {recentBadges.map(badge => (
                <div key={badge.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{badge.icon}</div>
                    <div className="font-medium text-sm">{badge.title}</div>
                  </div>
                  <Badge variant="outline">{badge.date}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/rewards" className="flex items-center justify-center">
            Voir toutes les récompenses
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
