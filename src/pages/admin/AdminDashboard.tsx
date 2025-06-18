
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OptimizedStatsCard from '@/components/admin/dashboard/OptimizedStatsCard';
import OptimizedVelibAvailabilityChart from '@/components/admin/dashboard/OptimizedVelibAvailabilityChart';
import OptimizedVelibDistributionChart from '@/components/admin/dashboard/OptimizedVelibDistributionChart';
import OptimizedVelibUsageChart from '@/components/admin/dashboard/OptimizedVelibUsageChart';
import DashboardFilters from '@/components/admin/dashboard/DashboardFilters';
import { useOptimizedVelibData } from '@/hooks/useOptimizedVelibData';
import { toast } from '@/hooks/use-toast';
import { 
  UserCheck, 
  Route, 
  Leaf, 
  Award,
  TrendingUp,
  RefreshCw,
  Bike,
  MapPin,
  Battery,
  ParkingCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const { 
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
  } = useOptimizedVelibData(autoRefresh, timeRange);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetchData();
      toast({
        title: "Données actualisées",
        description: "Les données Vélib' ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données Vélib'.",
        variant: "destructive"
      });
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
    toast({
      title: autoRefresh ? "Actualisation automatique désactivée" : "Actualisation automatique activée",
      description: autoRefresh ? "Les données ne seront plus actualisées automatiquement." : "Les données seront actualisées toutes les 5 minutes.",
    });
  };

  const handleTriggerSync = async () => {
    try {
      await triggerDataSync();
      toast({
        title: "Synchronisation déclenchée",
        description: "La synchronisation des données Vélib' a été déclenchée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de déclencher la synchronisation des données Vélib'.",
        variant: "destructive"
      });
    }
  };

  if (error && !stats) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-2">
            <button 
              onClick={handleManualRefresh} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </button>
            <button 
              onClick={handleTriggerSync} 
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Synchroniser les données
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tableau de bord Vélib'">
      <div className="space-y-6">
        {/* Filtres et contrôles */}
        <DashboardFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isRefreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
          lastUpdated={lastUpdated}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={handleAutoRefreshToggle}
          dataFreshness={dataFreshness}
          onTriggerSync={handleTriggerSync}
        />

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OptimizedStatsCard
            title="Stations actives"
            value={stats?.activeStations.toLocaleString() || '0'}
            trend={`${stats?.totalStations || 0} au total`}
            icon={MapPin}
            iconColor="text-eco-green"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
          
          <OptimizedStatsCard
            title="Vélos disponibles"
            value={stats?.totalBikesAvailable.toLocaleString() || '0'}
            trend={`${stats?.mechanicalBikes || 0} mécaniques`}
            icon={Bike}
            iconColor="text-blue-500"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
          
          <OptimizedStatsCard
            title="Vélos électriques"
            value={stats?.electricBikes.toLocaleString() || '0'}
            trend="Disponibles maintenant"
            icon={Battery}
            iconColor="text-green-500"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
          
          <OptimizedStatsCard
            title="Places libres"
            value={stats?.totalDocksAvailable.toLocaleString() || '0'}
            trend={`Capacité moy: ${stats?.averageCapacity || 0}`}
            icon={ParkingCircle}
            iconColor="text-amber-500"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OptimizedVelibAvailabilityChart 
            data={availabilityTrends} 
            config={chartConfig} 
            isLoading={isLoading}
          />
          <OptimizedVelibDistributionChart 
            data={distributionData} 
            config={chartConfig} 
            isLoading={isLoading}
          />
        </div>

        {/* Graphique d'utilisation */}
        <OptimizedVelibUsageChart 
          data={usageData} 
          config={chartConfig} 
          isLoading={isLoading}
        />

        {/* Indicateur de fraîcheur des données */}
        {dataFreshness === 'outdated' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Données anciennes détectées
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Les données affichées sont anciennes. Cliquez sur "Sync Vélib" pour forcer une mise à jour.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
