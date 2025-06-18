
export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  type: string;
}

export interface Route {
  coordinates: RouteCoordinate[];
  distance: number; // en mètres
  duration: number; // en secondes
  steps: RouteStep[];
  summary: string;
}

export interface RouteOptions {
  profile: 'driving-car' | 'cycling-regular' | 'foot-walking' | 'public-transport';
  preference?: 'fastest' | 'shortest' | 'recommended';
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  display_name: string;
  place_id: string;
  is_fallback?: boolean;
}

// Fonction pour géocoder une adresse (convertir adresse en coordonnées)
export async function geocodeAddress(address: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Paris&limit=5&countrycodes=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage');
    }
    
    const results = await response.json();
    
    const geocodedResults = results.map((result: any) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
      place_id: result.place_id,
      is_fallback: false
    }));

    // Si aucun résultat trouvé, essayer sans spécifier Paris
    if (geocodedResults.length === 0) {
      console.log('Aucun résultat trouvé avec Paris, essai sans restriction géographique...');
      const fallbackResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
      );
      
      if (fallbackResponse.ok) {
        const fallbackResults = await fallbackResponse.json();
        const fallbackGeocodedResults = fallbackResults.map((result: any) => ({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          display_name: result.display_name + " (recherche élargie)",
          place_id: result.place_id,
          is_fallback: true
        }));
        
        return fallbackGeocodedResults;
      }
    }
    
    return geocodedResults;
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    throw new Error('Impossible de trouver cette adresse');
  }
}

// Nouvelle fonction pour créer une adresse fallback basée sur le texte saisi
export function createFallbackAddress(addressText: string): GeocodingResult {
  // Coordonnées par défaut : centre de Paris (Notre-Dame)
  return {
    lat: 48.8566,
    lng: 2.3522,
    display_name: `${addressText} (recherche approximative dans Paris)`,
    place_id: `fallback-${Date.now()}`,
    is_fallback: true
  };
}

// Fonction pour calculer un itinéraire
export async function calculateRoute(
  start: RouteCoordinate,
  end: RouteCoordinate,
  options: RouteOptions = { profile: 'foot-walking' }
): Promise<Route> {
  try {
    // Utilisation d'OpenRouteService (API gratuite)
    const baseUrl = 'https://api.openrouteservice.org/v2/directions';
    const coordinates = `${start.lng},${start.lat}|${end.lng},${end.lat}`;
    
    // Note: Pour une utilisation en production, il faudrait une clé API
    // Pour le moment, on utilise l'API publique avec des limitations
    const url = `${baseUrl}/${options.profile}?start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    
    // Simulation d'une réponse pour l'instant (car l'API nécessite une clé)
    const mockRoute: Route = {
      coordinates: [
        start,
        { lat: (start.lat + end.lat) / 2, lng: (start.lng + end.lng) / 2 },
        end
      ],
      distance: Math.floor(getDistance(start, end) * 1000), // en mètres
      duration: Math.floor(getDistance(start, end) * 1000 / 1.4), // vitesse de marche moyenne
      steps: [
        {
          instruction: "Dirigez-vous vers le sud",
          distance: Math.floor(getDistance(start, end) * 500),
          duration: Math.floor(getDistance(start, end) * 300),
          type: "start"
        },
        {
          instruction: "Continuez tout droit",
          distance: Math.floor(getDistance(start, end) * 300),
          duration: Math.floor(getDistance(start, end) * 200),
          type: "continue"
        },
        {
          instruction: "Vous êtes arrivé à destination",
          distance: Math.floor(getDistance(start, end) * 200),
          duration: Math.floor(getDistance(start, end) * 100),
          type: "arrive"
        }
      ],
      summary: `Distance: ${(getDistance(start, end)).toFixed(1)} km • Durée: ${Math.ceil(getDistance(start, end) * 60 / 1.4)} min`
    };

    return mockRoute;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'itinéraire:', error);
    throw new Error('Impossible de calculer l\'itinéraire');
  }
}

// Fonction utilitaire pour calculer la distance entre deux points
function getDistance(point1: RouteCoordinate, point2: RouteCoordinate): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Fonction pour obtenir les modes de transport disponibles selon la distance
export function getAvailableTransportModes(distance: number): string[] {
  const modes = ['walking'];
  
  if (distance > 0.5) modes.push('bike');
  if (distance > 2) modes.push('public');
  if (distance > 5) modes.push('car');
  
  return modes;
}

// Fonction pour formater la durée
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

// Fonction pour formater la distance
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
