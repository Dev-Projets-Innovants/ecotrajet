
import React from 'react';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/types/challenges';

const CompletedChallenges = () => {
  // Mock data - in a real app this would come from an API
  const completedChallenges: Challenge[] = [
    {
      id: '7',
      title: 'Zéro voiture individuelle',
      description: 'N\'utilisez pas votre voiture individuelle pendant une semaine complète.',
      type: 'personal',
      points: 200,
      progress: 100,
      deadline: '28/05/2023',
      status: 'completed',
      difficulty: 'hard',
      duration: '7 jours',
      participants: 78,
      category: 'travel'
    },
    {
      id: '8',
      title: 'Trajet domicile-travail vert',
      description: 'Utilisez uniquement des modes de transport écologiques pour vos trajets domicile-travail.',
      type: 'personal',
      points: 120,
      progress: 100,
      deadline: '14/05/2023',
      status: 'completed',
      difficulty: 'medium',
      duration: '5 jours',
      participants: 136,
      category: 'travel'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {completedChallenges.map(challenge => (
        <ChallengeCard 
          key={challenge.id} 
          challenge={challenge}
          onDetails={() => console.log('View details for', challenge.id)}
        />
      ))}
    </div>
  );
};

export default CompletedChallenges;
