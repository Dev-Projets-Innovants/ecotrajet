
import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ModerationWarning: React.FC = () => {
  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-orange-800 mb-2">
              Règles de la communauté ÉcoTrajet
            </h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                <strong>Respectez autrui :</strong> Les messages sexistes, racistes, homophobes, 
                ou toute forme de discrimination ne sont pas tolérés.
              </p>
              <p>
                <strong>Restez constructif :</strong> Évitez les attaques personnelles, 
                les propos diffamatoires ou les contenus offensants.
              </p>
              <p>
                <strong>Partagez responsable :</strong> Assurez-vous que vos publications 
                respectent la vie privée d'autrui et les droits d'auteur.
              </p>
              <p className="text-xs mt-2 pt-2 border-t border-orange-200">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Les contenus inappropriés sont modérés et peuvent entraîner 
                la suppression du message ou la suspension du compte.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationWarning;
