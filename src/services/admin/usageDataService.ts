
import { supabase } from "@/integrations/supabase/client";
import { VelibUsageData } from "./types";

/**
 * Récupère les données d'utilisation des stations Vélib avec filtrage temporel
 */
export async function getVelibUsageData(timeRange: string = '24h'): Promise<VelibUsageData[]> {
  try {
    console.log(`Fetching usage data for timeRange: ${timeRange}`);
    
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

    const { data: usageData, error } = await supabase
      .from('velib_availability_history')
      .select(`
        timestamp,
        numbikesavailable,
        numdocksavailable,
        velib_stations!inner (
          capacity
        )
      `)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching usage data:', error);
      return generateDefaultUsageData(timeRange);
    }

    if (!usageData || usageData.length === 0) {
      return generateDefaultUsageData(timeRange);
    }

    // Grouper par jour pour le calcul des moyennes
    const dailyData = new Map<string, {
      totalBikes: number;
      totalDocks: number;
      totalOccupancy: number;
      count: number;
    }>();

    usageData.forEach(record => {
      const date = new Date(record.timestamp!).toISOString().split('T')[0];
      const capacity = record.velib_stations?.capacity || 1;
      const bikesAvailable = record.numbikesavailable || 0;
      const docksAvailable = record.numdocksavailable || 0;
      const occupancyRate = Math.round((bikesAvailable / capacity) * 100);
      
      if (!dailyData.has(date)) {
        dailyData.set(date, { 
          totalBikes: 0, 
          totalDocks: 0, 
          totalOccupancy: 0, 
          count: 0 
        });
      }
      
      const dayData = dailyData.get(date)!;
      dayData.totalBikes += bikesAvailable;
      dayData.totalDocks += docksAvailable;
      dayData.totalOccupancy += occupancyRate;
      dayData.count++;
    });

    // Calculer les moyennes par jour et formater les résultats
    const result: VelibUsageData[] = Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        totalBikes: Math.round(data.totalBikes / data.count),
        totalDocks: Math.round(data.totalDocks / data.count),
        occupancyRate: Math.round(data.totalOccupancy / data.count),
      }))
      .sort((a, b) => {
        // Convertir les dates formatées en objets Date pour un tri correct
        const dateA = new Date(a.date + ' 2024'); // Ajouter une année par défaut
        const dateB = new Date(b.date + ' 2024');
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-7); // Derniers 7 jours

    console.log(`Usage data processed: ${result.length} data points`);
    return result;

  } catch (error) {
    console.error('Error in getVelibUsageData:', error);
    return generateDefaultUsageData(timeRange);
  }
}

/**
 * Génère des données par défaut quand aucune donnée n'est disponible
 */
function generateDefaultUsageData(timeRange: string): VelibUsageData[] {
  console.log('Generating default usage data');
  
  const data: VelibUsageData[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      totalBikes: 0,
      totalDocks: 0,
      occupancyRate: 0,
    });
  }
  
  return data;
}
