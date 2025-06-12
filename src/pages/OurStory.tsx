
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OurStoryIntro } from '@/components/our-story/OurStoryIntro';
import { TimelineTab } from '@/components/our-story/TimelineTab';
import { ProblematiqueTab } from '@/components/our-story/ProblematiqueTab';
import { ObjectifsTab } from '@/components/our-story/ObjectifsTab';
import { TeamTab } from '@/components/our-story/TeamTab';
import { VisionSection } from '@/components/our-story/VisionSection';

const OurStory = () => {
  return (
    <Layout title="Notre Histoire | ÉcoTrajet">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
          Notre Histoire
        </h1>
        
        <OurStoryIntro />

        <Tabs defaultValue="timeline" className="mb-10">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="timeline">Notre Parcours</TabsTrigger>
            <TabsTrigger value="problematique">Problématique</TabsTrigger>
            <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
            <TabsTrigger value="team">L'Équipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="space-y-4">
            <TimelineTab />
          </TabsContent>

          <TabsContent value="problematique" className="space-y-4">
            <ProblematiqueTab />
          </TabsContent>

          <TabsContent value="objectifs" className="space-y-4">
            <ObjectifsTab />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamTab />
          </TabsContent>
        </Tabs>
        
        <VisionSection />
      </div>
    </Layout>
  );
};

export default OurStory;
