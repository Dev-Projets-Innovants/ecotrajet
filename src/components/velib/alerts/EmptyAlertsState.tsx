
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MapPin } from 'lucide-react';

const EmptyAlertsState: React.FC = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucune alerte configurée</h2>
        <p className="text-gray-600 mb-6">
          Visitez une station sur la carte pour créer votre première alerte.
        </p>
        <Button onClick={() => window.location.href = '/map'}>
          <MapPin className="h-4 w-4 mr-2" />
          Aller à la carte
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAlertsState;
