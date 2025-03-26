
import React from "react";
import { Leaf, Trophy, Zap, TreeDeciduous } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserReward } from "@/types/rewards";

interface UserProgressSectionProps {
  userRewards: UserReward;
}

export function UserProgressSection({ userRewards }: UserProgressSectionProps) {
  const { ecoPoints, currentLevel, nextLevel, progressToNextLevel, badges } = userRewards;
  const earnedBadges = badges.filter(b => b.obtained).length;
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-eco-light-green to-eco-light-blue p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${currentLevel.title}`} alt="Avatar" />
              <AvatarFallback>{currentLevel.icon}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <p className="text-sm text-eco-green font-medium">Niveau {currentLevel.level}</p>
              <h3 className="text-2xl font-bold">{currentLevel.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {userRewards.selectedTitle || "Explorateur Écologique"}
              </p>
            </div>
            <div className="md:ml-auto flex flex-col items-center md:items-end">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-eco-green mr-2" />
                <span className="text-2xl font-bold">{ecoPoints}</span>
              </div>
              <p className="text-sm text-gray-600">points éco</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progression vers {nextLevel.title}</span>
              <span className="text-sm font-medium">{progressToNextLevel}%</span>
            </div>
            <Progress 
              value={progressToNextLevel} 
              className="h-3 bg-gray-100" 
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{currentLevel.minPoints} pts</span>
              <span>{nextLevel.minPoints} pts</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-eco-light-green/30 border-0">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Badges débloqués</p>
                  <p className="text-xl font-bold">{earnedBadges} / {badges.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-eco-light-green flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-eco-green" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-eco-light-blue/30 border-0">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CO₂ Économisé</p>
                  <p className="text-xl font-bold">42,6 kg</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-eco-light-blue flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-eco-blue" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-eco-light-green/30 border-0">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Équivalent arbres</p>
                  <p className="text-xl font-bold">4,2</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-eco-light-green flex items-center justify-center">
                  <TreeDeciduous className="h-5 w-5 text-eco-green" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Votre parcours écologique</h3>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-eco-light-green ml-6 z-0"></div>
          <div className="space-y-6 relative z-10">
            {[...Array(5)].map((_, i) => {
              const isCompleted = i < currentLevel.level;
              const isCurrent = i === currentLevel.level - 1;
              return (
                <div key={i} className="flex items-start">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-eco-green text-white' : isCurrent ? 'bg-eco-light-green border-2 border-eco-green' : 'bg-gray-100'}`}>
                    {isCompleted ? (
                      <Leaf className="h-6 w-6" />
                    ) : (
                      <span className="text-gray-500 font-medium">{i + 1}</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className={`font-semibold ${isCompleted ? 'text-eco-green' : isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                      Niveau {i + 1}: {["Débutant Écolo", "Cycliste Conscient", "Aventurier Vert", "Champion Durable", "Maître Écologique"][i]}
                    </div>
                    <p className={`text-sm ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                      {[
                        "Premiers pas dans l'écologie urbaine",
                        "Régulièrement en mouvement écologique",
                        "Adopte pleinement la mobilité durable",
                        "Référence en déplacement écologique",
                        "Expert et ambassadeur de l'éco-mobilité"
                      ][i]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
