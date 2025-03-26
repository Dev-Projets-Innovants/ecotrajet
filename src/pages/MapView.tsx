
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Bike, 
  Zap, 
  Route, 
  Car, 
  Leaf, 
  Filter, 
  Search, 
  Info,
  MapPinOff,
  Locate,
  Navigation
} from 'lucide-react';
import { 
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem
} from '@/components/ui/menubar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from '@/components/Map';

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
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Rechercher une adresse..." 
                />
              </div>
              
              <Menubar className="border-none p-0 bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger className="flex items-center gap-2 bg-background border border-input px-3 py-2 h-10 rounded-md">
                    <Filter className="h-4 w-4" />
                    <span>Filtres</span>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem className="font-semibold">Points d'intérêt</MenubarItem>
                    <MenubarSeparator />
                    <MenubarCheckboxItem>
                      Stations de vélo
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                      Bornes de recharge
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                      Covoiturage
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                      Espaces verts
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                      Commerces responsables
                    </MenubarCheckboxItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Locate className="h-4 w-4" />
                <span>Ma position</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Légende</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-4">
            {/* Routes Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Point de départ" 
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPinOff className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Destination" 
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Mode de transport</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant={selectedTransportType === "walking" ? "default" : "outline"} 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setSelectedTransportType("walking")}
                    >
                      <Route className="h-4 w-4" />
                      <span>À pied</span>
                    </Button>
                    <Button 
                      variant={selectedTransportType === "bike" ? "default" : "outline"} 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setSelectedTransportType("bike")}
                    >
                      <Bike className="h-4 w-4" />
                      <span>Vélo</span>
                    </Button>
                    <Button 
                      variant={selectedTransportType === "public" ? "default" : "outline"} 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setSelectedTransportType("public")}
                    >
                      <Zap className="h-4 w-4" />
                      <span>Transport</span>
                    </Button>
                    <Button 
                      variant={selectedTransportType === "car" ? "default" : "outline"} 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setSelectedTransportType("car")}
                    >
                      <Car className="h-4 w-4" />
                      <span>Voiture</span>
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full bg-eco-green hover:bg-eco-dark-green">
                  <Navigation className="h-4 w-4 mr-2" />
                  Calculer l'itinéraire
                </Button>
                
                <div className="p-4 bg-white rounded-lg border space-y-3">
                  <div className="font-medium">Résultats de la recherche</div>
                  <div className="text-sm text-gray-500">
                    Entrez un point de départ et une destination pour voir les options d'itinéraires écologiques
                  </div>
                </div>
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
        {activeTab === "map" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <Bike className="h-5 w-5 text-eco-green" />
                <span>Vélos et trottinettes</span>
              </h3>
              <p className="text-sm text-gray-600">
                Stations de vélos en libre-service, zones de stationnement des trottinettes.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <Zap className="h-5 w-5 text-eco-green" />
                <span>Recharge électrique</span>
              </h3>
              <p className="text-sm text-gray-600">
                Bornes de recharge pour véhicules électriques, temps d'attente estimés.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <Route className="h-5 w-5 text-eco-green" />
                <span>Itinéraires verts</span>
              </h3>
              <p className="text-sm text-gray-600">
                Pistes cyclables, chemins piétons, voies réservées aux transports en commun.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <Car className="h-5 w-5 text-eco-green" />
                <span>Covoiturage et autopartage</span>
              </h3>
              <p className="text-sm text-gray-600">
                Points de rendez-vous covoiturage, stations d'autopartage, véhicules disponibles.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <MapPin className="h-5 w-5 text-eco-green" />
                <span>Points d'intérêt écologiques</span>
              </h3>
              <p className="text-sm text-gray-600">
                Espaces verts, marchés bio, commerces responsables, initiatives locales.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="flex items-center gap-2 font-medium mb-2">
                <Leaf className="h-5 w-5 text-eco-green" />
                <span>Impact environnemental</span>
              </h3>
              <p className="text-sm text-gray-600">
                Visualisez l'impact CO2 des différents modes de transport et options d'itinéraire.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MapView;
