
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserBadge {
  id: string;
  badge_title: string;
  badge_icon: string;
  badge_description: string;
  earned_date: string;
}

export const useUserBadges = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: async (): Promise<UserBadge[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_date', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });
};
