
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TargetIcon } from 'lucide-react';

export const ObjectifsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TargetIcon className="h-5 w-5 text-eco-green" />
          Nos Objectifs
        </CardTitle>
        <CardDescription>
          Des ambitions précises pour transformer la mobilité urbaine parisienne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-xl mb-4 text-eco-green flex items-center gap-2">
              <span className="bg-eco-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
              Objectifs Quantitatifs
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-eco-green pl-4">
                <p className="font-medium">500 utilisateurs actifs</p>
                <p className="text-sm text-muted-foreground">Dans les 6 premiers mois suivant le lancement</p>
              </div>
              <div className="border-l-4 border-eco-green pl-4">
                <p className="font-medium">10% de réduction d'empreinte carbone</p>
                <p className="text-sm text-muted-foreground">En moyenne pour les déplacements urbains des utilisateurs</p>
              </div>
              <div className="border-l-4 border-eco-green pl-4">
                <p className="font-medium">40% de taux de rétention</p>
                <p className="text-sm text-muted-foreground">Après 3 mois d'utilisation, témoignant de la valeur ajoutée réelle perçue</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-xl mb-4 text-eco-green flex items-center gap-2">
              <span className="bg-eco-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
              Objectifs Qualitatifs
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-eco-light-green pl-4">
                <p className="font-medium">Créer une communauté engagée</p>
                <p className="text-sm text-muted-foreground">Transformer l'usage individuel en mouvement collectif pour la mobilité verte</p>
              </div>
              <div className="border-l-4 border-eco-light-green pl-4">
                <p className="font-medium">Sensibiliser efficacement</p>
                <p className="text-sm text-muted-foreground">À l'impact environnemental des choix de transport quotidiens</p>
              </div>
              <div className="border-l-4 border-eco-light-green pl-4">
                <p className="font-medium">Améliorer l'expérience utilisateur</p>
                <p className="text-sm text-muted-foreground">Des services Vélib' par une interface intuitive et agréable</p>
              </div>
              <div className="border-l-4 border-eco-light-green pl-4">
                <p className="font-medium">Développer des partenariats</p>
                <p className="text-sm text-muted-foreground">Avec la ville de Paris et les acteurs clés de la mobilité urbaine</p>
              </div>
              <div className="border-l-4 border-eco-light-green pl-4">
                <p className="font-medium">Devenir la référence</p>
                <p className="text-sm text-muted-foreground">Dans le domaine des applications de mobilité durable</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
