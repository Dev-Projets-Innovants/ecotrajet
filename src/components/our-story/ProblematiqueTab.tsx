
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon } from 'lucide-react';

export const ProblematiqueTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5 text-eco-green" />
          Problématique Identifiée
        </CardTitle>
        <CardDescription>
          Les défis que nous adressons dans l'écosystème Vélib'
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
            <h3 className="font-semibold text-lg mb-2 text-orange-800">Absence de dimension écologique</h3>
            <p className="text-sm text-orange-700">
              Les applications existantes se concentrent uniquement sur l'aspect pratique (localisation, disponibilité) sans mettre en valeur ni quantifier l'impact environnemental positif de chaque trajet. Cette absence prive les utilisateurs d'une source importante de motivation et de satisfaction.
            </p>
          </div>
          
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
            <h3 className="font-semibold text-lg mb-2 text-blue-800">Manque d'engagement communautaire</h3>
            <p className="text-sm text-blue-700">
              L'utilisation des Vélib' reste une expérience individuelle, sans partage ni émulation collective qui pourraient renforcer l'adoption et la fidélisation.
            </p>
          </div>
          
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/50">
            <h3 className="font-semibold text-lg mb-2 text-purple-800">Difficulté à quantifier l'impact positif</h3>
            <p className="text-sm text-purple-700">
              Les utilisateurs n'ont aucun moyen de mesurer concrètement leur contribution environnementale, ce qui diminue le sentiment d'accomplissement et la perception de la valeur ajoutée de ce mode de transport.
            </p>
          </div>
          
          <div className="border border-red-200 rounded-lg p-4 bg-red-50/50">
            <h3 className="font-semibold text-lg mb-2 text-red-800">Motivation insuffisante</h3>
            <p className="text-sm text-red-700">
              L'absence de mécanismes de récompense et de reconnaissance limite l'engagement à long terme des utilisateurs et freine le développement de comportements vertueux durables. Les utilisateurs manquent de reconnaissance tangible et de stimulation continue pour transformer leurs actions ponctuelles en habitudes quotidiennes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
