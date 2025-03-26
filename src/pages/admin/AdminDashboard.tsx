import React, { useState } from 'react';
import { 
  UserCheck, 
  Route, 
  Leaf, 
  Award,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import UserActivityChart from '@/components/admin/dashboard/UserActivityChart';
import EmissionsChart from '@/components/admin/dashboard/EmissionsChart';
import TripsByTimeChart from '@/components/admin/dashboard/TripsByTimeChart';
import { useDashboardData } from '@/components/admin/dashboard/useDashboardData';
import { toast } from '@/components/ui/toaster';

const AdminDashboard = () => {
  const { 
    userActivityData, 
    emissionsData, 
    tripsByTimeData, 
    chartConfig,
    refetchData 
  } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchData();
      toast({
        title: "Données actualisées",
        description: "Les données du tableau de bord ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid gap-6">
        {/* Stats Cards Header with Refresh Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Statistiques</h2>
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
            title="Utilisateurs actifs"
            value="18,549"
            trend="+12.5% ce mois"
            icon={UserCheck}
            iconColor="text-eco-green"
          />
          
          <StatsCard
            title="Trajets totaux"
            value="123,894"
            trend="+8.2% ce mois"
            icon={Route}
            iconColor="text-blue-500"
          />
          
          <StatsCard
            title="CO₂ économisé (kg)"
            value="485,204"
            trend="+15.3% ce mois"
            icon={Leaf}
            iconColor="text-green-500"
          />
          
          <StatsCard
            title="Badges débloqués"
            value="28,392"
            trend="+9.7% ce mois"
            icon={Award}
            iconColor="text-amber-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserActivityChart data={userActivityData} config={chartConfig} />
          <EmissionsChart data={emissionsData} config={chartConfig} />
        </div>

        {/* Third chart */}
        <TripsByTimeChart data={tripsByTimeData} config={chartConfig} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
