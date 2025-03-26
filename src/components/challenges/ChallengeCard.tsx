
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Users, Clock } from 'lucide-react';
import { Challenge } from '@/types/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
  onDetails?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge,
  onJoin,
  onDetails 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDurationBadge = (duration: string) => {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {duration}
      </Badge>
    );
  };
  
  const getParticipantsBadge = (participants: number) => {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {participants}
      </Badge>
    );
  };

  return (
    <Card className={`overflow-hidden ${challenge.status === 'active' ? 'border-eco-green border-2' : ''}`}>
      <div 
        className="h-3" 
        style={{ 
          background: challenge.type === 'community' 
            ? 'linear-gradient(to right, #10B981, #3B82F6)' 
            : '#10B981' 
        }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {challenge.title}
            {challenge.status === 'completed' && (
              <Award className="h-5 w-5 text-yellow-500" />
            )}
          </CardTitle>
          <Badge className={getDifficultyColor(challenge.difficulty)}>
            {challenge.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{challenge.description}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {challenge.type === 'community' ? 'Communauté' : 'Personnel'}
          </Badge>
          {getDurationBadge(challenge.duration)}
          {getParticipantsBadge(challenge.participants)}
        </div>
        
        {(challenge.status === 'active' || challenge.status === 'completed') && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div>Progression</div>
              <div className="font-medium">{challenge.progress}%</div>
            </div>
            <Progress value={challenge.progress} className="h-2" />
          </div>
        )}
        
        {challenge.deadline && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {challenge.status === 'completed' ? 'Terminé le' : 'Échéance:'} {challenge.deadline}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="font-medium text-sm">
          {challenge.points} points
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDetails}
          >
            Détails
          </Button>
          
          {challenge.status === 'recommended' && (
            <Button 
              size="sm"
              onClick={onJoin}
            >
              Rejoindre
            </Button>
          )}
          
          {challenge.status === 'active' && (
            <Button 
              size="sm"
              variant="default"
            >
              Mettre à jour
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
