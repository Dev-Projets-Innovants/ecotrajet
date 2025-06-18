
import { supabase } from "@/integrations/supabase/client";
import { VelibAvailabilityTrend } from "./types";

/**
 * Récupère les données de tendance par heure selon la période demandée
 */
export async function getVelibAvailabilityTrends(timeRange: string = '24h'): Promise<VelibAvailabilityTrend[]> {
  try {
    // Calculer la date de début selon la période
    let startDate: Date;
    switch (timeRange) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // '24h'
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    console.log(`Fetching availability trends for ${timeRange}, starting from:`, startDate.toISOString());

    const { data, error } = await supabase
      .from('velib_availability_history')
      .select('timestamp, numbikesavailable, numdocksavailable, mechanical, ebike')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching availability trends:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No availability data found for the specified period');
      return [];
    }

    console.log(`Retrieved ${data.length} availability records`);

    // Grouper par heure pour 24h, par jour pour les autres périodes
    const groupedData: { [key: string]: { bikes: number[], docks: number[], mechanical: number[], electric: number[] } } = {};
    
    data.forEach(record => {
      let timeKey: string;
      const recordDate = new Date(record.timestamp);
      
      if (timeRange === '24h') {
        // Grouper par heure pour 24h
        timeKey = `${recordDate.getHours().toString().padStart(2, '0')}h`;
      } else {
        // Grouper par jour pour 7d et 30d
        timeKey = recordDate.toISOString().split('T')[0];
      }
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = { bikes: [], docks: [], mechanical: [], electric: [] };
      }
      
      groupedData[timeKey].bikes.push(record.numbikesavailable || 0);
      groupedData[timeKey].docks.push(record.numdocksavailable || 0);
      groupedData[timeKey].mechanical.push(record.mechanical || 0);
      groupedData[timeKey].electric.push(record.ebike || 0);
    });

    // Calculer les moyennes et formater les résultats
    const results = Object.entries(groupedData).map(([timeKey, data]) => {
      const avgBikes = Math.round(data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length);
      const avgDocks = Math.round(data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length);
      const avgMechanical = Math.round(data.mechanical.reduce((sum, val) => sum + val, 0) / data.mechanical.length);
      const avgElectric = Math.round(data.electric.reduce((sum, val) => sum + val, 0) / data.electric.length);

      return {
        hour: timeRange === '24h' ? timeKey : new Date(timeKey).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        bikes: avgBikes,
        docks: avgDocks,
        mechanical: avgMechanical,
        electric: avgElectric
      };
    });

    // Trier les résultats correctement
    if (timeRange === '24h') {
      results.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    } else {
      results.sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime());
    }

    console.log(`Processed ${results.length} trend data points`);
    return results;
  } catch (error) {
    console.error('Error in getVelibAvailabilityTrends:', error);
    return [];
  }
}
