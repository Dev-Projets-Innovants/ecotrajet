
import React from 'react';

const AlertsHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Mes alertes Vélib'</h1>
      <p className="text-gray-600">
        Gérez vos notifications email pour les stations Vélib' qui vous intéressent.
      </p>
    </div>
  );
};

export default AlertsHeader;
