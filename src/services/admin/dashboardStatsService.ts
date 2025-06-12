
import { supabase } from "@/integrations/supabase/client";
import { VelibDashboardStats } from "./types";

/**
 * Récupère les statistiques générales des stations Vélib
 */
export async function getVelibDashboardStats(): Promise<VelibDashboardStats> {
  try {
    // Récupérer toutes les stations avec leurs dernières données de disponibilité
    const { data: stationsData, error: stationsError } = await supabase
      .from('velib_stations')
      .select(`
        *,
        velib_availability_history!inner (
          numbikesavailable,
          numdocksavailable,
          mechanical,
          ebike,
          is_installed,
          timestamp
        )
      `)
      .order('timestamp', { foreignTable: 'velib_availability_history', ascending: false })
      .limit(1, { foreignTable: 'velib_availability_history' });

    if (stationsError) {
      console.error('Error fetching stations stats:', stationsError);
      throw stationsError;
    }

    const stats = stationsData?.reduce((acc, station) => {
      const availability = station.velib_availability_history[0];
      if (availability) {
        acc.totalStations++;
        if (availability.is_installed) {
          acc.activeStations++;
        }
        acc.totalBikesAvailable += availability.numbikesavailable || 0;
        acc.totalDocksAvailable += availability.numdocksavailable || 0;
        acc.mechanicalBikes += availability.mechanical || 0;
        acc.electricBikes += availability.ebike || 0;
        acc.totalCapacity += station.capacity || 0;
      }
      return acc;
    }, {
      totalStations: 0,
      activeStations: 0,
      totalBikesAvailable: 0,
      totalDocksAvailable: 0,
      mechanicalBikes: 0,
      electricBikes: 0,
      totalCapacity: 0
    });

    const lastUpdated = stationsData?.[0]?.velib_availability_history[0]?.timestamp || new Date().toISOString();

    return {
      totalStations: stats?.totalStations || 0,
      activeStations: stats?.activeStations || 0,
      totalBikesAvailable: stats?.totalBikesAvailable || 0,
      totalDocksAvailable: stats?.totalDocksAvailable || 0,
      mechanicalBikes: stats?.mechanicalBikes || 0,
      electricBikes: stats?.electricBikes || 0,
      averageCapacity: stats?.totalStations ? Math.round((stats?.totalCapacity || 0) / stats.totalStations) : 0,
      lastUpdated
    };
  } catch (error) {
    console.error('Error in getVelibDashboardStats:', error);
    throw error;
  }
}
