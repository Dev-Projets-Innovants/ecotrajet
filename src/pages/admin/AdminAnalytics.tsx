
import React, { useState } from 'react';
import { Calendar, Map, BarChart3, LineChart, BarChart, PieChart } from 'lucide-react';
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  Legend,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminAnalytics = () => {
  const [periodFilter, setPeriodFilter] = useState('month');

  // Mock data for charts
  const usageByRegionData = [
    { name: 'Paris', value: 2500 },
    { name: 'Lyon', value: 1800 },
    { name: 'Marseille', value: 1600 },
    { name: 'Bordeaux', value: 1400 },
    { name: 'Lille', value: 1200 },
    { name: 'Strasbourg', value: 900 },
    { name: 'Nantes', value: 800 },
    { name: 'Montpellier', value: 700 },
  ];

  const transportTypeData = [
    { name: 'Vélo', value: 35 },
    { name: 'Transport en commun', value: 30 },
    { name: 'Covoiturage', value: 20 },
    { name: 'Marche', value: 10 },
    { name: 'Autre', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  const emissionsSavedData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Fév', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Avr', amount: 3908 },
    { month: 'Mai', amount: 4800 },
    { month: 'Juin', amount: 3800 },
    { month: 'Juil', amount: 4300 },
    { month: 'Août', amount: 5600 },
    { month: 'Sep', amount: 7800 },
    { month: 'Oct', amount: 6500 },
    { month: 'Nov', amount: 5400 },
    { month: 'Déc', amount: 7300 },
  ];

  const hourlyUsageData = [
    { hour: '00h', users: 320 },
    { hour: '02h', users: 180 },
    { hour: '04h', users: 120 },
    { hour: '06h', users: 450 },
    { hour: '08h', users: 1800 },
    { hour: '10h', users: 1300 },
    { hour: '12h', users: 1600 },
    { hour: '14h', users: 1400 },
    { hour: '16h', users: 1560 },
    { hour: '18h', users: 1980 },
    { hour: '20h', users: 1620 },
    { hour: '22h', users: 980 },
  ];

  const dailyUsageData = [
    { day: 'Lun', users: 3200 },
    { day: 'Mar', users: 2900 },
    { day: 'Mer', users: 3100 },
    { day: 'Jeu', users: 3400 },
    { day: 'Ven', users: 3800 },
    { day: 'Sam', users: 2500 },
    { day: 'Dim', users: 2200 },
  ];

  const chartConfig = {
    emissions: {
      label: "CO2 (kg)",
      theme: { light: "#22c55e", dark: "#22c55e" },
    },
    usage: {
      label: "Utilisateurs",
      theme: { light: "#3b82f6", dark: "#3b82f6" },
    },
    region: {
      label: "Région",
      theme: { light: "#8b5cf6", dark: "#8b5cf6" },
    },
    transport: {
      label: "Type",
      theme: { light: "#f59e0b", dark: "#f59e0b" },
    },
  };

  return (
    <AdminLayout title="Analyse des données">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Vue d'ensemble</h2>
          <p className="text-gray-500 dark:text-gray-400">Analyse détaillée des données d'utilisation et d'impact</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
                <SelectItem value="all">Toutes les données</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Tabs for different charts */}
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Utilisation
            </TabsTrigger>
            <TabsTrigger value="emissions" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Émissions CO2
            </TabsTrigger>
            <TabsTrigger value="regions" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Par région
            </TabsTrigger>
            <TabsTrigger value="transport" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Types de transport
            </TabsTrigger>
          </TabsList>
          
          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation par heure de la journée</CardTitle>
                <CardDescription>Nombre d'utilisateurs actifs par heure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={hourlyUsageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          name="usage" 
                          stroke="#3b82f6" 
                          strokeWidth={3} 
                          dot={{ r: 3 }} 
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Utilisation par jour de la semaine</CardTitle>
                <CardDescription>Nombre d'utilisateurs actifs par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={dailyUsageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="users" name="usage" fill="#3b82f6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                    <ChartLegendContent />
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Emissions Tab */}
          <TabsContent value="emissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Émissions CO2 économisées par mois</CardTitle>
                <CardDescription>Total des émissions économisées en kg</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={emissionsSavedData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          name="emissions" 
                          fill="#22c55e" 
                          fillOpacity={0.3} 
                          stroke="#22c55e" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <ChartLegendContent />
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation par région</CardTitle>
                <CardDescription>Répartition des utilisateurs actifs par ville</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={usageByRegionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="region" fill="#8b5cf6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                    <ChartLegendContent />
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transport Types Tab */}
          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Types de transport utilisés</CardTitle>
                <CardDescription>Répartition des modes de transport écologiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={transportTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {transportTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
