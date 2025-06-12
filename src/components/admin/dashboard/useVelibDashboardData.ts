import { useState, useEffect } from 'react';
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

export const useVelibDashboardData = () => {
  const [stats, setStats] = useState<VelibDashboardStats | null>(null);
  const [availabilityTrends, setAvailabilityTrends] = useState<VelibAvailabilityTrend[]>([]);
  const [distributionData, setDistributionData] = useState<VelibDistributionData[]>([]);
  const [usageData, setUsageData] = useState<VelibUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [statsData, trendsData, distributionData, usageData] = await Promise.all([
        getVelibDashboardStats(),
        getVelibAvailabilityTrends(),
        getVelibDistributionData(),
        getVelibUsageData()
      ]);
      
      setStats(statsData);
      setAvailabilityTrends(trendsData);
      setDistributionData(distributionData);
      setUsageData(usageData);
    } catch (err) {
      console.error('Error loading Vélib dashboard data:', err);
      setError('Erreur lors du chargement des données Vélib');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refetchData = async () => {
    await loadData();
  };

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
    refetchData
  };
};
