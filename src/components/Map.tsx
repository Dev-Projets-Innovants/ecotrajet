
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getVelibStations, VelibStation, startAutoRefresh } from '@/services/velibService';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Bike, Navigation, MapPin, Search, Layers } from 'lucide-react';

// Correction pour les icônes Leaflet (problème connu)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Styles personnalisés pour l'icône de marker
const customIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône personnalisée pour les vélos (couleur verte)
const bikeIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'bike-marker' // Classe CSS pour personnalisation
});

// Composant pour géolocaliser l'utilisateur
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

// Composant pour sauvegarder la position et le zoom de la carte
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

const MapPreview = () => {
  const [stations, setStations] = useState<VelibStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [initialMapState, setInitialMapState] = useState<{center: [number, number], zoom: number}>({
    center: [48.856614, 2.3522219], // Paris par défaut
    zoom: 13
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Récupération de l'état sauvegardé de la carte
    const savedState = localStorage.getItem('mapState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setInitialMapState(state);
      } catch (e) {
        console.error("Erreur lors de la lecture de l'état de la carte:", e);
      }
    }

    // Animation au scroll
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
    if (animationRef.current) observer.observe(animationRef.current);

    // Charger les stations Vélib'
    const loadStations = async () => {
      setIsLoading(true);
      try {
        const velibStations = await getVelibStations({limit: 150});
        setStations(velibStations);
      } catch (error) {
        console.error("Erreur lors du chargement des stations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les stations Vélib'. Réessayez plus tard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();

    // Configurer le rafraîchissement automatique des données
    const stopAutoRefresh = startAutoRefresh(setStations);

    // Géolocaliser l'utilisateur
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        // Si aucun état sauvegardé, centrer sur l'utilisateur
        if (!savedState) {
          setInitialMapState({
            center: [latitude, longitude],
            zoom: 15
          });
        }
      },
      (error) => {
        console.log("Erreur de géolocalisation:", error);
        // On utilise Paris par défaut (déjà configuré dans initialMapState)
      }
    );

    return () => {
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (animationRef.current) observer.unobserve(animationRef.current);
      stopAutoRefresh();
    };
  }, []);

  return (
    <section id="map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Carte Interactive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trouvez facilement les options écologiques</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Localisez en temps réel les stations Vélib', les bornes de recharge électrique et planifiez vos trajets écologiques.
          </p>
        </div>
        
        <div 
          ref={mapRef}
          className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-on-scroll"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-eco-light-blue">
              <div className="text-eco-green">Chargement de la carte...</div>
            </div>
          ) : (
            <MapContainer 
              center={initialMapState.center} 
              zoom={initialMapState.zoom} 
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              zoomControl={false}
              attributionControl={false}
            >
              {/* Couche de carte principale */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
              />
              
              {/* Stations Vélib */}
              {stations.map((station) => (
                <Marker 
                  key={station.stationcode} 
                  position={[station.coordonnees_geo.lat, station.coordonnees_geo.lon]}
                  icon={bikeIcon}
                >
                  <Popup>
                    <div className="font-medium mb-1">{station.name}</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {station.numbikesavailable} vélos disponibles
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-eco-green"></div>
                        <span>{station.mechanical} mécaniques</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-eco-blue"></div>
                        <span>{station.ebike} électriques</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.numdocksavailable} emplacements libres
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Marqueur de position de l'utilisateur */}
              {userLocation && (
                <Marker position={userLocation} icon={customIcon}>
                  <Popup>
                    Vous êtes ici
                  </Popup>
                </Marker>
              )}
              
              {/* Contrôles personnalisés */}
              <ZoomControl position="topright" />
              <LocationButton />
              <SaveMapState />
              
              {/* Légende */}
              <div className="absolute top-4 right-4 bg-white p-3 shadow-md rounded-lg z-[1000] text-sm">
                <div className="flex items-center space-x-2 font-medium">
                  <Bike className="h-4 w-4 text-eco-green" />
                  <span>Vélib disponibles</span>
                </div>
              </div>
            </MapContainer>
          )}
        </div>
        
        <div 
          ref={animationRef}
          className="text-center mt-8 animate-on-scroll"
        >
          <p className="text-sm text-gray-500">
            Données mises à jour en temps réel. Inscrivez-vous pour accéder à plus de fonctionnalités.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
