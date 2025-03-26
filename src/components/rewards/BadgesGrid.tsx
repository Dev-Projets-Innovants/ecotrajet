
import React, { useState } from "react";
import { Check, Lock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgeType } from "@/types/rewards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface BadgesGridProps {
  badges: BadgeType[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  
  const filteredBadges = selectedCategory === "all" 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);
  
  const categories = [
    { id: "all", name: "Tous" },
    { id: "debutant", name: "Débutant" },
    { id: "intermediaire", name: "Intermédiaire" },
    { id: "expert", name: "Expert" },
    { id: "special", name: "Spécial" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Collection de Badges</h2>
          <p className="text-gray-600">Débloquez des badges en atteignant différents objectifs écologiques</p>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-eco-green">{badges.filter(b => b.obtained).length}</span> sur {badges.length} badges débloqués
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full flex overflow-x-auto pb-2 mb-6 bg-transparent gap-2 h-auto">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="px-4 py-2 rounded data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBadges.map(badge => (
          <Dialog key={badge.id}>
            <DialogTrigger asChild>
              <Card 
                className={`cursor-pointer group transition-all duration-300 hover:shadow-md ${
                  badge.obtained ? 'border-eco-green bg-eco-light-green/10' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedBadge(badge)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className={`relative h-24 w-24 flex items-center justify-center rounded-full mb-4 ${
                    badge.obtained ? 'bg-eco-light-green' : 'bg-gray-100'
                  }`}>
                    <div className="text-4xl">{badge.icon}</div>
                    {badge.obtained && (
                      <div className="absolute -right-1 -top-1 bg-eco-green text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    {!badge.obtained && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-500/40">
                        <Lock className="h-8 w-8 text-white/80" />
                      </div>
                    )}
                  </div>
                  <h3 className={`font-medium text-sm ${badge.obtained ? 'text-gray-800' : 'text-gray-500'}`}>
                    {badge.title}
                  </h3>
                  {badge.progress !== undefined && !badge.obtained && (
                    <Progress value={badge.progress} className="h-1 w-16 mt-2" />
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl mr-2">{badge.icon}</span>
                  {badge.title}
                </DialogTitle>
                <DialogDescription className="pt-2">{badge.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Condition d'obtention :</div>
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{badge.condition}</p>
                  </div>
                </div>
                
                {badge.obtained ? (
                  <div className="bg-eco-light-green/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-eco-green" />
                      <span className="font-medium text-eco-green">Badge débloqué</span>
                    </div>
                    {badge.unlockedAt && (
                      <p className="text-sm text-gray-600 mt-1">Obtenu le {badge.unlockedAt}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{badge.progress || 0}%</span>
                    </div>
                    <Progress value={badge.progress || 0} className="h-2" />
                    <p className="text-xs text-gray-500 italic">Continuez vos trajets écologiques pour débloquer ce badge</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
