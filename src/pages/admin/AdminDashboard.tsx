
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import OptimizedStatsCard from '@/components/admin/dashboard/OptimizedStatsCard';
import OptimizedVelibAvailabilityChart from '@/components/admin/dashboard/OptimizedVelibAvailabilityChart';
import OptimizedVelibDistributionChart from '@/components/admin/dashboard/OptimizedVelibDistributionChart';
import OptimizedVelibUsageChart from '@/components/admin/dashboard/OptimizedVelibUsageChart';
import DashboardFilters from '@/components/admin/dashboard/DashboardFilters';
import { useOptimizedVelibData } from '@/hooks/useOptimizedVelibData';
import { useAuth } from '@/hooks/useAuth';
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
  ParkingCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Rediriger les non-admins vers le dashboard utilisateur
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, loading, navigate]);

  // Rediriger les utilisateurs non connectés vers la page de connexion
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  const { 
    stats,
    availabilityTrends, 
    distributionData, 
    usageData,
    chartConfig,
    isLoading,
    error,
    lastUpdated,
    refetchData
  } = useOptimizedVelibData(autoRefresh);

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

  // Afficher un état de chargement pendant la vérification
  if (loading) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  // Ne rien afficher pour les non-admins (ils seront redirigés)
  if (!isAdmin) {
    return null;
  }

  if (error && !stats) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleManualRefresh} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </button>
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
