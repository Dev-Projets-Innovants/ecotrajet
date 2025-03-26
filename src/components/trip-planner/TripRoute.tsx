
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Navigation, Leaf } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface RouteStep {
  type: 'walk' | 'bike' | 'bus' | 'metro' | 'train' | 'car';
  icon: LucideIcon;
  name: string;
  duration: string;
  distance: string;
  color: string;
}

interface RouteOption {
  id: string;
  title: string;
  duration: string;
  distance: string;
  co2: string;
  ecoScore: number;
  price?: string;
  steps: RouteStep[];
}

interface TripRouteProps {
  route: RouteOption;
}

export const TripRoute: React.FC<TripRouteProps> = ({ route }) => {
  const getEcoScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-eco-green";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getEcoScoreBadgeColor(route.ecoScore)}>
                <Leaf className="h-3 w-3 mr-1" />
                {route.ecoScore}%
              </Badge>
              <h3 className="font-semibold">{route.title}</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-medium">{route.duration}</div>
                <div className="text-xs text-gray-500">{route.distance}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {route.steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center">
                  <div className={`rounded-full p-1 ${step.color}`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="ml-1 text-xs">
                    <span className="font-medium">{step.duration}</span>
                  </div>
                </div>
                {index < route.steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {route.duration}
              </div>
              {route.price && (
                <div>
                  Prix: {route.price}
                </div>
              )}
              <div>
                CO2: {route.co2}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Détails
              </Button>
              <Button size="sm">
                <Navigation className="h-4 w-4 mr-1" />
                Itinéraire
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
