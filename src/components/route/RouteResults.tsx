
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, formatDuration, formatDistance } from '@/services/routingService';
import { Clock, MapPin, Navigation, ArrowRight, Bike, AlertTriangle, Info } from 'lucide-react';

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

  const getStepIcon = (type: string, index: number) => {
    switch (type) {
      case 'start': return '🚴';
      case 'arrive': return '🏁';
      case 'turn-left': return '↰';
      case 'turn-right': return '↱';
      case 'continue': return '↑';
      default: return `${index + 1}`;
    }
  };

  const getAccessibilityInstruction = (instruction: string) => {
    // Ajouter des instructions d'accessibilité plus détaillées
    const accessibilityMap: { [key: string]: string } = {
      'Dirigez-vous vers le sud': 'Prenez la direction sud. Attention aux voitures lors du démarrage.',
      'Continuez tout droit': 'Maintenez votre trajectoire. Restez vigilant aux intersections.',
      'Vous êtes arrivé à destination': 'Destination atteinte. Pensez à sécuriser votre vélo.'
    };
    
    return accessibilityMap[instruction] || instruction;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-eco-green" />
            Itinéraire vélo calculé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg bg-eco-green/10 text-eco-green">
              🚲 Vélo
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
          
          {/* Conseils de sécurité */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">Conseils de sécurité</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Portez un casque et des vêtements visibles</li>
                    <li>• Vérifiez vos freins et votre éclairage</li>
                    <li>• Respectez le code de la route et les pistes cyclables</li>
                    <li>• Restez vigilant aux ouvertures de portières</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg">
            <Info className="h-4 w-4 inline mr-2 text-blue-600" />
            {route.summary}
          </div>
          
          {/* Instructions détaillées et accessibles */}
          <div className="space-y-3">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5 text-eco-green" />
              Instructions détaillées
            </h4>
            {route.steps.map((step, index) => (
              <Card key={index} className="border-l-4 border-l-eco-green">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-eco-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {getStepIcon(step.type, index)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {step.instruction}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {getAccessibilityInstruction(step.instruction)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {formatDistance(step.distance)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(step.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation vocale */}
          <Card className="mt-6 bg-eco-green/5 border-eco-green/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-eco-green/10 p-2 rounded-full">
                  <Info className="h-4 w-4 text-eco-green" />
                </div>
                <div>
                  <h5 className="font-medium text-eco-green">Navigation vocale</h5>
                  <p className="text-sm text-gray-600">
                    Activez la fonction de lecture d'écran de votre appareil pour entendre les instructions pendant votre trajet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Impact écologique spécifique au vélo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            🌱 Impact positif de votre trajet à vélo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🌍</div>
              <div className="font-semibold text-green-700">CO₂ économisé</div>
              <div className="text-green-600 font-bold">
                {Math.round(route.distance * 0.12)}g
              </div>
              <div className="text-xs text-green-600 mt-1">vs voiture</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-semibold text-orange-700">Calories brûlées</div>
              <div className="text-orange-600 font-bold">
                {Math.round(route.distance * 30)} cal
              </div>
              <div className="text-xs text-orange-600 mt-1">estimation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold text-blue-700">Économies</div>
              <div className="text-blue-600 font-bold">
                {(route.distance * 0.5).toFixed(1)}€
              </div>
              <div className="text-xs text-blue-600 mt-1">vs transport</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteResults;
