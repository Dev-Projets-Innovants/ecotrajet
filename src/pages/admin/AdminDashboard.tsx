
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OptimizedStatsCard from '@/components/admin/dashboard/OptimizedStatsCard';
import OptimizedVelibAvailabilityChart from '@/components/admin/dashboard/OptimizedVelibAvailabilityChart';
import OptimizedVelibDistributionChart from '@/components/admin/dashboard/OptimizedVelibDistributionChart';
import OptimizedVelibUsageChart from '@/components/admin/dashboard/OptimizedVelibUsageChart';
import DashboardFilters from '@/components/admin/dashboard/DashboardFilters';
import { useOptimizedVelibData } from '@/hooks/useOptimizedVelibData';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bike,
  MapPin,
  Battery,
  ParkingCircle,
  AlertTriangle,
  CheckCircle,
  Clock
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
    refetchData
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

  const getDataFreshnessInfo = () => {
    switch (dataFreshness) {
      case 'fresh':
        return { icon: CheckCircle, color: 'text-green-500', label: 'Données récentes' };
      case 'stale':
        return { icon: Clock, color: 'text-yellow-500', label: 'Données légèrement anciennes' };
      case 'outdated':
        return { icon: AlertTriangle, color: 'text-red-500', label: 'Données obsolètes' };
      default:
        return { icon: Clock, color: 'text-gray-500', label: 'Statut inconnu' };
    }
  };

  if (error && !stats) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="text-center py-12">
          <Alert variant="destructive" className="max-w-md mx-auto mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <button 
            onClick={handleManualRefresh} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isManualRefreshing}
          >
            {isManualRefreshing ? 'Actualisation...' : 'Réessayer'}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const freshnessInfo = getDataFreshnessInfo();
  const FreshnessIcon = freshnessInfo.icon;

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
        />

        {/* Indicateur de fraîcheur des données */}
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <FreshnessIcon className={`h-3 w-3 ${freshnessInfo.color}`} />
              {freshnessInfo.label}
            </Badge>
            {dataFreshness === 'outdated' && (
              <Alert variant="destructive" className="flex-1">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Les données semblent obsolètes. Vérifiez la synchronisation Vélib.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

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
            timeRange={timeRange}
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
          timeRange={timeRange}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
