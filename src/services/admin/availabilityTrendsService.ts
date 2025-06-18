
import { supabase } from "@/integrations/supabase/client";
import { VelibAvailabilityTrend } from "./types";

/**
 * Récupère les tendances de disponibilité des vélos par heure avec filtrage temporel optimisé
 */
export async function getVelibAvailabilityTrends(timeRange: string = '24h'): Promise<VelibAvailabilityTrend[]> {
  try {
    console.log(`Fetching availability trends for timeRange: ${timeRange}`);
    
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

    // Utiliser une requête SQL optimisée avec GROUP BY
    const { data, error } = await supabase.rpc('get_availability_trends', {
      start_time: startDate.toISOString(),
      end_time: now.toISOString(),
      time_range: timeRange
    });

    if (error) {
      console.error('Error fetching availability trends:', error);
      
      // Fallback vers l'ancienne méthode si la fonction RPC n'existe pas
      return await getFallbackAvailabilityTrends(startDate, timeRange);
    }

    return data || [];
    
  } catch (error) {
    console.error('Error in getVelibAvailabilityTrends:', error);
    
    // Fallback en cas d'erreur
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 24);
    return await getFallbackAvailabilityTrends(startDate, timeRange);
  }
}

/**
 * Méthode de fallback pour récupérer les tendances
 */
async function getFallbackAvailabilityTrends(startDate: Date, timeRange: string): Promise<VelibAvailabilityTrend[]> {
  console.log('Using fallback method for availability trends');
  
  const { data: availabilityData, error } = await supabase
    .from('velib_availability_history')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error in fallback method:', error);
    throw error;
  }

  if (!availabilityData || availabilityData.length === 0) {
    return generateEmptyTrends(timeRange);
  }

  // Grouper par heure et calculer les moyennes
  const hourlyData = new Map<string, {
    bikes: number[];
    docks: number[];
    mechanical: number[];
    electric: number[];
  }>();

  availabilityData.forEach(record => {
    const hour = new Date(record.timestamp!).getHours();
    const hourKey = `${hour.toString().padStart(2, '0')}h`;
    
    if (!hourlyData.has(hourKey)) {
      hourlyData.set(hourKey, { bikes: [], docks: [], mechanical: [], electric: [] });
    }
    
    const hourData = hourlyData.get(hourKey)!;
    hourData.bikes.push(record.numbikesavailable || 0);
    hourData.docks.push(record.numdocksavailable || 0);
    hourData.mechanical.push(record.mechanical || 0);
    hourData.electric.push(record.ebike || 0);
  });

  // Calculer les moyennes et créer les trends
  const trends: VelibAvailabilityTrend[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const hourKey = `${hour.toString().padStart(2, '0')}h`;
    const hourData = hourlyData.get(hourKey);
    
    if (hourData) {
      trends.push({
        hour: hourKey,
        bikes: Math.round(hourData.bikes.reduce((a, b) => a + b, 0) / hourData.bikes.length),
        docks: Math.round(hourData.docks.reduce((a, b) => a + b, 0) / hourData.docks.length),
        mechanical: Math.round(hourData.mechanical.reduce((a, b) => a + b, 0) / hourData.mechanical.length),
        electric: Math.round(hourData.electric.reduce((a, b) => a + b, 0) / hourData.electric.length),
      });
    } else {
      trends.push({
        hour: hourKey,
        bikes: 0,
        docks: 0,
        mechanical: 0,
        electric: 0,
      });
    }
  }

  return trends.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
}

/**
 * Génère des données vides pour les tendances quand aucune donnée n'est disponible
 */
function generateEmptyTrends(timeRange: string): VelibAvailabilityTrend[] {
  console.log('Generating empty trends data');
  
  const trends: VelibAvailabilityTrend[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    trends.push({
      hour: `${hour.toString().padStart(2, '0')}h`,
      bikes: 0,
      docks: 0,
      mechanical: 0,
      electric: 0,
    });
  }
  
  return trends;
}
