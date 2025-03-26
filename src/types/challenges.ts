
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'community';
  points: number;
  progress?: number;
  goal?: number;
  deadline?: string;
  status: 'active' | 'completed' | 'recommended';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  participants: number;
  category: 'travel' | 'lifestyle' | 'energy' | 'waste';
  icon?: string;
}
