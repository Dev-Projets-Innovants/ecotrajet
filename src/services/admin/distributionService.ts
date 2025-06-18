
import { supabase } from "@/integrations/supabase/client";
import { VelibDistributionData } from "./types";

/**
 * Récupère la distribution des stations par arrondissement avec optimisation
 */
export async function getVelibDistributionData(timeRange: string = '24h'): Promise<VelibDistributionData[]> {
  try {
    console.log(`Fetching distribution data for timeRange: ${timeRange}`);
    
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setHours(now.getHours() - 24);
    }

    // Récupérer les données des stations avec leurs dernières disponibilités
    const { data: stationsData, error } = await supabase
      .from('velib_stations')
      .select(`
        stationcode,
        nom_arrondissement_communes,
        capacity,
        velib_availability_history!inner (
          numbikesavailable,
          timestamp
        )
      `)
      .gte('velib_availability_history.timestamp', startDate.toISOString())
      .order('timestamp', { foreignTable: 'velib_availability_history', ascending: false });

    if (error) {
      console.error('Error fetching distribution data:', error);
      throw error;
    }

    if (!stationsData || stationsData.length === 0) {
      return generateDefaultDistributionData();
    }

    // Grouper par station pour ne garder que les données les plus récentes
    const stationLatestData = new Map();
    stationsData.forEach(station => {
      const existing = stationLatestData.get(station.stationcode);
      const currentTimestamp = station.velib_availability_history[0]?.timestamp;
      
      if (!existing || (currentTimestamp && new Date(currentTimestamp) > new Date(existing.timestamp))) {
        stationLatestData.set(station.stationcode, {
          ...station,
          timestamp: currentTimestamp,
          bikes: station.velib_availability_history[0]?.numbikesavailable || 0
        });
      }
    });

    // Grouper par arrondissement
    const arrondissementData = new Map<string, {
      stations: number;
      totalBikes: number;
      totalCapacity: number;
    }>();

    Array.from(stationLatestData.values()).forEach((station: any) => {
      let arrondissement = station.nom_arrondissement_communes || 'Inconnu';
      
      // Nettoyer le nom de l'arrondissement
      if (arrondissement.includes('Paris')) {
        const match = arrondissement.match(/(\d+)/);
        arrondissement = match ? `${match[1]}e arr.` : arrondissement;
      }
      
      if (!arrondissementData.has(arrondissement)) {
        arrondissementData.set(arrondissement, {
          stations: 0,
          totalBikes: 0,
          totalCapacity: 0
        });
      }
      
      const data = arrondissementData.get(arrondissement)!;
      data.stations++;
      data.totalBikes += station.bikes;
      data.totalCapacity += station.capacity || 0;
    });

    // Convertir en format de retour et trier
    const result: VelibDistributionData[] = Array.from(arrondissementData.entries())
      .map(([arrondissement, data]) => ({
        arrondissement,
        stations: data.stations,
        bikes: data.totalBikes,
        capacity: data.totalCapacity,
      }))
      .sort((a, b) => b.stations - a.stations) // Trier par nombre de stations décroissant
      .slice(0, 10); // Limiter aux 10 premiers

    console.log(`Distribution data processed: ${result.length} arrondissements`);
    return result;

  } catch (error) {
    console.error('Error in getVelibDistributionData:', error);
    return generateDefaultDistributionData();
  }
}

/**
 * Génère des données par défaut quand aucune donnée n'est disponible
 */
function generateDefaultDistributionData(): VelibDistributionData[] {
  console.log('Generating default distribution data');
  
  return [
    { arrondissement: '1er arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '2e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '3e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '4e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '5e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '6e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '7e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '8e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '9e arr.', stations: 0, bikes: 0, capacity: 0 },
    { arrondissement: '10e arr.', stations: 0, bikes: 0, capacity: 0 },
  ];
}
