
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, formatDuration, formatDistance } from '@/services/routingService';
import { Clock, MapPin, Navigation, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, Bike, AlertTriangle, Info } from 'lucide-react';

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

  const getDirectionIcon = (type: string) => {
    switch (type) {
      case 'start': return <ArrowUp className="h-4 w-4 text-eco-green" />;
      case 'arrive': return <MapPin className="h-4 w-4 text-eco-green" />;
      case 'turn-left': return <ArrowLeft className="h-4 w-4 text-gray-600" />;
      case 'turn-right': return <ArrowRight className="h-4 w-4 text-gray-600" />;
      case 'continue': return <ArrowUp className="h-4 w-4 text-gray-600" />;
      case 'turn-slight-left': return <ArrowUpLeft className="h-4 w-4 text-gray-600" />;
      case 'turn-slight-right': return <ArrowUpRight className="h-4 w-4 text-gray-600" />;
      default: return <ArrowUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const simplifyInstruction = (instruction: string, type: string) => {
    // Simplifier les instructions pour qu'elles soient plus directes
    if (type === 'start') return 'Départ';
    if (type === 'arrive') return 'Destination atteinte';
    if (instruction.includes('Dirigez-vous vers le sud')) return 'Dirigez-vous vers le sud';
    if (instruction.includes('Continuez tout droit')) return 'Continuez tout droit';
    return instruction;
  };

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
          {/* Résumé global style Google Maps */}
          <div className="mb-6 p-4 bg-eco-green/5 rounded-lg border border-eco-green/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-eco-green/10 text-eco-green">
                  🚲 Vélo
                </Badge>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-eco-green" />
                  {formatDuration(route.duration)}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-eco-green" />
                  {formatDistance(route.distance)}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{route.summary}</p>
          </div>
          
          {/* Instructions style Google Maps - liste simple */}
          <div className="space-y-2 mb-6">
            <h4 className="font-medium text-lg flex items-center gap-2 mb-4">
              <Navigation className="h-5 w-5 text-eco-green" />
              Instructions
            </h4>
            <div className="space-y-3">
              {route.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    {getDirectionIcon(step.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">
                      {simplifyInstruction(step.instruction, step.type)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistance(step.distance)} • {formatDuration(step.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conseils de sécurité - plus discrets */}
          <details className="mb-6">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-amber-700 hover:text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Conseils de sécurité vélo
            </summary>
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Portez un casque et des vêtements visibles</li>
                <li>• Vérifiez vos freins et votre éclairage</li>
                <li>• Respectez le code de la route et les pistes cyclables</li>
                <li>• Restez vigilant aux ouvertures de portières</li>
              </ul>
            </div>
          </details>

          {/* Navigation vocale - plus compacte */}
          <div className="p-3 bg-eco-green/5 rounded-lg border border-eco-green/20">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-eco-green flex-shrink-0" />
              <div>
                <span className="font-medium text-eco-green text-sm">Navigation vocale : </span>
                <span className="text-sm text-gray-600">
                  Activez la lecture d'écran pour entendre les instructions.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact écologique - inchangé */}
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
