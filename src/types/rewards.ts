
export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'debutant' | 'intermediaire' | 'expert' | 'special';
  condition: string;
  obtained: boolean;
  progress?: number;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  points: number;
  progress: number;
  goal: number;
  deadline?: string;
  completed: boolean;
  icon: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  isFriend: boolean;
  rank: number;
}

export interface CollectiveImpact {
  co2Saved: number;
  treesEquivalent: number;
  distanceCovered: number;
  participatingUsers: number;
  tripsCompleted: number;
}

export interface UserReward {
  ecoPoints: number;
  currentLevel: UserLevel;
  nextLevel: UserLevel;
  progressToNextLevel: number;
  badges: Badge[];
  availableTitles: string[];
  selectedTitle: string;
  availableAvatars: string[];
  selectedAvatar: string;
  availableThemes: string[];
  selectedTheme: string;
}
