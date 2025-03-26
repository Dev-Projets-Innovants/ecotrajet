
import React from "react";
import { Calendar, Zap, CheckCircle, Clock, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Challenge } from "@/types/rewards";

interface ChallengesSectionProps {
  challenges: Challenge[];
}

export function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const [activeTab, setActiveTab] = React.useState("daily");
  
  const filteredChallenges = challenges.filter(challenge => 
    activeTab === "all" || challenge.type === activeTab
  );
  
  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return <Calendar className="h-4 w-4" />;
      case "weekly":
        return <Calendar className="h-4 w-4" />;
      case "monthly":
        return <Calendar className="h-4 w-4" />;
      case "special":
        return <Zap className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };
  
  const getChallengeTypeLabel = (type: string) => {
    switch (type) {
      case "daily":
        return "Quotidien";
      case "weekly":
        return "Hebdomadaire";
      case "monthly":
        return "Mensuel";
      case "special":
        return "Spécial";
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Défis Écologiques</h2>
        <p className="text-gray-600">Relevez des défis pour gagner des points et débloquer des récompenses</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex justify-start overflow-x-auto gap-2 p-1 h-auto bg-muted/50">
          <TabsTrigger value="daily" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Calendar className="mr-2 h-4 w-4" />
            Quotidiens
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Calendar className="mr-2 h-4 w-4" />
            Hebdomadaires
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Calendar className="mr-2 h-4 w-4" />
            Mensuels
          </TabsTrigger>
          <TabsTrigger value="special" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            <Zap className="mr-2 h-4 w-4" />
            Spéciaux
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-eco-light-green data-[state=active]:text-eco-green">
            Tous
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map(challenge => (
            <Card key={challenge.id} className={`overflow-hidden transition-all ${challenge.completed ? 'border-eco-green' : ''}`}>
              <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted/50">
                      {getChallengeTypeIcon(challenge.type)}
                      <span className="ml-1">{getChallengeTypeLabel(challenge.type)}</span>
                    </Badge>
                    {challenge.completed && (
                      <Badge variant="default" className="bg-eco-green">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Complété
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
                  <CardDescription className="mt-1">{challenge.description}</CardDescription>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted rounded-full h-12 w-12 text-center shrink-0">
                  <span className="text-sm font-medium">{challenge.points}</span>
                  <span className="text-xs">pts</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span className="font-medium">{challenge.progress} / {challenge.goal}</span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.goal) * 100} 
                    className={`h-2 ${challenge.completed ? 'bg-eco-light-green' : ''}`}
                  />
                  {challenge.deadline && (
                    <div className="flex items-center justify-end mt-2 text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Expire le {challenge.deadline}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant={challenge.completed ? "outline" : "default"} 
                  className={`w-full ${challenge.completed ? 'text-eco-green hover:text-eco-green' : ''}`}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? "Défi complété" : "Voir détails"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
