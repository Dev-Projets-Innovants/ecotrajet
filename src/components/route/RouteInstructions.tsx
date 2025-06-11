
import React from 'react';
import { Navigation, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, MapPin } from 'lucide-react';
import { Route, formatDuration, formatDistance } from '@/services/routingService';

interface RouteInstructionsProps {
  route: Route;
}

const RouteInstructions = ({ route }: RouteInstructionsProps) => {
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
    if (type === 'start') return 'Départ';
    if (type === 'arrive') return 'Destination atteinte';
    if (instruction.includes('Dirigez-vous vers le sud')) return 'Dirigez-vous vers le sud';
    if (instruction.includes('Continuez tout droit')) return 'Continuez tout droit';
    return instruction;
  };

  return (
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
  );
};

export default RouteInstructions;
