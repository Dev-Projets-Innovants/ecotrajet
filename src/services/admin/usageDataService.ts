
import { supabase } from "@/integrations/supabase/client";
import { VelibUsageData } from "./types";

/**
 * Récupère les données d'usage selon la période demandée
 */
export async function getVelibUsageData(timeRange: string = '7d'): Promise<VelibUsageData[]> {
  try {
    // Calculer la date de début et le nombre de jours selon la période
    let startDate: Date;
    let days: number;
    
    switch (timeRange) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        days = 1;
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        days = 30;
        break;
      default: // '7d'
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        days = 7;
    }

    console.log(`Fetching usage data for ${timeRange}, starting from:`, startDate.toISOString());

    const { data, error } = await supabase
      .from('velib_availability_history')
      .select('timestamp, numbikesavailable, numdocksavailable')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No usage data found for the specified period');
      return [];
    }

    console.log(`Retrieved ${data.length} usage records`);

    // Grouper par jour
    const dailyData: { [key: string]: { bikes: number[], docks: number[] } } = {};
    
    data.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { bikes: [], docks: [] };
      }
      
      dailyData[date].bikes.push(record.numbikesavailable || 0);
      dailyData[date].docks.push(record.numdocksavailable || 0);
    });

    // Calculer les moyennes et taux d'occupation
    const results = Object.entries(dailyData).map(([date, data]) => {
      const avgBikes = Math.round(data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length);
      const avgDocks = Math.round(data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length);
      const totalCapacity = avgBikes + avgDocks;
      const occupancyRate = totalCapacity > 0 ? Math.round((avgBikes / totalCapacity) * 100) : 0;
      
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        totalBikes: avgBikes,
        totalDocks: avgDocks,
        occupancyRate
      };
    });

    // Trier par date
    results.sort((a, b) => {
      const dateA = new Date(a.date + ' 2024'); // Ajouter une année pour le tri
      const dateB = new Date(b.date + ' 2024');
      return dateA.getTime() - dateB.getTime();
    });

    console.log(`Processed ${results.length} usage data points`);
    return results;
  } catch (error) {
    console.error('Error in getVelibUsageData:', error);
    return [];
  }
}
