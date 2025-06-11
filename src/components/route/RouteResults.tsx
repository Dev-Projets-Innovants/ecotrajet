
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from '@/services/routingService';
import { Bike } from 'lucide-react';
import RouteSummary from './RouteSummary';
import RouteInstructions from './RouteInstructions';
import RouteSafetyTips from './RouteSafetyTips';
import RouteVoiceNavigation from './RouteVoiceNavigation';
import RouteImpact from './RouteImpact';

interface RouteResultsProps {
  route: Route | null;
  isLoading: boolean;
  transportMode: string;
}

const RouteResults = ({ route, isLoading, transportMode }: RouteResultsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
            <span className="ml-2 text-gray-600">Calcul de l'itinéraire vélo...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!route) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Bike className="h-12 w-12 mx-auto mb-3 text-eco-green" />
            <p className="text-lg font-medium mb-2">Prêt pour votre trajet à vélo ?</p>
            <p>Entrez un point de départ et une destination pour découvrir le meilleur itinéraire cyclable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-eco-green" />
            Itinéraire vélo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RouteSummary route={route} />
          <RouteInstructions route={route} />
          <RouteSafetyTips />
          <RouteVoiceNavigation />
        </CardContent>
      </Card>

      <RouteImpact route={route} />
    </div>
  );
};

export default RouteResults;
