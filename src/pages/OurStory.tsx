
import React from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineBody } from '@/components/timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, BookIcon, UsersIcon, AwardIcon, ImageIcon, StarIcon, HistoryIcon, TargetIcon, AlertTriangleIcon } from 'lucide-react';

const OurStory = () => {
  return (
    <Layout title="Notre Histoire | ÉcoTrajet">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
          Notre Histoire
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Notre aventure a commencé en <span className="font-semibold text-eco-green">novembre 2024</span>, née d'une observation simple mais essentielle : les services de Vélib' à Paris, malgré leur popularité croissante, ne mettent pas suffisamment en valeur leur dimension écologique et ne favorisent pas l'engagement communautaire qui pourrait amplifier leur impact positif.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Paris, comme de nombreuses métropoles mondiales, fait face à des défis environnementaux majeurs : pollution atmosphérique, émissions de CO2, congestion urbaine. La mobilité douce représente une réponse concrète à ces problématiques, et le réseau Vélib', avec ses <span className="font-semibold">1400 stations réparties sur 55 communes</span>, constitue un atout considérable mais encore sous-exploité dans cette transition.
          </p>
        </div>

        <Tabs defaultValue="timeline" className="mb-10">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="timeline">Notre Parcours</TabsTrigger>
            <TabsTrigger value="problematique">Problématique</TabsTrigger>
            <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
            <TabsTrigger value="team">L'Équipe</TabsTrigger>
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
                      <TimelineTitle>Novembre 2024</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Naissance du projet ÉcoTrajet. Observation des limites actuelles des services Vélib' en matière de valorisation écologique et d'engagement communautaire. Formation de l'équipe et première analyse de l'existant.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Décembre 2024</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Identification précise de la problématique et définition des objectifs quantitatifs et qualitatifs. Élaboration du concept et des premières maquettes centrées sur l'impact environnemental.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Janvier 2025</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Développement de l'architecture technique et création du prototype. Intégration des données Vélib' et développement des fonctionnalités de calcul d'impact carbone.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineConnector />
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Mars 2025</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        Lancement de la version bêta d'ÉcoTrajet avec système de défis écologiques et communauté d'utilisateurs. Premiers tests avec un groupe restreint d'utilisateurs parisiens.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                  
                  <TimelineItem>
                    <TimelineHeader>
                      <TimelineIcon>
                        <CalendarIcon className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>Juin 2025</TimelineTitle>
                    </TimelineHeader>
                    <TimelineBody>
                      <p className="text-sm text-muted-foreground">
                        Lancement officiel d'ÉcoTrajet avec toutes les fonctionnalités : carte interactive, alertes Vélib', calculateur d'empreinte carbone, système de récompenses et communauté d'utilisateurs engagés.
                      </p>
                    </TimelineBody>
                  </TimelineItem>
                </Timeline>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problematique" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-5 w-5 text-eco-green" />
                  Problématique Identifiée
                </CardTitle>
                <CardDescription>
                  Les défis que nous adressons dans l'écosystème Vélib'
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
                    <h3 className="font-semibold text-lg mb-2 text-orange-800">Absence de dimension écologique</h3>
                    <p className="text-sm text-orange-700">
                      Les applications existantes se concentrent uniquement sur l'aspect pratique (localisation, disponibilité) sans mettre en valeur ni quantifier l'impact environnemental positif de chaque trajet. Cette absence prive les utilisateurs d'une source importante de motivation et de satisfaction.
                    </p>
                  </div>
                  
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
                    <h3 className="font-semibold text-lg mb-2 text-blue-800">Manque d'engagement communautaire</h3>
                    <p className="text-sm text-blue-700">
                      L'utilisation des Vélib' reste une expérience individuelle, sans partage ni émulation collective qui pourraient renforcer l'adoption et la fidélisation.
                    </p>
                  </div>
                  
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/50">
                    <h3 className="font-semibold text-lg mb-2 text-purple-800">Difficulté à quantifier l'impact positif</h3>
                    <p className="text-sm text-purple-700">
                      Les utilisateurs n'ont aucun moyen de mesurer concrètement leur contribution environnementale, ce qui diminue le sentiment d'accomplissement et la perception de la valeur ajoutée de ce mode de transport.
                    </p>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50/50">
                    <h3 className="font-semibold text-lg mb-2 text-red-800">Motivation insuffisante</h3>
                    <p className="text-sm text-red-700">
                      L'absence de mécanismes de récompense et de reconnaissance limite l'engagement à long terme des utilisateurs et freine le développement de comportements vertueux durables. Les utilisateurs manquent de reconnaissance tangible et de stimulation continue pour transformer leurs actions ponctuelles en habitudes quotidiennes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objectifs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="h-5 w-5 text-eco-green" />
                  Nos Objectifs
                </CardTitle>
                <CardDescription>
                  Des ambitions précises pour transformer la mobilité urbaine parisienne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-eco-green flex items-center gap-2">
                      <span className="bg-eco-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                      Objectifs Quantitatifs
                    </h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-eco-green pl-4">
                        <p className="font-medium">500 utilisateurs actifs</p>
                        <p className="text-sm text-muted-foreground">Dans les 6 premiers mois suivant le lancement</p>
                      </div>
                      <div className="border-l-4 border-eco-green pl-4">
                        <p className="font-medium">10% de réduction d'empreinte carbone</p>
                        <p className="text-sm text-muted-foreground">En moyenne pour les déplacements urbains des utilisateurs</p>
                      </div>
                      <div className="border-l-4 border-eco-green pl-4">
                        <p className="font-medium">40% de taux de rétention</p>
                        <p className="text-sm text-muted-foreground">Après 3 mois d'utilisation, témoignant de la valeur ajoutée réelle perçue</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-xl mb-4 text-eco-green flex items-center gap-2">
                      <span className="bg-eco-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                      Objectifs Qualitatifs
                    </h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-eco-light-green pl-4">
                        <p className="font-medium">Créer une communauté engagée</p>
                        <p className="text-sm text-muted-foreground">Transformer l'usage individuel en mouvement collectif pour la mobilité verte</p>
                      </div>
                      <div className="border-l-4 border-eco-light-green pl-4">
                        <p className="font-medium">Sensibiliser efficacement</p>
                        <p className="text-sm text-muted-foreground">À l'impact environnemental des choix de transport quotidiens</p>
                      </div>
                      <div className="border-l-4 border-eco-light-green pl-4">
                        <p className="font-medium">Améliorer l'expérience utilisateur</p>
                        <p className="text-sm text-muted-foreground">Des services Vélib' par une interface intuitive et agréable</p>
                      </div>
                      <div className="border-l-4 border-eco-light-green pl-4">
                        <p className="font-medium">Développer des partenariats</p>
                        <p className="text-sm text-muted-foreground">Avec la ville de Paris et les acteurs clés de la mobilité urbaine</p>
                      </div>
                      <div className="border-l-4 border-eco-light-green pl-4">
                        <p className="font-medium">Devenir la référence</p>
                        <p className="text-sm text-muted-foreground">Dans le domaine des applications de mobilité durable</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                  Une équipe alliant expertise technique et engagement environnemental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" />
                      <AvatarFallback>M1</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M1</h3>
                      <p className="text-sm text-muted-foreground mb-2">Chef de projet & Développeur Fullstack</p>
                      <p className="text-sm">
                        Pilote la vision globale du projet et coordonne le développement technique de l'ensemble de l'application ÉcoTrajet.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop" />
                      <AvatarFallback>M2</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M2</h3>
                      <p className="text-sm text-muted-foreground mb-2">Développeur Backend & DevOps</p>
                      <p className="text-sm">
                        Expert en architecture backend et déploiement, responsable de l'infrastructure technique et de la performance de l'application.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop" />
                      <AvatarFallback>M3</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M3</h3>
                      <p className="text-sm text-muted-foreground mb-2">Architecte Infrastructure</p>
                      <p className="text-sm">
                        Conçoit et supervise l'architecture technique globale, garantit la scalabilité et la robustesse de la plateforme.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop" />
                      <AvatarFallback>M4</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M4</h3>
                      <p className="text-sm text-muted-foreground mb-2">Expert Écologique</p>
                      <p className="text-sm">
                        Apporte son expertise en développement durable et veille à l'alignement du projet avec les enjeux environnementaux actuels.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
                      <AvatarFallback>M5</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M5</h3>
                      <p className="text-sm text-muted-foreground mb-2">UX/UI Designer</p>
                      <p className="text-sm">
                        Responsable de l'expérience utilisateur et de l'interface, crée une application intuitive et engageante pour tous les utilisateurs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-eco-light-green">
                      <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" />
                      <AvatarFallback>M6</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">M6</h3>
                      <p className="text-sm text-muted-foreground mb-2">Chargé de Documentation & Reporting</p>
                      <p className="text-sm">
                        Gère la documentation technique, les rapports de performance et assure la communication sur l'impact du projet.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Notre équipe allie expertise technique et engagement environnemental pour donner vie à cette vision innovante de transformation de la mobilité urbaine parisienne.
                  </p>
                  <p className="text-sm font-medium">
                    "Nous croyons qu'en rendant les choix écologiques plus accessibles et ludiques, nous pouvons tous ensemble transformer la mobilité urbaine."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Notre Vision pour l'Avenir</h2>
          <p className="text-gray-700 mb-6">
            La ville de Paris a affiché des ambitions fortes en matière de réduction de l'empreinte carbone et d'amélioration de la qualité de vie urbaine. ÉcoTrajet s'inscrit parfaitement dans cette dynamique en proposant une solution numérique qui valorise et amplifie les bénéfices environnementaux de l'utilisation des Vélib', tout en créant une expérience utilisateur enrichie et engageante.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Extension géographique</h3>
              <p className="text-sm">Après Paris, nous souhaitons déployer ÉcoTrajet dans d'autres métropoles françaises puis européennes.</p>
            </div>
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Innovation continue</h3>
              <p className="text-sm">Intégration de l'intelligence artificielle pour personnaliser les recommandations et optimiser l'impact écologique.</p>
            </div>
            <div className="p-4 border border-eco-light-green rounded-lg">
              <h3 className="font-medium text-eco-green mb-2">Impact mesurable</h3>
              <p className="text-sm">Développement d'outils permettant de quantifier précisément l'impact collectif sur la réduction des émissions carbone.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OurStory;
