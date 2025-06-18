
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  getVelibDashboardStats, 
  getVelibAvailabilityTrends, 
  getVelibDistributionData,
  getVelibUsageData,
  VelibDashboardStats,
  VelibAvailabilityTrend,
  VelibDistributionData,
  VelibUsageData
} from '@/services/admin';

export const useOptimizedVelibData = (autoRefresh: boolean = false, timeRange: string = '24h') => {
  const [stats, setStats] = useState<VelibDashboardStats | null>(null);
  const [availabilityTrends, setAvailabilityTrends] = useState<VelibAvailabilityTrend[]>([]);
  const [distributionData, setDistributionData] = useState<VelibDistributionData[]>([]);
  const [usageData, setUsageData] = useState<VelibUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'outdated'>('fresh');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      console.log(`Loading data for timeRange: ${timeRange}`);
      
      const [statsData, trendsData, distributionDataResult, usageDataResult] = await Promise.all([
        getVelibDashboardStats(timeRange),
        getVelibAvailabilityTrends(timeRange),
        getVelibDistributionData(timeRange),
        getVelibUsageData(timeRange)
      ]);
      
      const loadTime = Date.now() - startTime;
      console.log(`Données chargées en ${loadTime}ms pour ${timeRange}`);
      
      setStats(statsData);
      setAvailabilityTrends(trendsData);
      setDistributionData(distributionDataResult);
      setUsageData(usageDataResult);
      
      const now = new Date().toISOString();
      setLastUpdated(now);
      
      // Calculer la fraîcheur des données
      if (statsData.lastUpdated) {
        const dataAge = Date.now() - new Date(statsData.lastUpdated).getTime();
        const ageInMinutes = dataAge / (1000 * 60);
        
        if (ageInMinutes < 15) {
          setDataFreshness('fresh');
        } else if (ageInMinutes < 60) {
          setDataFreshness('stale');
        } else {
          setDataFreshness('outdated');
        }
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des données Vélib:', err);
      setError('Erreur lors du chargement des données Vélib');
      setDataFreshness('outdated');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [timeRange]);

  // Charger les données au changement de timeRange
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Gérer l'auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        console.log('Auto-refresh triggered');
        loadData(false); // Ne pas afficher le spinner pour l'auto-refresh
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, loadData]);

  const refetchData = useCallback(async () => {
    console.log('Manual refresh triggered');
    await loadData(true);
  }, [loadData]);

  // Fonction pour déclencher une synchronisation manuelle des données
  const triggerDataSync = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Triggering manual data sync...');
      
      // Appeler l'edge function de synchronisation
      const { data, error } = await supabase.functions.invoke('sync-velib-data');
      
      if (error) {
        console.error('Error triggering sync:', error);
        throw error;
      }
      
      console.log('Sync triggered successfully:', data);
      
      // Attendre un peu puis recharger les données
      setTimeout(() => {
        loadData(false);
      }, 2000);
      
      return data;
    } catch (error) {
      console.error('Error in triggerDataSync:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const chartConfig = {
    bikes: {
      label: "Vélos",
      theme: { light: "#10b981", dark: "#10b981" },
    },
    docks: {
      label: "Places",
      theme: { light: "#60a5fa", dark: "#60a5fa" },
    },
    mechanical: {
      label: "Mécaniques",
      theme: { light: "#22c55e", dark: "#22c55e" },
    },
    electric: {
      label: "Électriques",
      theme: { light: "#3b82f6", dark: "#3b82f6" },
    },
    occupancy: {
      label: "Taux d'occupation",
      theme: { light: "#f59e0b", dark: "#f59e0b" },
    },
  };

  return {
    stats,
    availabilityTrends,
    distributionData,
    usageData,
    chartConfig,
    isLoading,
    error,
    lastUpdated,
    dataFreshness,
    refetchData,
    triggerDataSync
  };
};
