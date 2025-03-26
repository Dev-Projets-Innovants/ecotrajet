
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Award, TrendingUp } from 'lucide-react';

const GoalTracker = () => {
  // Mock data - in a real app these would come from API/state
  const goals = [
    {
      id: 1,
      name: "Utiliser le vélo 3 fois par semaine",
      target: 12,
      current: 8,
      unit: "trajets",
      icon: <Bike className="h-5 w-5 text-eco-green" />,
      deadline: "Cette semaine"
    },
    {
      id: 2,
      name: "Réduire les émissions de CO2 de 30%",
      target: 30,
      current: 22,
      unit: "%",
      icon: <TrendingUp className="h-5 w-5 text-eco-blue" />,
      deadline: "Ce mois"
    },
    {
      id: 3,
      name: "Économiser 50kg de CO2",
      target: 50,
      current: 32,
      unit: "kg",
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      deadline: "Ce mois"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vos objectifs écologiques</CardTitle>
            <CardDescription>Suivez votre progression vers une mobilité plus verte</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <Target className="h-4 w-4" />
            <span>Définir un objectif</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {goals.map((goal) => {
            const progress = Math.round((goal.current / goal.target) * 100);
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {goal.icon}
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{goal.deadline}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium min-w-[90px] text-right">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// We need to import Bike for the icon
import { Bike } from 'lucide-react';

export default GoalTracker;
