
import React, { useState } from "react";
import { Trophy, Users, User, Medal, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardUser } from "@/types/rewards";

interface LeaderboardSectionProps {
  leaderboard: LeaderboardUser[];
}

export function LeaderboardSection({ leaderboard }: LeaderboardSectionProps) {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLeaderboard = leaderboard
    .filter(user => 
      (tab === "all" || (tab === "friends" && user.isFriend)) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.rank - b.rank);
  
  const currentUser = leaderboard.find(user => user.id === "current");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Classement Éco-Mobilité</h2>
        <p className="text-gray-600">Comparez vos performances avec d'autres utilisateurs écologiques</p>
      </div>
      
      {currentUser && (
        <Card className="bg-eco-light-green/20 border-eco-light-green">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex items-center min-w-[3rem] font-bold text-xl">
                #{currentUser.rank}
              </div>
              <Avatar className="h-12 w-12 border-2 border-eco-green">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-muted-foreground">Niveau {currentUser.level}</div>
              </div>
              <div className="flex items-center gap-1 font-semibold">
                <Tabs className="h-5 w-5 text-eco-green" />
                <span>{currentUser.points}</span>
                <span className="text-sm text-muted-foreground">pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <Tabs value={tab} onValueChange={setTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              <Trophy className="mr-2 h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="mr-2 h-4 w-4" />
              Amis
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-8" 
            placeholder="Rechercher un utilisateur" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
              <div className="col-span-1">Rang</div>
              <div className="col-span-7">Utilisateur</div>
              <div className="col-span-2 text-right">Niveau</div>
              <div className="col-span-2 text-right">Points</div>
            </div>
            
            <div className="divide-y">
              {filteredLeaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`grid grid-cols-12 gap-4 p-4 items-center ${
                    user.id === "current" ? "bg-eco-light-green/10" : ""
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    {user.rank <= 3 ? (
                      <div className={`
                        h-8 w-8 rounded-full flex items-center justify-center text-white
                        ${user.rank === 1 ? 'bg-yellow-400' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}
                      `}>
                        <Trophy className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="text-gray-600 font-medium">#{user.rank}</div>
                    )}
                  </div>
                  <div className="col-span-7 flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      {user.isFriend && (
                        <div className="text-xs text-eco-green">Ami</div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-sm">Niveau {user.level}</div>
                  <div className="col-span-2 text-right font-medium">{user.points} pts</div>
                </div>
              ))}
              
              {filteredLeaderboard.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {tab === "friends" 
                    ? "Vous n'avez pas encore d'amis dans le classement." 
                    : "Aucun utilisateur trouvé pour cette recherche."}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex justify-center">
          <Button variant="outline">Voir plus d'utilisateurs</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
