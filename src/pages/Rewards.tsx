
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Award, 
  Trophy, 
  Users, 
  Target, 
  Gift, 
  User, 
  TreeDeciduous, 
  Leaf, 
  Calendar, 
  Zap,
  ChevronLeft, 
  ChevronRight,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserReward, Badge as BadgeType, Challenge, LeaderboardUser, CollectiveImpact } from "@/types/rewards";
import { UserProgressSection } from "@/components/rewards/UserProgressSection";
import { BadgesGrid } from "@/components/rewards/BadgesGrid";
import { ChallengesSection } from "@/components/rewards/ChallengesSection";
import { LeaderboardSection } from "@/components/rewards/LeaderboardSection";
import { RewardsSection } from "@/components/rewards/RewardsSection";
import { CollectiveImpactSection } from "@/components/rewards/CollectiveImpactSection";

// Mock data for demonstration
import { mockUserRewards, mockChallenges, mockLeaderboard, mockCollectiveImpact } from "@/data/mockRewardsData";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("progress");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-eco-green">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">ÉcoTrajet</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/" className="text-gray-600">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="mr-3 h-8 w-8 text-eco-green" />
            Récompenses Écologiques
          </h1>
          <p className="text-gray-600 mt-2">
            Suivez votre progression, relevez des défis et débloquez des récompenses en adoptant une mobilité éco-responsable !
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="progress" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <Leaf className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Progression</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <Award className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <Target className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Défis</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <Trophy className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Classement</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <Gift className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Récompenses</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
              <TreeDeciduous className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Impact Collectif</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 animate-fade-in">
            <UserProgressSection userRewards={mockUserRewards} />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6 animate-fade-in">
            <BadgesGrid badges={mockUserRewards.badges} />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6 animate-fade-in">
            <ChallengesSection challenges={mockChallenges} />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 animate-fade-in">
            <LeaderboardSection leaderboard={mockLeaderboard} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6 animate-fade-in">
            <RewardsSection userRewards={mockUserRewards} />
          </TabsContent>

          <TabsContent value="impact" className="space-y-6 animate-fade-in">
            <CollectiveImpactSection impact={mockCollectiveImpact} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rewards;
