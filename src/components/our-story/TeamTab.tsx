
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UsersIcon } from 'lucide-react';

export const TeamTab = () => {
  return (
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
  );
};
