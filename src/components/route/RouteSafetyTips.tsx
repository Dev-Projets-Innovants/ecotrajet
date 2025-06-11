
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const RouteSafetyTips = () => {
  return (
    <details className="mb-6">
      <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-amber-700 hover:text-amber-800">
        <AlertTriangle className="h-4 w-4" />
        Conseils de sécurité vélo
      </summary>
      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Portez un casque et des vêtements visibles</li>
          <li>• Vérifiez vos freins et votre éclairage</li>
          <li>• Respectez le code de la route et les pistes cyclables</li>
          <li>• Restez vigilant aux ouvertures de portières</li>
        </ul>
      </div>
    </details>
  );
};

export default RouteSafetyTips;
