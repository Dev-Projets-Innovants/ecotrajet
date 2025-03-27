
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineBody } from '@/components/timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, BookIcon, UsersIcon, AwardIcon, ImageIcon, StarIcon, HistoryIcon } from 'lucide-react';

const OurStory = () => {
  return (
    <Layout title="Notre Histoire | ÉcoTrajet">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
          Notre Histoire
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            <span className="font-semibold text-eco-green">ÉcoTrajet</span> est né de la vision commune d'un groupe d'étudiants passionnés par la mobilité durable et les défis environnementaux urbains. Notre ambition : transformer la façon dont les Parisiens se déplacent en rendant les options écologiques plus accessibles, ludiques et communautaires.
          </p>
        </div>

        <Tabs defaultValue="timeline" className="mb-10">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="timeline">Notre Parcours</TabsTrigger>
            <TabsTrigger value="team">L'Équipe</TabsTrigger>
            <TabsTrigger value="school">Notre École</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5 text-eco-green" />
                  Chronologie du Projet
                </CardTitle>
                <CardDescription>
                  L'évolution d'ÉcoTrajet depuis sa conception
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline>
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Septembre 2023</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Naissance de l'idée pendant un atelier sur les mobilités durables à notre école. Premier brainstorming sur la façon de rendre la mobilité verte plus attractive.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Novembre 2023</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Élaboration du concept et des premières maquettes. Développement d'un prototype d'application centré sur la cartographie des alternatives vertes.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Janvier 2024</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Présentation du projet lors d'un hackathon environnemental. Premier prix dans la catégorie "Innovation urbaine" et rencontre avec des partenaires potentiels.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Mars 2024</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Lancement de la version bêta d'ÉcoTrajet avec l'intégration des données Vélib et transport en commun. Formation de l'équipe définitive et répartition des rôles.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Juin 2024</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody>
                      <p className="text-sm text-muted-foreground">
                        Lancement officiel d'ÉcoTrajet avec toutes les fonctionnalités actuelles: carte interactive, défis écologiques, calculateur d'empreinte et communauté d'utilisateurs engagés.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                </Timeline>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-eco-green" />
                  L'Équipe Fondatrice
                </CardTitle>
                <CardDescription>
                  Les étudiants derrière le projet ÉcoTrajet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Marion Etienne</h3>
                      <p className="text-sm text-muted-foreground mb-2">Co-fondatrice & Développement Durable</p>
                      <p className="text-sm">
                        Étudiante en Master Développement Durable et Économie Circulaire, Marion apporte son expertise environnementale et sa vision de la mobilité verte urbaine.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop" />
                      <AvatarFallback>TL</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Thomas Laurent</h3>
                      <p className="text-sm text-muted-foreground mb-2">Co-fondateur & Développement</p>
                      <p className="text-sm">
                        Passionné de code et d'impact social, Thomas a développé l'architecture technique de l'application et coordonne le développement des fonctionnalités.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Sophie Clément</h3>
                      <p className="text-sm text-muted-foreground mb-2">UX Design & Communauté</p>
                      <p className="text-sm">
                        En charge de l'expérience utilisateur et de l'animation de la communauté, Sophie travaille à rendre l'application aussi intuitive qu'engageante.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop" />
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">Alex Benali</h3>
                      <p className="text-sm text-muted-foreground mb-2">Data & Partenariats</p>
                      <p className="text-sm">
                        Expert en analyse de données, Alex gère l'intégration des API de mobilité et le développement des partenariats avec les acteurs de transport parisiens.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Notre équipe s'est formée lors de nos études, réunie par la conviction que la technologie peut être un puissant levier pour la transition écologique.
                  </p>
                  <p className="text-sm font-medium">
                    "Nous croyons qu'en rendant les choix écologiques plus accessibles et ludiques, nous pouvons tous ensemble transformer la mobilité urbaine."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="school" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-eco-green" />
                  Notre École
                </CardTitle>
                <CardDescription>
                  Le berceau d'ÉcoTrajet et notre formation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                    alt="Notre campus" 
                    className="w-full h-64 object-cover" 
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <AwardIcon className="h-4 w-4 text-eco-green" />
                      L'École du Numérique Responsable
                    </h3>
                    <p className="text-sm mt-2">
                      Notre formation au sein de l'École du Numérique Responsable (ENR) nous a permis d'acquérir les compétences techniques tout en développant une vision éthique du numérique, orientée vers l'impact positif et la durabilité.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-eco-green" />
                      Notre Parcours Académique
                    </h3>
                    <p className="text-sm mt-2">
                      Le projet ÉcoTrajet est né dans le cadre du programme "Tech for Good" de notre établissement, qui encourage les initiatives technologiques à impact social et environnemental positif.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-eco-green" />
                      Les Valeurs Transmises
                    </h3>
                    <p className="text-sm mt-2">
                      Notre formation nous a inculqué les valeurs d'innovation responsable, d'inclusion et d'engagement écologique que nous avons intégrées au cœur d'ÉcoTrajet. Nous avons appris à concevoir des solutions numériques qui répondent aux enjeux contemporains.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-eco-light-green/30 rounded-lg">
                  <blockquote className="italic text-sm">
                    "L'innovation technologique doit être mise au service de la transition écologique et de l'amélioration de la qualité de vie urbaine. C'est cette vision que nous avons souhaité incarner à travers ÉcoTrajet."
                  </blockquote>
                  <p className="text-right text-sm font-medium mt-2">— La Direction de l'ENR</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Notre Vision pour l'Avenir</h2>
          <p className="text-gray-700 mb-6">
            ÉcoTrajet n'est qu'au début de son aventure. Nous travaillons continuellement à enrichir l'application avec de nouvelles fonctionnalités et à étendre notre communauté d'utilisateurs engagés pour la mobilité durable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Extension géographique</h3>
              <p className="text-sm">Après Paris, nous souhaitons déployer ÉcoTrajet dans d'autres métropoles françaises puis européennes.</p>
            </div>
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Nouvelles fonctionnalités</h3>
              <p className="text-sm">Intégration de l'intelligence artificielle pour personnaliser les recommandations de trajets et optimiser l'impact écologique.</p>
            </div>
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Impact mesurable</h3>
              <p className="text-sm">Développement d'outils permettant de quantifier précisément l'impact collectif de notre communauté sur la réduction des émissions carbone.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OurStory;
