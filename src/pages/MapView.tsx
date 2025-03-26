
import React from 'react';
import { Layout } from '@/components/Layout';
import MapViewControls from '@/components/map/MapViewControls';
import Map from '@/components/Map';
import MapFeatures from '@/components/map/MapFeatures';

const MapView = () => {
  return (
    <Layout title="Carte interactive">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Carte interactive</h1>
          <p className="text-gray-600">
            Explorez les options de mobilité écologique et planifiez vos trajets de manière responsable.
          </p>
        </div>
        
        <MapViewControls />
        
        <div className="relative h-[calc(100vh-300px)] min-h-[500px] rounded-xl overflow-hidden shadow-lg mb-6">
          <Map />
        </div>
        
        <MapFeatures />
      </div>
    </Layout>
  );
};

export default MapView;
