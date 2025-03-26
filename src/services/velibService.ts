
import { toast } from "@/components/ui/use-toast";

export interface VelibStation {
  stationcode: string;
  name: string;
  is_installed: string;
  capacity: number;
  numdocksavailable: number;
  numbikesavailable: number;
  mechanical: number;
  ebike: number;
  is_renting: string;
  is_returning: string;
  duedate: string;
  coordonnees_geo: {
    lon: number;
    lat: number;
  };
  nom_arrondissement_communes: string;
  code_insee_commune: string;
  station_opening_hours: string | null;
}

export interface VelibApiResponse {
  total_count: number;
  results: VelibStation[];
}

// Cache pour stocker les données et éviter des appels API inutiles
let stationsCache: {
  data: VelibStation[];
  timestamp: number;
} | null = null;

// Durée de validité du cache en millisecondes (1 minute)
const CACHE_DURATION = 60 * 1000;

/**
 * Récupère les stations Vélib' depuis l'API Paris Open Data
 * @param options Options de requête
 * @returns Promise avec les stations Vélib'
 */
export async function getVelibStations(options: {
  limit?: number;
  offset?: number;
  geoFilter?: { lat: number; lng: number; distance: number }; // en mètres
  forceRefresh?: boolean;
}): Promise<VelibStation[]> {
  const { limit = 100, offset = 0, geoFilter, forceRefresh = false } = options;

  // Vérifier si les données en cache sont encore valides
  if (
    !forceRefresh &&
    stationsCache &&
    Date.now() - stationsCache.timestamp < CACHE_DURATION
  ) {
    console.log("Utilisation des données en cache");
    return stationsCache.data;
  }

  // Construction de l'URL de l'API
  let url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=${limit}&offset=${offset}`;

  // Ajout du filtre géographique si nécessaire
  if (geoFilter) {
    url += `&geofilter.distance=${geoFilter.lat},${geoFilter.lng},${geoFilter.distance}`;
  }

  try {
    console.log("Récupération des données Vélib'...", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data: VelibApiResponse = await response.json();
    console.log(`${data.results.length} stations récupérées`);

    // Mise à jour du cache
    stationsCache = {
      data: data.results,
      timestamp: Date.now(),
    };

    return data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des stations Vélib':", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les stations Vélib'. Réessayez plus tard.",
      variant: "destructive",
    });
    
    // Retourner les données en cache si disponibles, même si périmées
    if (stationsCache) {
      return stationsCache.data;
    }
    
    return [];
  }
}

// Fonction pour rafraîchir automatiquement les données
export function startAutoRefresh(callback: (stations: VelibStation[]) => void, interval = 60000) {
  const refreshData = async () => {
    const stations = await getVelibStations({ forceRefresh: true });
    callback(stations);
  };

  // Exécuter immédiatement
  refreshData();
  
  // Configurer l'intervalle de rafraîchissement
  const intervalId = setInterval(refreshData, interval);
  
  // Retourner une fonction pour arrêter le rafraîchissement
  return () => clearInterval(intervalId);
}
