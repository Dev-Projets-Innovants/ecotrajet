
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Bike } from 'lucide-react';
import { Route, formatDuration, formatDistance } from '@/services/routingService';

interface RouteSummaryProps {
  route: Route;
}

const RouteSummary = ({ route }: RouteSummaryProps) => {
  return (
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
  );
};

export default RouteSummary;
