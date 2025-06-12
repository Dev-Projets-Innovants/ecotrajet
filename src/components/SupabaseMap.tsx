import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getStationsWithAvailability, 
  triggerVelibSync,
  VelibStationWithAvailability
} from '@/services/velibStationService';
import { subscribeToStationUpdates } from '@/services/velibRealtimeService';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bike, Navigation, RefreshCw } from 'lucide-react';
import VelibStationDetails from './velib/VelibStationDetails';
import VelibStationSearch from './velib/VelibStationSearch';

// Configuration des icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bikeIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'bike-marker'
});

const LocationButton = () => {
  const map = useMap();
  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <Button 
      onClick={handleClick} 
      className="absolute bottom-20 right-2 z-[1000] bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" 
      size="icon"
    >
      <Navigation className="h-5 w-5" />
    </Button>
  );
};

const SyncButton = ({ onSync, isLoading }: { onSync: () => void; isLoading: boolean }) => {
  return (
    <Button 
      onClick={onSync}
      disabled={isLoading}
      className="absolute bottom-32 right-2 z-[1000] bg-blue-600 hover:bg-blue-700 text-white" 
      size="icon"
    >
      <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
    </Button>
  );
};

const SaveMapState = () => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      localStorage.setItem('mapState', JSON.stringify({
        center: [center.lat, center.lng],
        zoom
      }));
    }
  });
  return null;
};

// Composant pour centrer la carte sur une station
const MapController = ({ station }: { station: VelibStationWithAvailability | null }) => {
  const map = useMap();

  useEffect(() => {
    if (station) {
      map.setView([station.coordonnees_geo_lat, station.coordonnees_geo_lon], 16, {
        animate: true,
        duration: 1
      });
    }
  }, [station, map]);

  return null;
};

const SupabaseMap = () => {
  const [stations, setStations] = useState<VelibStationWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedStation, setSelectedStation] = useState<VelibStationWithAvailability | null>(null);
  const [initialMapState, setInitialMapState] = useState<{center: [number, number], zoom: number}>({
    center: [48.856614, 2.3522219],
    zoom: 13
  });
  
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restaurer l'état de la carte
    const savedState = localStorage.getItem('mapState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setInitialMapState(state);
      } catch (e) {
        console.error("Erreur lors de la lecture de l'état de la carte:", e);
      }
    }

    // Charger les stations depuis Supabase
    loadStationsFromSupabase();

    // Géolocalisation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (!savedState) {
          setInitialMapState({
            center: [latitude, longitude],
            zoom: 15
          });
        }
      },
      (error) => {
        console.log("Erreur de géolocalisation:", error);
      }
    );

    // S'abonner aux mises à jour en temps réel de toutes les stations
    const subscription = subscribeToStationUpdates('*', (payload) => {
      console.log('Real-time station update:', payload);
      // Recharger les données quand il y a des mises à jour
      loadStationsFromSupabase();
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadStationsFromSupabase = async () => {
    setIsLoading(true);
    try {
      const velibStations = await getStationsWithAvailability({ limit: 500 });
      setStations(velibStations);
      
      if (velibStations.length === 0) {
        toast({
          title: "Aucune donnée",
          description: "Aucune station trouvée. Essayez de synchroniser les données.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les stations depuis la base de données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const success = await triggerVelibSync();
      if (success) {
        // Recharger les données après la synchronisation
        setTimeout(() => {
          loadStationsFromSupabase();
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStationSelect = (station: VelibStationWithAvailability) => {
    setSelectedStation(station);
  };

  return (
    <section id="supabase-map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Carte Vélib' temps réel
            </h2>
            <p className="text-gray-600">
              {stations.length} stations • Données en temps réel via Supabase
            </p>
          </div>
          
          <Button 
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-eco-green hover:bg-eco-green/90"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <VelibStationSearch 
            stations={stations}
            onStationSelect={handleStationSelect}
            selectedStation={selectedStation}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2">
            <div 
              ref={mapRef}
              className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-eco-light-blue">
                  <div className="text-eco-green">Chargement des données Supabase...</div>
                </div>
              ) : (
                <MapContainer 
                  center={initialMapState.center} 
                  zoom={initialMapState.zoom} 
                  style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                  />
                  
                  {/* Contrôleur de carte pour centrer sur la station sélectionnée */}
                  <MapController station={selectedStation} />
                  
                  {stations.map((station) => (
                    <Marker 
                      key={station.stationcode} 
                      position={[station.coordonnees_geo_lat, station.coordonnees_geo_lon]}
                      icon={bikeIcon}
                      eventHandlers={{
                        click: () => setSelectedStation(station)
                      }}
                    >
                      <Popup>
                        <div className="font-medium mb-1">{station.name}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {station.numbikesavailable || 0} vélos disponibles
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-eco-green"></div>
                            <span>{station.mechanical || 0} mécaniques</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-eco-blue"></div>
                            <span>{station.ebike || 0} électriques</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {station.numdocksavailable || 0} emplacements libres
                        </div>
                        {station.last_updated && (
                          <div className="text-xs text-gray-400 mt-1">
                            MAJ: {new Date(station.last_updated).toLocaleTimeString()}
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  ))}
                  
                  {userLocation && (
                    <Marker position={userLocation} icon={customIcon}>
                      <Popup>Vous êtes ici</Popup>
                    </Marker>
                  )}
                  
                  <ZoomControl position="topright" />
                  <LocationButton />
                  <SyncButton onSync={handleSync} isLoading={isSyncing} />
                  <SaveMapState />
                  
                  <div className="absolute top-4 right-4 bg-white p-3 shadow-md rounded-lg z-[1000] text-sm">
                    <div className="flex items-center space-x-2 font-medium">
                      <Bike className="h-4 w-4 text-eco-green" />
                      <span>Temps réel Supabase</span>
                    </div>
                  </div>
                </MapContainer>
              )}
            </div>
          </div>

          {/* Panneau de détails */}
          <div className="lg:col-span-1">
            {selectedStation ? (
              <VelibStationDetails station={selectedStation} />
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rechercher ou sélectionner une station</h3>
                <p className="text-gray-600 mb-4">
                  Utilisez la barre de recherche ci-dessus ou cliquez sur une station sur la carte pour voir ses détails et créer des alertes.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Recherche par nom ou arrondissement</div>
                  <div>• Données en temps réel</div>
                  <div>• Alertes personnalisées</div>
                  <div>• Stations favorites</div>
                  <div>• Historique des disponibilités</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupabaseMap;
