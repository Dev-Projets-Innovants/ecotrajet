
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const AuthRequired: React.FC = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Connexion requise</h2>
        <p className="text-gray-600 mb-6">
          Vous devez être connecté pour gérer vos alertes Vélib'.
        </p>
        <Button onClick={() => window.location.href = '/signin'}>
          Se connecter
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthRequired;
