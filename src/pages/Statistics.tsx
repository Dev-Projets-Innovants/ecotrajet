
import React from 'react';
import { Layout } from '@/components/Layout';
import UserStatsOverview from '@/components/statistics/UserStatsOverview';
import TransportationChart from '@/components/statistics/TransportationChart';
import EmissionsSaved from '@/components/statistics/EmissionsSaved';
import GoalTracker from '@/components/statistics/GoalTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Statistics = () => {
  return (
    <Layout title="Mes statistiques">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Mes statistiques de transport</h1>
          <p className="text-gray-600">
            Suivez vos performances écologiques et l'impact de vos choix de transport sur l'environnement.
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Vue générale</TabsTrigger>
            <TabsTrigger value="daily">Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <UserStatsOverview />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart />
              <EmissionsSaved />
            </div>
            <GoalTracker />
          </TabsContent>
          
          <TabsContent value="daily" className="space-y-6 mt-6">
            <UserStatsOverview timeframe="daily" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart timeframe="daily" />
              <EmissionsSaved timeframe="daily" />
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-6 mt-6">
            <UserStatsOverview timeframe="weekly" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart timeframe="weekly" />
              <EmissionsSaved timeframe="weekly" />
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-6 mt-6">
            <UserStatsOverview timeframe="monthly" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart timeframe="monthly" />
              <EmissionsSaved timeframe="monthly" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Statistics;
