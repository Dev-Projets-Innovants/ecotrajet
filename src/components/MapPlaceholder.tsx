
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getStationsWithAvailability, 
  VelibStationWithAvailability 
} from '@/services/velibStationService';
import { Button } from "@/components/ui/button";
import { Bike, Navigation, ArrowRight } from 'lucide-react';

// Configuration des icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const bikeIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
  className: 'bike-marker'
});

const customIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33]
});

const LocationButton = () => {
  const map = useMapEvents({
    locationfound: (location) => {
      map.setView(location.latlng, 16);
    }
  });

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <Button 
      onClick={handleClick} 
      className="absolute bottom-4 right-4 z-[1000] bg-white border border-gray-300 shadow-md hover:bg-gray-100 text-gray-700" 
      size="sm"
    >
      <Navigation className="h-4 w-4 mr-1" />
      Me localiser
    </Button>
  );
};

const MapPlaceholder = () => {
  const [stations, setStations] = useState<VelibStationWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        // Charger un échantillon de stations pour la page d'accueil
        const velibStations = await getStationsWithAvailability({ limit: 100 });
        setStations(velibStations);
      } catch (error) {
        console.error("Erreur lors du chargement des stations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();

    // Géolocalisation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.log("Géolocalisation non disponible:", error);
      }
    );

    // Animation au défilement
    const observerOptions = {
      threshold: 0.1,
      root: null,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (mapRef.current) observer.observe(mapRef.current);

    return () => {
      if (mapRef.current) observer.unobserve(mapRef.current);
    };
  }, []);

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <section id="map" className="py-20 bg-gradient-to-br from-eco-light-blue to-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-dark-blue">
            Stations Vélib' en temps réel
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez la disponibilité des vélos Vélib' en temps réel sur Paris. 
            Données mises à jour automatiquement via notre intégration Supabase.
          </p>
        </div>

        <div 
          ref={mapRef}
          className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-on-scroll"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-eco-light-blue">
              <div className="text-center">
                <Bike className="h-12 w-12 text-eco-green mx-auto mb-4 animate-pulse" />
                <div className="text-eco-green font-medium">Chargement des stations Vélib'...</div>
              </div>
            </div>
          ) : (
            <MapContainer 
              center={userLocation || [48.856614, 2.3522219]} 
              zoom={userLocation ? 14 : 12} 
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Marqueurs des stations */}
              {stations.map((station) => (
                <Marker 
                  key={station.stationcode} 
                  position={[station.coordonnees_geo_lat, station.coordonnees_geo_lon]}
                  icon={bikeIcon}
                >
                  <Popup className="custom-popup">
                    <div className="min-w-[200px]">
                      <div className="font-semibold mb-2 text-eco-dark-blue">{station.name}</div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className={`text-lg font-bold ${getAvailabilityColor(station.numbikesavailable || 0, station.capacity)}`}>
                            {station.numbikesavailable || 0}
                          </div>
                          <div className="text-xs text-gray-500">Vélos</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className={`text-lg font-bold ${getAvailabilityColor(station.numdocksavailable || 0, station.capacity)}`}>
                            {station.numdocksavailable || 0}
                          </div>
                          <div className="text-xs text-gray-500">Places</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>🚲 {station.mechanical || 0} mécaniques</span>
                        <span>⚡ {station.ebike || 0} électriques</span>
                      </div>
                      
                      {station.last_updated && (
                        <div className="text-xs text-gray-400">
                          MAJ: {new Date(station.last_updated).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Marqueur de position utilisateur */}
              {userLocation && (
                <Marker position={userLocation} icon={customIcon}>
                  <Popup>Vous êtes ici</Popup>
                </Marker>
              )}
              
              <LocationButton />
              
              {/* Légende */}
              <div className="absolute top-4 left-4 bg-white p-3 shadow-lg rounded-lg z-[1000]">
                <div className="flex items-center space-x-2 text-sm font-medium text-eco-dark-blue">
                  <Bike className="h-4 w-4 text-eco-green" />
                  <span>Données temps réel</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {stations.length} stations affichées
                </div>
              </div>
            </MapContainer>
          )}
        </div>

        {/* Call to action */}
        <div className="text-center mt-8 animate-on-scroll">
          <p className="text-gray-600 mb-4">
            Explorez toutes les stations, créez des alertes personnalisées et gérez vos favoris
          </p>
          <Button 
            onClick={() => window.location.href = '/map'}
            className="bg-eco-green hover:bg-eco-green/90 text-white font-medium px-6 py-3"
          >
            Accéder à la carte complète
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;
