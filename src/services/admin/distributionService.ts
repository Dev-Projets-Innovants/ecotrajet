
import { supabase } from "@/integrations/supabase/client";
import { VelibDistributionData } from "./types";

/**
 * Récupère la distribution par arrondissement avec données récentes
 */
export async function getVelibDistributionData(): Promise<VelibDistributionData[]> {
  try {
    console.log('Fetching distribution data...');

    // Récupérer les données de disponibilité les plus récentes (dernières 2 heures)
    const recentTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('velib_stations')
      .select(`
        nom_arrondissement_communes,
        capacity,
        stationcode,
        velib_availability_history!inner (
          numbikesavailable,
          timestamp
        )
      `)
      .gte('velib_availability_history.timestamp', recentTimestamp)
      .order('timestamp', { foreignTable: 'velib_availability_history', ascending: false });

    if (error) {
      console.error('Error fetching distribution data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No recent distribution data found');
      return [];
    }

    console.log(`Retrieved ${data.length} stations with recent data`);

    // Grouper par arrondissement et prendre les données les plus récentes par station
    const stationLatestData: { [stationcode: string]: any } = {};
    
    data.forEach(station => {
      const stationCode = station.stationcode;
      const availability = station.velib_availability_history[0]; // Plus récent
      
      if (!stationLatestData[stationCode] || 
          new Date(availability.timestamp) > new Date(stationLatestData[stationCode].timestamp)) {
        stationLatestData[stationCode] = {
          ...station,
          latestAvailability: availability
        };
      }
    });

    // Grouper par arrondissement
    const distributionMap: { [key: string]: { stations: number, bikes: number, capacity: number } } = {};
    
    Object.values(stationLatestData).forEach((station: any) => {
      const arrondissement = station.nom_arrondissement_communes || 'Inconnu';
      const availability = station.latestAvailability;
      
      if (!distributionMap[arrondissement]) {
        distributionMap[arrondissement] = { stations: 0, bikes: 0, capacity: 0 };
      }
      
      distributionMap[arrondissement].stations++;
      distributionMap[arrondissement].bikes += availability?.numbikesavailable || 0;
      distributionMap[arrondissement].capacity += station.capacity || 0;
    });

    const results = Object.entries(distributionMap)
      .map(([arrondissement, data]) => ({
        arrondissement,
        stations: data.stations,
        bikes: data.bikes,
        capacity: data.capacity
      }))
      .sort((a, b) => b.stations - a.stations)
      .slice(0, 10); // Top 10 arrondissements

    console.log(`Processed distribution for ${results.length} arrondissements`);
    return results;
  } catch (error) {
    console.error('Error in getVelibDistributionData:', error);
    return [];
  }
}
