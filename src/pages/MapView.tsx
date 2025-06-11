
import React from 'react';
import { Layout } from '@/components/Layout';
import MapViewControls from '@/components/map/MapViewControls';

const MapView = () => {
  return (
    <Layout title="Carte Vélib' temps réel">
      <div className="min-h-screen bg-gradient-to-br from-eco-light-blue to-white">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-eco-dark-blue">
              Carte interactive Vélib'
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez les stations Vélib' en temps réel, créez des alertes personnalisées 
              et planifiez vos trajets écologiques à Paris.
            </p>
          </div>
          
          <MapViewControls />
        </div>
      </div>
    </Layout>
  );
};

export default MapView;
