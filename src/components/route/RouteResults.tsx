
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, formatDuration, formatDistance } from '@/services/routingService';
import { Clock, MapPin, Navigation, ArrowRight } from 'lucide-react';

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
            <span className="ml-2 text-gray-600">Calcul de l'itinéraire...</span>
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
            Entrez un point de départ et une destination pour voir les options d'itinéraires écologiques
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'walking': return '🚶';
      case 'bike': return '🚲';
      case 'public': return '🚇';
      case 'car': return '🚗';
      default: return '🚶';
    }
  };

  const getTransportLabel = (mode: string) => {
    switch (mode) {
      case 'walking': return 'À pied';
      case 'bike': return 'Vélo';
      case 'public': return 'Transports';
      case 'car': return 'Voiture';
      default: return 'À pied';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-eco-green" />
            Itinéraire calculé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-lg">
              {getTransportIcon(transportMode)} {getTransportLabel(transportMode)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {formatDuration(route.duration)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {formatDistance(route.distance)}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {route.summary}
          </div>
          
          {/* Instructions détaillées */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Instructions :</h4>
            {route.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="bg-eco-green text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{step.instruction}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistance(step.distance)} • {formatDuration(step.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact écologique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Impact écologique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-700">CO₂ économisé</div>
              <div className="text-green-600">
                {transportMode === 'car' ? '0g' : `${Math.round(route.distance * 0.12)}g`}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-700">Calories brûlées</div>
              <div className="text-blue-600">
                {transportMode === 'walking' ? Math.round(route.distance * 50) : 
                 transportMode === 'bike' ? Math.round(route.distance * 30) : '0'} cal
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteResults;
