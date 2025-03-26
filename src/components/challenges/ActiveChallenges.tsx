
import React from 'react';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/types/challenges';

const ActiveChallenges = () => {
  // Mock data - in a real app this would come from an API
  const activeChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Vélo tous les jours',
      description: 'Utilisez votre vélo comme principal moyen de transport pendant une semaine.',
      type: 'personal',
      points: 150,
      progress: 71,
      deadline: '15/06/2023',
      status: 'active',
      difficulty: 'medium',
      duration: '7 jours',
      participants: 245,
      category: 'travel'
    },
    {
      id: '2',
      title: 'Zéro transport carboné',
      description: 'Évitez complètement les transports émettant du CO2 ce week-end.',
      type: 'community',
      points: 200,
      progress: 45,
      deadline: '18/06/2023',
      status: 'active',
      difficulty: 'hard',
      duration: '2 jours',
      participants: 187,
      category: 'travel'
    },
    {
      id: '3',
      title: '100km en transport vert',
      description: 'Parcourez 100km en utilisant uniquement des transports écologiques.',
      type: 'personal',
      points: 100,
      progress: 28,
      deadline: '30/06/2023',
      status: 'active',
      difficulty: 'easy',
      duration: '30 jours',
      participants: 412,
      category: 'travel'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeChallenges.map(challenge => (
        <ChallengeCard 
          key={challenge.id} 
          challenge={challenge}
          onDetails={() => console.log('View details for', challenge.id)}
        />
      ))}
    </div>
  );
};

export default ActiveChallenges;
