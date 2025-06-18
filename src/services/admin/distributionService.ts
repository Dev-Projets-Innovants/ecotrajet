
import { supabase } from "@/integrations/supabase/client";
import { VelibDistributionData } from "./types";

/**
 * Récupère la distribution par arrondissement
 */
export async function getVelibDistributionData(): Promise<VelibDistributionData[]> {
  try {
    const { data, error } = await supabase
      .from('velib_stations')
      .select(`
        nom_arrondissement_communes,
        capacity,
        velib_availability_history!inner (
          numbikesavailable,
          timestamp
        )
      `)
      .order('timestamp', { foreignTable: 'velib_availability_history', ascending: false })
      .limit(1, { foreignTable: 'velib_availability_history' });

    if (error) {
      console.error('Error fetching distribution data:', error);
      throw error;
    }

    // Grouper par arrondissement
    const distributionMap: { [key: string]: { stations: number, bikes: number, capacity: number } } = {};
    
    data?.forEach(station => {
      const arrondissement = station.nom_arrondissement_communes || 'Inconnu';
      const availability = station.velib_availability_history[0];
      
      if (!distributionMap[arrondissement]) {
        distributionMap[arrondissement] = { stations: 0, bikes: 0, capacity: 0 };
      }
      
      distributionMap[arrondissement].stations++;
      distributionMap[arrondissement].bikes += availability?.numbikesavailable || 0;
      distributionMap[arrondissement].capacity += station.capacity || 0;
    });

    return Object.entries(distributionMap)
      .map(([arrondissement, data]) => ({
        arrondissement,
        stations: data.stations,
        bikes: data.bikes,
        capacity: data.capacity
      }))
      .sort((a, b) => b.stations - a.stations)
      .slice(0, 10); // Top 10 arrondissements
  } catch (error) {
    console.error('Error in getVelibDistributionData:', error);
    return [];
  }
}
