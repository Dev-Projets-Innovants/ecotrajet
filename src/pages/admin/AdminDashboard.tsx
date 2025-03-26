import React from 'react';
import { 
  UserCheck, 
  Route, 
  Leaf, 
  Users, 
  TrendingUp, 
  CalendarClock,
  Award
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from 'recharts';

const AdminDashboard = () => {
  // Mock data for charts
  const userActivityData = [
    { name: 'Jan', Actifs: 4000, Nouveaux: 2400 },
    { name: 'Fév', Actifs: 3000, Nouveaux: 1398 },
    { name: 'Mar', Actifs: 2000, Nouveaux: 9800 },
    { name: 'Avr', Actifs: 2780, Nouveaux: 3908 },
    { name: 'Mai', Actifs: 1890, Nouveaux: 4800 },
    { name: 'Juin', Actifs: 2390, Nouveaux: 3800 },
    { name: 'Juil', Actifs: 3490, Nouveaux: 4300 },
  ];

  const emissionsData = [
    { name: 'Jan', Économisées: 1200 },
    { name: 'Fév', Économisées: 1900 },
    { name: 'Mar', Économisées: 2400 },
    { name: 'Avr', Économisées: 2700 },
    { name: 'Mai', Économisées: 3500 },
    { name: 'Juin', Économisées: 4100 },
    { name: 'Juil', Économisées: 4900 },
  ];

  const tripsByTimeData = [
    { hour: '6h', trips: 1200 },
    { hour: '8h', trips: 2900 },
    { hour: '10h', trips: 1700 },
    { hour: '12h', trips: 1500 },
    { hour: '14h', trips: 1800 },
    { hour: '16h', trips: 2800 },
    { hour: '18h', trips: 3200 },
    { hour: '20h', trips: 1800 },
    { hour: '22h', trips: 1000 },
  ];

  const chartConfig = {
    users: {
      label: "Utilisateurs",
      theme: { light: "#10b981", dark: "#10b981" },
    },
    newUsers: {
      label: "Nouveaux",
      theme: { light: "#60a5fa", dark: "#60a5fa" },
    },
    emissions: {
      label: "CO2 (kg)",
      theme: { light: "#22c55e", dark: "#22c55e" },
    },
    trips: {
      label: "Trajets",
      theme: { light: "#f59e0b", dark: "#f59e0b" },
    },
  };

  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-eco-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18,549</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Trajets totaux</CardTitle>
              <Route className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">123,894</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">CO₂ économisé (kg)</CardTitle>
              <Leaf className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">485,204</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Badges débloqués</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28,392</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +9.7% ce mois
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Utilisateurs actifs vs nouveaux utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={chartConfig}>
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userActivityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="Actifs" name="users" fill="#10b981" />
                        <Bar dataKey="Nouveaux" name="newUsers" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                    <ChartLegend content={<ChartLegendContent />} />
                  </>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Émissions CO₂</CardTitle>
              <CardDescription>Émissions économisées (kg) par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={chartConfig}>
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={emissionsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="Économisées" name="emissions" fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <ChartLegendContent />
                  </>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trajets par heure</CardTitle>
            <CardDescription>Nombre de trajets par heure de la journée</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tripsByTimeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="trips" name="trips" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
