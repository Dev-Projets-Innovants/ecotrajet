
import { supabase } from "@/integrations/supabase/client";
import { VelibDashboardStats } from "./types";

/**
 * Récupère les statistiques générales des stations Vélib avec filtrage temporel
 */
export async function getVelibDashboardStats(timeRange: string = '24h'): Promise<VelibDashboardStats> {
  try {
    console.log(`Fetching dashboard stats for timeRange: ${timeRange}`);
    
    // Calculer la date de début selon le filtre temporel
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

    console.log(`Querying data from ${startDate.toISOString()} to ${now.toISOString()}`);

    // Récupérer les dernières données de disponibilité pour chaque station
    const { data: latestAvailabilityData, error: latestError } = await supabase
      .from('velib_availability_history')
      .select(`
        stationcode,
        numbikesavailable,
        numdocksavailable,
        mechanical,
        ebike,
        is_installed,
        timestamp,
        velib_stations!inner (
          capacity,
          name
        )
      `)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (latestError) {
      console.error('Error fetching latest availability:', latestError);
      throw latestError;
    }

    console.log(`Found ${latestAvailabilityData?.length || 0} availability records`);

    // Grouper par station pour ne garder que les données les plus récentes
    const stationDataMap = new Map();
    latestAvailabilityData?.forEach(record => {
      const existing = stationDataMap.get(record.stationcode);
      if (!existing || new Date(record.timestamp!) > new Date(existing.timestamp!)) {
        stationDataMap.set(record.stationcode, record);
      }
    });

    const latestStationData = Array.from(stationDataMap.values());
    console.log(`Processing ${latestStationData.length} unique stations`);

    // Calculer les statistiques
    const stats = latestStationData.reduce((acc, record) => {
      acc.totalStations++;
      
      if (record.is_installed) {
        acc.activeStations++;
      }
      
      acc.totalBikesAvailable += record.numbikesavailable || 0;
      acc.totalDocksAvailable += record.numdocksavailable || 0;
      acc.mechanicalBikes += record.mechanical || 0;
      acc.electricBikes += record.ebike || 0;
      acc.totalCapacity += record.velib_stations?.capacity || 0;
      
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

    const averageCapacity = stats.totalStations > 0 
      ? Math.round(stats.totalCapacity / stats.totalStations) 
      : 0;

    // Obtenir le timestamp de la donnée la plus récente
    const lastUpdated = latestStationData.length > 0
      ? latestStationData.reduce((latest, current) => 
          new Date(current.timestamp!) > new Date(latest.timestamp!) ? current : latest
        ).timestamp || new Date().toISOString()
      : new Date().toISOString();

    const result: VelibDashboardStats = {
      totalStations: stats.totalStations,
      activeStations: stats.activeStations,
      totalBikesAvailable: stats.totalBikesAvailable,
      totalDocksAvailable: stats.totalDocksAvailable,
      mechanicalBikes: stats.mechanicalBikes,
      electricBikes: stats.electricBikes,
      averageCapacity,
      lastUpdated
    };

    console.log('Dashboard stats calculated:', result);
    return result;

  } catch (error) {
    console.error('Error in getVelibDashboardStats:', error);
    throw error;
  }
}
