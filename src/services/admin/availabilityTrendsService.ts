
import { supabase } from "@/integrations/supabase/client";
import { VelibAvailabilityTrend } from "./types";

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

    console.log('Availability trends data count:', data?.length || 0);

    if (!data || data.length === 0) {
      console.warn('No availability trends data found for the last 24 hours');
      return [];
    }

    // Grouper par heure
    const hourlyData: { [key: string]: { bikes: number[], docks: number[], mechanical: number[], electric: number[] } } = {};
    
    data.forEach(record => {
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

    // Calculer les moyennes par heure et trier correctement
    const results = Object.entries(hourlyData).map(([hour, data]) => ({
      hour,
      bikes: Math.round(data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length),
      docks: Math.round(data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length),
      mechanical: Math.round(data.mechanical.reduce((sum, val) => sum + val, 0) / data.mechanical.length),
      electric: Math.round(data.electric.reduce((sum, val) => sum + val, 0) / data.electric.length)
    })).sort((a, b) => {
      // Trier par numéro d'heure plutôt que par string
      const hourA = parseInt(a.hour.replace('h', ''));
      const hourB = parseInt(b.hour.replace('h', ''));
      return hourA - hourB;
    });

    console.log('Processed availability trends:', results);
    return results;
  } catch (error) {
    console.error('Error in getVelibAvailabilityTrends:', error);
    return [];
  }
}
