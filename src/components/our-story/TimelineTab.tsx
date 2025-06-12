
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineBody } from '@/components/timeline';
import { CalendarIcon, HistoryIcon } from 'lucide-react';

export const TimelineTab = () => {
  return (
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
  );
};
