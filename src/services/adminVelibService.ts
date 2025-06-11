
import { supabase } from "@/integrations/supabase/client";

export interface VelibDashboardStats {
  totalStations: number;
  activeStations: number;
  totalBikesAvailable: number;
  totalDocksAvailable: number;
  mechanicalBikes: number;
  electricBikes: number;
  averageCapacity: number;
  lastUpdated: string;
}

export interface VelibAvailabilityTrend {
  hour: string;
  bikes: number;
  docks: number;
  mechanical: number;
  electric: number;
}

export interface VelibDistributionData {
  arrondissement: string;
  stations: number;
  bikes: number;
  capacity: number;
}

export interface VelibUsageData {
  date: string;
  totalBikes: number;
  totalDocks: number;
  occupancyRate: number;
}

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

/**
 * Récupère les données de tendance par heure
 */
export async function getVelibAvailabilityTrends(): Promise<VelibAvailabilityTrend[]> {
  try {
    const { data, error } = await supabase
      .from('velib_availability_history')
      .select('timestamp, numbikesavailable, numdocksavailable, mechanical, ebike')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching availability trends:', error);
      throw error;
    }

    // Grouper par heure
    const hourlyData: { [key: string]: { bikes: number[], docks: number[], mechanical: number[], electric: number[] } } = {};
    
    data?.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      const hourKey = `${hour}h`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { bikes: [], docks: [], mechanical: [], electric: [] };
      }
      
      hourlyData[hourKey].bikes.push(record.numbikesavailable || 0);
      hourlyData[hourKey].docks.push(record.numdocksavailable || 0);
      hourlyData[hourKey].mechanical.push(record.mechanical || 0);
      hourlyData[hourKey].electric.push(record.ebike || 0);
    });

    // Calculer les moyennes par heure
    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour,
      bikes: Math.round(data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length),
      docks: Math.round(data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length),
      mechanical: Math.round(data.mechanical.reduce((sum, val) => sum + val, 0) / data.mechanical.length),
      electric: Math.round(data.electric.reduce((sum, val) => sum + val, 0) / data.electric.length)
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  } catch (error) {
    console.error('Error in getVelibAvailabilityTrends:', error);
    return [];
  }
}

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

/**
 * Récupère les données d'usage sur les derniers jours
 */
export async function getVelibUsageData(): Promise<VelibUsageData[]> {
  try {
    const { data, error } = await supabase
      .from('velib_availability_history')
      .select('timestamp, numbikesavailable, numdocksavailable')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }

    // Grouper par jour
    const dailyData: { [key: string]: { bikes: number[], docks: number[] } } = {};
    
    data?.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { bikes: [], docks: [] };
      }
      
      dailyData[date].bikes.push(record.numbikesavailable || 0);
      dailyData[date].docks.push(record.numdocksavailable || 0);
    });

    return Object.entries(dailyData).map(([date, data]) => {
      const avgBikes = data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length;
      const avgDocks = data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length;
      const totalCapacity = avgBikes + avgDocks;
      const occupancyRate = totalCapacity > 0 ? (avgBikes / totalCapacity) * 100 : 0;
      
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        totalBikes: Math.round(avgBikes),
        totalDocks: Math.round(avgDocks),
        occupancyRate: Math.round(occupancyRate)
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error in getVelibUsageData:', error);
    return [];
  }
}
