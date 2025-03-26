
import React from 'react';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/types/challenges';
import { toast } from "@/components/ui/use-toast";

const RecommendedChallenges = () => {
  // Mock data - in a real app this would come from an API
  const recommendedChallenges: Challenge[] = [
    {
      id: '4',
      title: 'Covoiturez pour le travail',
      description: 'Partagez vos trajets domicile-travail avec d\'autres personnes pendant 5 jours.',
      type: 'community',
      points: 180,
      status: 'recommended',
      difficulty: 'medium',
      duration: '5 jours',
      participants: 94,
      category: 'travel'
    },
    {
      id: '5',
      title: 'Découvrez les transports',
      description: 'Essayez 3 modes de transport différents que vous n\'utilisez pas habituellement.',
      type: 'personal',
      points: 120,
      status: 'recommended',
      difficulty: 'easy',
      duration: '14 jours',
      participants: 152,
      category: 'travel'
    },
    {
      id: '6',
      title: 'Marchez 5000 pas par jour',
      description: 'Remplacez certains de vos trajets en voiture par la marche pour atteindre 5000 pas quotidiens.',
      type: 'personal',
      points: 150,
      status: 'recommended',
      difficulty: 'medium',
      duration: '7 jours',
      participants: 305,
      category: 'travel'
    }
  ];

  const handleJoinChallenge = (challengeId: string) => {
    // In a real app, this would call an API to join the challenge
    toast({
      title: "Défi rejoint !",
      description: "Vous avez rejoint ce défi avec succès. Bonne chance !",
    });
    console.log('Joined challenge', challengeId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedChallenges.map(challenge => (
        <ChallengeCard 
          key={challenge.id} 
          challenge={challenge}
          onJoin={() => handleJoinChallenge(challenge.id)}
          onDetails={() => console.log('View details for', challenge.id)}
        />
      ))}
    </div>
  );
};

export default RecommendedChallenges;
