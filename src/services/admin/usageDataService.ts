
import { supabase } from "@/integrations/supabase/client";
import { VelibUsageData } from "./types";

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

    console.log('Usage data count:', data?.length || 0);

    if (!data || data.length === 0) {
      console.warn('No usage data found for the last 7 days');
      return [];
    }

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

    const results = Object.entries(dailyData).map(([date, data]) => {
      const avgBikes = data.bikes.reduce((sum, val) => sum + val, 0) / data.bikes.length;
      const avgDocks = data.docks.reduce((sum, val) => sum + val, 0) / data.docks.length;
      const totalCapacity = avgBikes + avgDocks;
      const occupancyRate = totalCapacity > 0 ? (avgBikes / totalCapacity) * 100 : 0;
      
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        totalBikes: Math.round(avgBikes),
        totalDocks: Math.round(avgDocks),
        occupancyRate: Math.round(occupancyRate),
        rawDate: date // Garder la date brute pour le tri
      };
    }).sort((a, b) => {
      // Trier par date réelle plutôt que par string formatée
      return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
    }).map(({ rawDate, ...rest }) => rest); // Retirer rawDate du résultat final

    console.log('Processed usage data:', results);
    return results;
  } catch (error) {
    console.error('Error in getVelibUsageData:', error);
    return [];
  }
}
