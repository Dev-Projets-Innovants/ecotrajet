import { useState, useEffect, useCallback, useRef } from 'react';
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

export const useOptimizedVelibData = (autoRefresh: boolean = false) => {
  const [stats, setStats] = useState<VelibDashboardStats | null>(null);
  const [availabilityTrends, setAvailabilityTrends] = useState<VelibAvailabilityTrend[]>([]);
  const [distributionData, setDistributionData] = useState<VelibDistributionData[]>([]);
  const [usageData, setUsageData] = useState<VelibUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      
      const [statsData, trendsData, distributionData, usageData] = await Promise.all([
        getVelibDashboardStats(),
        getVelibAvailabilityTrends(),
        getVelibDistributionData(),
        getVelibUsageData()
      ]);
      
      const loadTime = Date.now() - startTime;
      console.log(`Données chargées en ${loadTime}ms`);
      
      setStats(statsData);
      setAvailabilityTrends(trendsData);
      setDistributionData(distributionData);
      setUsageData(usageData);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Erreur lors du chargement des données Vélib:', err);
      setError('Erreur lors du chargement des données Vélib');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
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
    refetchData
  };
};
