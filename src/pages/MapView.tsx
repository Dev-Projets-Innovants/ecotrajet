
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from '@/components/Map';
import MapControls from '@/components/map/MapControls';
import MapFeatures from '@/components/map/MapFeatures';
import RouteForm from '@/components/map/RouteForm';

const MapView = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedTransportType, setSelectedTransportType] = useState<string | null>(null);
  
  return (
    <Layout title="Carte interactive">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Carte interactive</h1>
          <p className="text-gray-600">
            Explorez les options de mobilité écologique et planifiez vos trajets de manière responsable.
          </p>
        </div>
        
        <Tabs defaultValue="map" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="map">Carte</TabsTrigger>
            <TabsTrigger value="routes">Itinéraires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            {/* Map View Controls */}
            <MapControls />
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-4">
            {/* Routes Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <RouteForm 
                  selectedTransportType={selectedTransportType}
                  setSelectedTransportType={setSelectedTransportType}
                />
              </div>
              
              <div className="md:col-span-2">
                {/* This will be where the map shows with the route */}
                <div className="relative rounded-xl overflow-hidden h-[600px]">
                  <Map />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Map Container */}
        {activeTab === "map" && (
          <div className="relative h-[calc(100vh-300px)] min-h-[500px] rounded-xl overflow-hidden shadow-lg mb-6">
            <Map />
          </div>
        )}
        
        {/* Legend and Features */}
        {activeTab === "map" && <MapFeatures />}
      </div>
    </Layout>
  );
};

export default MapView;
