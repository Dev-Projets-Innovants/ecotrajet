
import React from 'react';
import { Layout } from '@/components/Layout';
import SupabaseMap from '@/components/SupabaseMap';

const MapView = () => {
  return (
    <Layout title="Carte Vélib' temps réel">
      <div className="min-h-screen bg-gray-50">
        <SupabaseMap />
      </div>
    </Layout>
  );
};

export default MapView;
