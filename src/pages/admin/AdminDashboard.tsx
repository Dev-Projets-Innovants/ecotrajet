
import React from 'react';
import { 
  UserCheck, 
  Route, 
  Leaf, 
  Award,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import UserActivityChart from '@/components/admin/dashboard/UserActivityChart';
import EmissionsChart from '@/components/admin/dashboard/EmissionsChart';
import TripsByTimeChart from '@/components/admin/dashboard/TripsByTimeChart';
import { useDashboardData } from '@/components/admin/dashboard/useDashboardData';

const AdminDashboard = () => {
  const { userActivityData, emissionsData, tripsByTimeData, chartConfig } = useDashboardData();

  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid gap-6">
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
