
/**
 * Page de statistiques utilisateur
 * 
 * Cette page présente aux utilisateurs un tableau de bord détaillé de leurs statistiques
 * de transport et de leur impact environnemental. Elle permet de visualiser différentes
 * métriques selon plusieurs périodes (vue générale, quotidienne, hebdomadaire, mensuelle).
 * 
 * Fonctionnalités:
 * - Vue d'ensemble des performances écologiques
 * - Graphiques de répartition des modes de transport
 * - Suivi des émissions économisées
 * - Objectifs écologiques personnalisés
 * - Navigation par onglets entre différentes périodes
 */

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
        {/* En-tête de la page */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Mes statistiques de transport</h1>
          <p className="text-gray-600">
            Suivez vos performances écologiques et l'impact de vos choix de transport sur l'environnement.
          </p>
        </div>
        
        {/* Navigation par onglets pour les différentes périodes */}
        <Tabs defaultValue="overview" className="mb-6">
          {/* Barre d'onglets responsive */}
          <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Vue générale</TabsTrigger>
            <TabsTrigger value="daily">Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>
          
          {/* Contenu de l'onglet Vue générale */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Aperçu global des statistiques utilisateur */}
            <UserStatsOverview />
            {/* Graphiques de répartition des modes de transport et des émissions économisées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart />
              <EmissionsSaved />
            </div>
            {/* Suivi des objectifs écologiques personnels */}
            <GoalTracker />
          </TabsContent>
          
          {/* Contenu de l'onglet Quotidien */}
          <TabsContent value="daily" className="space-y-6 mt-6">
            {/* Les mêmes composants mais configurés pour afficher les données quotidiennes */}
            <UserStatsOverview timeframe="daily" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart timeframe="daily" />
              <EmissionsSaved timeframe="daily" />
            </div>
          </TabsContent>
          
          {/* Contenu de l'onglet Hebdomadaire */}
          <TabsContent value="weekly" className="space-y-6 mt-6">
            {/* Les mêmes composants mais configurés pour afficher les données hebdomadaires */}
            <UserStatsOverview timeframe="weekly" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportationChart timeframe="weekly" />
              <EmissionsSaved timeframe="weekly" />
            </div>
          </TabsContent>
          
          {/* Contenu de l'onglet Mensuel */}
          <TabsContent value="monthly" className="space-y-6 mt-6">
            {/* Les mêmes composants mais configurés pour afficher les données mensuelles */}
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
