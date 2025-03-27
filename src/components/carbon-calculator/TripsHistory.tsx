
import React from 'react';
import { Trip } from '@/pages/CarbonCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';

interface TripsHistoryProps {
  trips: Trip[];
  getTransportIcon: (type: string) => JSX.Element;
  getTransportLabel: (type: string) => string;
}

const TripsHistory: React.FC<TripsHistoryProps> = ({ 
  trips,
  getTransportIcon,
  getTransportLabel
}) => {
  if (trips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des trajets</CardTitle>
          <CardDescription>Vos trajets enregistrés apparaîtront ici</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Leaf className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Vous n'avez pas encore enregistré de trajets.</p>
          <p className="text-gray-500 mt-2">Utilisez l'onglet "Ajouter un trajet" pour commencer à suivre votre empreinte carbone.</p>
        </CardContent>
      </Card>
    );
  }

  const sortedTrips = [...trips].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des trajets</CardTitle>
          <CardDescription>Vos {trips.length} trajets enregistrés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedTrips.map((trip) => (
            <div key={trip.id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {getTransportIcon(trip.transportType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{format(trip.date, 'dd MMMM yyyy', { locale: fr })}</span>
                    <Badge variant="outline" className="text-xs">
                      {getTransportLabel(trip.transportType)}
                    </Badge>
                    {trip.isCarpool && (
                      <Badge variant="secondary" className="text-xs">
                        Covoiturage ({trip.passengerCount} pers.)
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {trip.distance} km
                    {trip.notes && <span> - {trip.notes}</span>}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-1">
                <Leaf className="h-4 w-4 text-eco-green" />
                <span className={`font-medium ${trip.emissions === 0 ? 'text-green-500' : ''}`}>
                  {trip.emissions.toFixed(2)} kg CO₂
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripsHistory;
