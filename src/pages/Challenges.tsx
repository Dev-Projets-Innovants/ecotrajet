
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveChallenges from '@/components/challenges/ActiveChallenges';
import CompletedChallenges from '@/components/challenges/CompletedChallenges';
import CommunityProgress from '@/components/challenges/CommunityProgress';
import RecommendedChallenges from '@/components/challenges/RecommendedChallenges';

const Challenges = () => {
  return (
    <Layout title="Défis écologiques">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Défis écologiques</h1>
          <p className="text-gray-600">
            Participez à des défis individuels et collectifs pour réduire votre empreinte carbone et gagner des récompenses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CommunityProgress />
        </div>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="recommended">Recommandés</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6 mt-6">
            <ActiveChallenges />
          </TabsContent>
          
          <TabsContent value="recommended" className="space-y-6 mt-6">
            <RecommendedChallenges />
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6 mt-6">
            <CompletedChallenges />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Challenges;
