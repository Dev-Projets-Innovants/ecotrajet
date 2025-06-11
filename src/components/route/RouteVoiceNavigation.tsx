
import React from 'react';
import { Info } from 'lucide-react';

const RouteVoiceNavigation = () => {
  return (
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
  );
};

export default RouteVoiceNavigation;
