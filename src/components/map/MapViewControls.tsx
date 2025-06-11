
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapControls from './MapControls';
import RouteForm from './RouteForm';
import SupabaseMap from '@/components/SupabaseMap';

interface MapViewControlsProps {
  onTabChange?: (tab: string) => void;
}

const MapViewControls = ({ onTabChange }: MapViewControlsProps) => {
  const [activeTab, setActiveTab] = useState("map");
  const [selectedTransportType, setSelectedTransportType] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs 
      defaultValue="map" 
      className="mb-6" 
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="map">Carte Vélib'</TabsTrigger>
        <TabsTrigger value="routes">Itinéraires</TabsTrigger>
      </TabsList>
      
      <TabsContent value="map" className="space-y-4">
        <div className="bg-white rounded-xl shadow-lg">
          <SupabaseMap />
        </div>
      </TabsContent>
      
      <TabsContent value="routes" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <RouteForm 
              selectedTransportType={selectedTransportType}
              setSelectedTransportType={setSelectedTransportType}
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="relative rounded-xl overflow-hidden h-[600px]">
              <SupabaseMap />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MapViewControls;
