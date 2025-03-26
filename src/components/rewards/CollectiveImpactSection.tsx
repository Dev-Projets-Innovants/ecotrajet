
import React from "react";
import { TreeDeciduous, Leaf, Globe, Users, Bike, TrendingUp, Award, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CollectiveImpact } from "@/types/rewards";
import { Button } from "@/components/ui/button";

interface CollectiveImpactSectionProps {
  impact: CollectiveImpact;
}

export function CollectiveImpactSection({ impact }: CollectiveImpactSectionProps) {
  // Calculer les objectifs collectifs
  const co2Goal = 100000; // 100 tonnes
  const treesGoal = 10000;
  const distanceGoal = 1000000; // 1 million de km
  
  // Calculer les pourcentages
  const co2Percentage = Math.min(100, (impact.co2Saved / co2Goal) * 100);
  const treesPercentage = Math.min(100, (impact.treesEquivalent / treesGoal) * 100);
  const distancePercentage = Math.min(100, (impact.distanceCovered / distanceGoal) * 100);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Impact Collectif</h2>
        <p className="text-gray-600">Découvrez l'impact positif de la communauté ÉcoTrajet sur l'environnement</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-eco-light-green/70 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-eco-green" />
              CO₂ Économisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(impact.co2Saved / 1000).toFixed(1)} tonnes</div>
            <p className="text-sm text-muted-foreground">de CO₂ non émis dans l'atmosphère</p>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Objectif collectif</span>
                <span>{(co2Percentage).toFixed(1)}%</span>
              </div>
              <Progress value={co2Percentage} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">{co2Goal / 1000} tonnes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-eco-light-green/70 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TreeDeciduous className="mr-2 h-5 w-5 text-eco-green" />
              Équivalent Arbres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{impact.treesEquivalent.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">arbres virtuellement plantés</p>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Objectif collectif</span>
                <span>{(treesPercentage).toFixed(1)}%</span>
              </div>
              <Progress value={treesPercentage} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">{treesGoal.toLocaleString()} arbres</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-eco-light-green/70 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-eco-green" />
              Distance Parcourue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(impact.distanceCovered / 1000).toFixed(1)} km</div>
            <p className="text-sm text-muted-foreground">parcourus de manière écologique</p>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Objectif collectif</span>
                <span>{(distancePercentage).toFixed(1)}%</span>
              </div>
              <Progress value={distancePercentage} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">{distanceGoal / 1000} km</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-eco-green" />
              Impact Environnemental Cumulé
            </CardTitle>
            <CardDescription>L'effet positif de la communauté ÉcoTrajet sur notre planète</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg bg-muted/30">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="h-12 w-12 rounded-full bg-eco-light-green flex items-center justify-center mr-4">
                    <Bike className="h-6 w-6 text-eco-green" />
                  </div>
                  <div>
                    <div className="font-medium">Trajets écologiques réalisés</div>
                    <div className="text-sm text-muted-foreground">Tous modes de transport confondus</div>
                  </div>
                </div>
                <div className="text-3xl font-bold">{impact.tripsCompleted.toLocaleString()}</div>
              </div>
              
              <div className="bg-eco-light-green/20 p-4 rounded-lg">
                <div className="font-medium mb-2">Comparaison avec transport polluant</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Équivalent tours de la Terre en voiture évités</span>
                    <span className="font-medium">{(impact.distanceCovered / 40075).toFixed(1)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Équivalent vols Paris-New York évités</span>
                    <span className="font-medium">{Math.floor(impact.co2Saved / 1000)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Équivalent litres de carburant économisés</span>
                    <span className="font-medium">{Math.floor(impact.co2Saved * 0.42).toLocaleString()}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-eco-green" />
              Communauté ÉcoTrajet
            </CardTitle>
            <CardDescription>Des milliers d'utilisateurs engagés pour une mobilité plus verte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-4">
              <div className="text-center p-6 bg-eco-light-green/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-eco-green mx-auto mb-2" />
                <div className="text-4xl font-bold mb-2">{impact.participatingUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">utilisateurs actifs</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 rounded-lg border border-dashed">
                  <div className="text-sm text-muted-foreground mb-1">Distance moyenne</div>
                  <div className="text-lg font-medium">
                    {(impact.distanceCovered / impact.participatingUsers).toFixed(1)} km
                  </div>
                  <div className="text-xs text-muted-foreground">par utilisateur</div>
                </div>
                
                <div className="text-center p-4 rounded-lg border border-dashed">
                  <div className="text-sm text-muted-foreground mb-1">Trajets moyens</div>
                  <div className="text-lg font-medium">
                    {(impact.tripsCompleted / impact.participatingUsers).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">par utilisateur</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button>Partager notre impact</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-eco-green" />
            Les Défis Collectifs
          </CardTitle>
          <CardDescription>Ensemble, relevons de grands défis environnementaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-medium">Défi mondial : 1 million de kilomètres verts</div>
                  <div className="text-sm text-muted-foreground">Parcourons ensemble 1 million de kilomètres écologiques</div>
                </div>
                <div className="text-sm font-medium">{((impact.distanceCovered / distanceGoal) * 100).toFixed(1)}%</div>
              </div>
              <Progress value={(impact.distanceCovered / distanceGoal) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{impact.distanceCovered.toLocaleString()} km parcourus</span>
                <span>Objectif: {distanceGoal.toLocaleString()} km</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-medium">Défi national : 10 000 arbres virtuels</div>
                  <div className="text-sm text-muted-foreground">Équivalent à la plantation de 10 000 arbres en économies de CO₂</div>
                </div>
                <div className="text-sm font-medium">{((impact.treesEquivalent / treesGoal) * 100).toFixed(1)}%</div>
              </div>
              <Progress value={(impact.treesEquivalent / treesGoal) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{impact.treesEquivalent.toLocaleString()} arbres équivalents</span>
                <span>Objectif: {treesGoal.toLocaleString()} arbres</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
