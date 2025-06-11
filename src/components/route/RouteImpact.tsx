
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route } from '@/services/routingService';

interface RouteImpactProps {
  route: Route;
}

const RouteImpact = ({ route }: RouteImpactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          🌱 Impact positif de votre trajet à vélo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteImpact;
