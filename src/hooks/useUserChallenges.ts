
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target_value: number;
  challenge_type: string;
  reward_points: number;
}

interface UserChallenge {
  id: string;
  current_value: number;
  is_completed: boolean;
  completed_at: string | null;
  challenge: Challenge;
}

export const useUserChallenges = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async (): Promise<UserChallenge[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenges (
            id,
            title,
            description,
            target_value,
            challenge_type,
            reward_points
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user challenges:', error);
        throw error;
      }

      return data?.map(item => ({
        ...item,
        challenge: item.challenges
      })) || [];
    },
    enabled: !!user?.id
  });
};
