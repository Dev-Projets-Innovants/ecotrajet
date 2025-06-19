
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserStatistics {
  total_trips: number;
  total_distance_km: number;
  total_co2_saved_kg: number;
  total_calories_burned: number;
  trees_equivalent: number;
  last_updated: string;
}

export const useUserStatistics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-statistics', user?.id],
    queryFn: async (): Promise<UserStatistics | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user statistics:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });
};
