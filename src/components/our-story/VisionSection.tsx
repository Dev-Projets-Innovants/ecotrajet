
import React from 'react';

export const VisionSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Notre Vision pour l'Avenir</h2>
      <p className="text-gray-700 mb-6">
        La ville de Paris a affiché des ambitions fortes en matière de réduction de l'empreinte carbone et d'amélioration de la qualité de vie urbaine. ÉcoTrajet s'inscrit parfaitement dans cette dynamique en proposant une solution numérique qui valorise et amplifie les bénéfices environnementaux de l'utilisation des Vélib', tout en créant une expérience utilisateur enrichie et engageante.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-eco-light-green rounded-lg">
          <h3 className="font-medium text-eco-green mb-2">Extension géographique</h3>
          <p className="text-sm">Après Paris, nous souhaitons déployer ÉcoTrajet dans d'autres métropoles françaises puis européennes.</p>
        </div>
        <div className="p-4 border border-eco-light-green rounded-lg">
          <h3 className="font-medium text-eco-green mb-2">Innovation continue</h3>
          <p className="text-sm">Intégration de l'intelligence artificielle pour personnaliser les recommandations et optimiser l'impact écologique.</p>
        </div>
        <div className="p-4 border border-eco-light-green rounded-lg">
          <h3 className="font-medium text-eco-green mb-2">Impact mesurable</h3>
          <p className="text-sm">Développement d'outils permettant de quantifier précisément l'impact collectif sur la réduction des émissions carbone.</p>
        </div>
      </div>
    </div>
  );
};
