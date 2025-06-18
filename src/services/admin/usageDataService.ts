
import { supabase } from "@/integrations/supabase/client";
import { VelibUsageData } from "./types";

/**
 * Récupère les données d'utilisation avec calcul du taux d'occupation optimisé
 */
export async function getVelibUsageData(timeRange: string = '24h'): Promise<VelibUsageData[]> {
  try {
    console.log(`Fetching usage data for timeRange: ${timeRange}`);
    
    const now = new Date();
    const startDate = new Date();
    let dateFormat = 'YYYY-MM-DD HH24:00';
    let dateExtract = 'hour';
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        dateFormat = 'YYYY-MM-DD HH24:00';
        dateExtract = 'hour';
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        dateFormat = 'YYYY-MM-DD';
        dateExtract = 'day';
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        dateFormat = 'YYYY-MM-DD';
        dateExtract = 'day';
        break;
      default:
        startDate.setHours(now.getHours() - 24);
    }

    // Requête optimisée avec agrégation côté base de données
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
      .lte('timestamp', now.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }

    if (!usageData || usageData.length === 0) {
      return generateDefaultUsageData(timeRange);
    }

    // Grouper les données par période selon le timeRange
    const groupedData = new Map<string, {
      totalBikes: number[];
      totalDocks: number[];
      totalCapacity: number[];
      count: number;
    }>();

    usageData.forEach(record => {
      let dateKey: string;
      const date = new Date(record.timestamp!);
      
      if (timeRange === '24h') {
        dateKey = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}h`;
      } else {
        dateKey = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      }
      
      if (!groupedData.has(dateKey)) {
        groupedData.set(dateKey, {
          totalBikes: [],
          totalDocks: [],
          totalCapacity: [],
          count: 0
        });
      }
      
      const group = groupedData.get(dateKey)!;
      group.totalBikes.push(record.numbikesavailable || 0);
      group.totalDocks.push(record.numdocksavailable || 0);
      group.totalCapacity.push(record.velib_stations?.capacity || 0);
      group.count++;
    });

    // Calculer les moyennes et le taux d'occupation
    const result: VelibUsageData[] = Array.from(groupedData.entries())
      .map(([date, data]) => {
        const avgBikes = data.totalBikes.length > 0 
          ? Math.round(data.totalBikes.reduce((a, b) => a + b, 0) / data.totalBikes.length)
          : 0;
        
        const avgDocks = data.totalDocks.length > 0
          ? Math.round(data.totalDocks.reduce((a, b) => a + b, 0) / data.totalDocks.length)
          : 0;
        
        const avgCapacity = data.totalCapacity.length > 0
          ? Math.round(data.totalCapacity.reduce((a, b) => a + b, 0) / data.totalCapacity.length)
          : 0;
        
        // Calculer le taux d'occupation : (vélos + places occupées) / capacité totale
        const occupancyRate = avgCapacity > 0 
          ? Math.round(((avgBikes + avgDocks) / avgCapacity) * 100)
          : 0;
        
        return {
          date,
          totalBikes: avgBikes,
          totalDocks: avgDocks,
          occupancyRate: Math.min(100, Math.max(0, occupancyRate)) // Limiter entre 0 et 100
        };
      })
      .sort((a, b) => {
        // Trier par date
        if (timeRange === '24h') {
          const hourA = parseInt(a.date.split(' ')[1]);
          const hourB = parseInt(b.date.split(' ')[1]);
          return hourA - hourB;
        } else {
          const [dayA, monthA] = a.date.split('/').map(Number);
          const [dayB, monthB] = b.date.split('/').map(Number);
          return new Date(2024, monthA - 1, dayA).getTime() - new Date(2024, monthB - 1, dayB).getTime();
        }
      });

    console.log(`Usage data processed: ${result.length} periods`);
    return result;

  } catch (error) {
    console.error('Error in getVelibUsageData:', error);
    return generateDefaultUsageData(timeRange);
  }
}

/**
 * Génère des données par défaut
 */
function generateDefaultUsageData(timeRange: string): VelibUsageData[] {
  console.log('Generating default usage data');
  
  const data: VelibUsageData[] = [];
  const now = new Date();
  
  if (timeRange === '24h') {
    for (let i = 23; i >= 0; i--) {
      const hour = (now.getHours() - i + 24) % 24;
      data.push({
        date: `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}h`,
        totalBikes: 0,
        totalDocks: 0,
        occupancyRate: 0
      });
    }
  } else if (timeRange === '7d') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        totalBikes: 0,
        totalDocks: 0,
        occupancyRate: 0
      });
    }
  } else {
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        totalBikes: 0,
        totalDocks: 0,
        occupancyRate: 0
      });
    }
  }
  
  return data;
}
