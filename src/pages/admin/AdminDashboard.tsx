
import React, { useState } from 'react';
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
  ParkingCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import VelibAvailabilityChart from '@/components/admin/dashboard/VelibAvailabilityChart';
import VelibDistributionChart from '@/components/admin/dashboard/VelibDistributionChart';
import VelibUsageChart from '@/components/admin/dashboard/VelibUsageChart';
import { useVelibDashboardData } from '@/components/admin/dashboard/useVelibDashboardData';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { 
    stats,
    availabilityTrends, 
    distributionData, 
    usageData,
    chartConfig,
    isLoading,
    error,
    refetchData
  } = useVelibDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchData();
      toast({
        title: "Données actualisées",
        description: "Les données Vélib' ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données Vélib'.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green"></div>
          <span className="ml-2 text-gray-600">Chargement des données Vélib'...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tableau de bord Vélib'">
      <div className="grid gap-6">
        {/* Stats Cards Header with Refresh Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Statistiques Vélib' en temps réel</h2>
            <p className="text-sm text-gray-600">
              Dernière mise à jour: {stats ? new Date(stats.lastUpdated).toLocaleString('fr-FR') : 'N/A'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Stations actives"
            value={stats?.activeStations.toLocaleString() || '0'}
            trend={`${stats?.totalStations || 0} au total`}
            icon={MapPin}
            iconColor="text-eco-green"
          />
          
          <StatsCard
            title="Vélos disponibles"
            value={stats?.totalBikesAvailable.toLocaleString() || '0'}
            trend={`${stats?.mechanicalBikes || 0} mécaniques`}
            icon={Bike}
            iconColor="text-blue-500"
          />
          
          <StatsCard
            title="Vélos électriques"
            value={stats?.electricBikes.toLocaleString() || '0'}
            trend="Disponibles maintenant"
            icon={Battery}
            iconColor="text-green-500"
          />
          
          <StatsCard
            title="Places libres"
            value={stats?.totalDocksAvailable.toLocaleString() || '0'}
            trend={`Capacité moy: ${stats?.averageCapacity || 0}`}
            icon={ParkingCircle}
            iconColor="text-amber-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VelibAvailabilityChart data={availabilityTrends} config={chartConfig} />
          <VelibDistributionChart data={distributionData} config={chartConfig} />
        </div>

        {/* Usage Chart */}
        <VelibUsageChart data={usageData} config={chartConfig} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
