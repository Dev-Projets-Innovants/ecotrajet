
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getVelibStations, VelibStation, startAutoRefresh } from '@/services/velibService';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Bike, Navigation, MapPin, Search, Layers } from 'lucide-react';

/**
 * Composant Map.tsx
 * 
 * Ce composant implémente une carte interactive Leaflet qui affiche les stations
 * Vélib' disponibles à Paris. Il permet à l'utilisateur de visualiser les stations,
 * leur disponibilité, et de se géolocaliser sur la carte.
 * 
 * Fonctionnalités principales:
 * - Affichage des stations Vélib' avec marqueurs personnalisés
 * - Informations détaillées sur chaque station (vélos disponibles, emplacements)
 * - Géolocalisation de l'utilisateur
 * - Sauvegarde de l'état de la carte (position, zoom)
 * - Rafraîchissement automatique des données en temps réel
 */

// Correction pour les icônes Leaflet (problème connu)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Configuration des icônes personnalisées pour les marqueurs de la carte
 * Leaflet nécessite une configuration spéciale pour les icônes en environnement React
 */

// Icône standard pour le marqueur de position de l'utilisateur
const customIcon = new L.Icon({
  iconUrl: icon,                  // URL de l'image de l'icône
  shadowUrl: iconShadow,          // URL de l'ombre de l'icône
  iconSize: [25, 41],             // Taille de l'icône en pixels [largeur, hauteur]
  iconAnchor: [12, 41],           // Point d'ancrage de l'icône (point qui correspond à la position exacte)
  popupAnchor: [1, -34],          // Position de la popup par rapport au point d'ancrage
  shadowSize: [41, 41]            // Taille de l'ombre en pixels
});

// Icône personnalisée pour les stations de vélos (même configuration mais avec une classe CSS différente)
const bikeIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'bike-marker'        // Classe CSS pour permettre la personnalisation de l'apparence via CSS
});

/**
 * Composant LocationButton
 * 
 * Bouton permettant à l'utilisateur de se géolocaliser sur la carte.
 * Utilise le hook useMap() de React-Leaflet pour accéder à l'instance de la carte.
 */
const LocationButton = () => {
  const map = useMap();  // Récupère l'instance de la carte Leaflet grâce au contexte React-Leaflet

  // Fonction appelée lors du clic sur le bouton
  const handleClick = () => {
    // Demande la géolocalisation et centre la carte sur la position de l'utilisateur avec un zoom de 16
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

/**
 * Composant SaveMapState
 * 
 * Sauvegarde automatiquement l'état de la carte (position et niveau de zoom)
 * dans le localStorage lorsque l'utilisateur déplace la carte.
 * Utilise useMapEvents pour écouter les événements de la carte.
 */
const SaveMapState = () => {
  // Écoute l'événement 'moveend' déclenché lorsque l'utilisateur arrête de déplacer la carte
  const map = useMapEvents({
    moveend: () => {
      // Récupère le centre actuel de la carte et le niveau de zoom
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      // Sauvegarde ces données dans le localStorage pour les restaurer ultérieurement
      localStorage.setItem('mapState', JSON.stringify({
        center: [center.lat, center.lng],
        zoom
      }));
    }
  });

  return null;  // Ce composant n'a pas de rendu visuel, il travaille uniquement avec les événements
};

/**
 * Composant principal MapPreview
 * 
 * Affiche une carte interactive avec les stations Vélib, permet à l'utilisateur
 * de se géolocaliser et sauvegarde l'état de la carte.
 * Gère également le chargement des données et leur rafraîchissement automatique.
 */
const MapPreview = () => {
  // Gestion de l'état local du composant
  const [stations, setStations] = useState<VelibStation[]>([]);              // Liste des stations Vélib
  const [isLoading, setIsLoading] = useState(true);                          // État de chargement
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);  // Position de l'utilisateur
  const [initialMapState, setInitialMapState] = useState<{center: [number, number], zoom: number}>({
    center: [48.856614, 2.3522219], // Position par défaut (centre de Paris)
    zoom: 13                        // Niveau de zoom par défaut
  });
  
  // Références pour les animations et la carte
  const mapRef = useRef<HTMLDivElement>(null);        // Référence à l'élément DOM de la carte
  const animationRef = useRef<HTMLDivElement>(null);  // Référence pour l'animation

  useEffect(() => {
    // Récupération de l'état sauvegardé de la carte depuis le localStorage
    const savedState = localStorage.getItem('mapState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setInitialMapState(state);  // Restaure l'état sauvegardé
      } catch (e) {
        console.error("Erreur lors de la lecture de l'état de la carte:", e);
      }
    }

    /**
     * Configuration de l'animation au défilement (intersection observer)
     * Ajoute une classe 'visible' aux éléments lorsqu'ils deviennent visibles dans le viewport
     */
    const observerOptions = {
      threshold: 0.1,       // Déclenche l'animation quand 10% de l'élément est visible
      root: null,           // Utilise le viewport comme zone d'observation
      rootMargin: '0px'     // Pas de marge supplémentaire
    };

    // Crée un observateur qui ajoute la classe 'visible' aux éléments qui entrent dans la vue
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');  // Ajoute la classe pour l'animation
          observer.unobserve(entry.target);       // Arrête d'observer une fois l'animation déclenchée
        }
      });
    }, observerOptions);

    // Observe les éléments référencés pour l'animation
    if (mapRef.current) observer.observe(mapRef.current);
    if (animationRef.current) observer.observe(animationRef.current);

    /**
     * Fonction asynchrone pour charger les stations Vélib
     * Récupère les données via l'API et met à jour l'état local
     */
    const loadStations = async () => {
      setIsLoading(true);
      try {
        // Appel à l'API pour récupérer les stations (limité à 150)
        const velibStations = await getVelibStations({limit: 150});
        setStations(velibStations);
      } catch (error) {
        console.error("Erreur lors du chargement des stations:", error);
        // Affiche une notification d'erreur à l'utilisateur
        toast({
          title: "Erreur",
          description: "Impossible de charger les stations Vélib'. Réessayez plus tard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);  // Termine le chargement quel que soit le résultat
      }
    };

    // Charge les stations au montage du composant
    loadStations();

    // Configure le rafraîchissement automatique des données
    const stopAutoRefresh = startAutoRefresh(setStations);

    /**
     * Géolocalisation de l'utilisateur via l'API Navigator
     * Centre la carte sur l'utilisateur s'il n'y a pas d'état sauvegardé
     */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Récupère les coordonnées depuis l'API de géolocalisation
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        // Si aucun état sauvegardé, centre la carte sur l'utilisateur
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

    // Nettoyage lors du démontage du composant
    return () => {
      // Arrête d'observer les éléments pour éviter les fuites mémoire
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (animationRef.current) observer.unobserve(animationRef.current);
      // Arrête le rafraîchissement automatique des données
      stopAutoRefresh();
    };
  }, []);  // Tableau de dépendances vide = exécution uniquement au montage et démontage

  return (
    <section id="map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Conteneur principal de la carte avec animation au défilement */}
        <div 
          ref={mapRef}
          className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-on-scroll"
        >
          {/* Affiche un écran de chargement pendant le chargement des données */}
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-eco-light-blue">
              <div className="text-eco-green">Chargement de la carte...</div>
            </div>
          ) : (
            // Composant MapContainer de React-Leaflet pour afficher la carte
            <MapContainer 
              center={initialMapState.center} 
              zoom={initialMapState.zoom} 
              style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
              zoomControl={false}         // Désactive les contrôles de zoom par défaut
              attributionControl={false}  // Désactive l'attribution par défaut
            >
              {/* Couche de carte principale (tuiles OpenStreetMap) */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
              />
              
              {/* Marqueurs pour chaque station Vélib valide (avec coordonnées) */}
              {stations
                .filter(station => station.coordonnees_geo && station.coordonnees_geo.lat && station.coordonnees_geo.lon)
                .map((station) => (
                  <Marker 
                    key={station.stationcode} 
                    position={[station.coordonnees_geo.lat, station.coordonnees_geo.lon]}
                    icon={bikeIcon}  // Utilise l'icône personnalisée pour les vélos
                  >
                    {/* Popup affichant les détails de la station au clic */}
                    <Popup>
                      <div className="font-medium mb-1">{station.name || 'Station Vélib'}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {station.numbikesavailable} vélos disponibles
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
                        {station.numdocksavailable} emplacements libres
                      </div>
                    </Popup>
                  </Marker>
                ))}
              
              {/* Marqueur de position de l'utilisateur (si disponible) */}
              {userLocation && (
                <Marker position={userLocation} icon={customIcon}>
                  <Popup>
                    Vous êtes ici
                  </Popup>
                </Marker>
              )}
              
              {/* Contrôles personnalisés */}
              <ZoomControl position="topright" />  {/* Contrôles de zoom en haut à droite */}
              <LocationButton />  {/* Bouton de géolocalisation personnalisé */}
              <SaveMapState />    {/* Composant de sauvegarde de l'état de la carte */}
              
              {/* Légende de la carte (fixe en haut à droite) */}
              <div className="absolute top-4 right-4 bg-white p-3 shadow-md rounded-lg z-[1000] text-sm">
                <div className="flex items-center space-x-2 font-medium">
                  <Bike className="h-4 w-4 text-eco-green" />
                  <span>Vélib disponibles</span>
                </div>
              </div>
            </MapContainer>
          )}
        </div>
        
        {/* Pied de page avec animation au défilement */}
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
