
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

  const checkDataFreshness = useCallback((timestamp: string) => {
    const now = Date.now();
    const dataTime = new Date(timestamp).getTime();
    const ageInMinutes = (now - dataTime) / (1000 * 60);
    
    if (ageInMinutes <= 10) return 'fresh';
    if (ageInMinutes <= 30) return 'stale';
    return 'outdated';
  }, []);

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      console.log(`Loading Velib data for time range: ${timeRange}`);
      
      const [statsData, trendsData, distributionResult, usageResult] = await Promise.all([
        getVelibDashboardStats(),
        getVelibAvailabilityTrends(timeRange),
        getVelibDistributionData(),
        getVelibUsageData(timeRange)
      ]);
      
      const loadTime = Date.now() - startTime;
      console.log(`Données chargées en ${loadTime}ms`);
      
      // Vérifier la fraîcheur des données
      if (statsData?.lastUpdated) {
        setDataFreshness(checkDataFreshness(statsData.lastUpdated));
      }
      
      setStats(statsData);
      setAvailabilityTrends(trendsData);
      setDistributionData(distributionResult);
      setUsageData(usageResult);
      setLastUpdated(new Date().toISOString());

      // Afficher des avertissements si les données sont insuffisantes
      if (trendsData.length === 0) {
        console.warn('Aucune donnée de tendance disponible');
      }
      if (usageResult.length === 0) {
        console.warn('Aucune donnée d\'utilisation disponible');
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des données Vélib:', err);
      setError('Erreur lors du chargement des données Vélib. Vérifiez la synchronisation des données.');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [timeRange, checkDataFreshness]);

  // Recharger les données quand timeRange change
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        console.log('Auto-refresh des données Vélib');
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
    console.log('Actualisation manuelle des données');
    await loadData(true);
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
    refetchData
  };
};
