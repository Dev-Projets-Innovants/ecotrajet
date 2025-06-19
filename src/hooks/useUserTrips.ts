
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TransportMode {
  id: string;
  name: string;
  co2_factor_per_km: number;
  calories_per_km: number;
}

interface UserTrip {
  id: string;
  origin: string;
  destination: string;
  distance_km: number;
  co2_saved_kg: number;
  calories_burned: number;
  trip_date: string;
  transport_mode: TransportMode;
}

export const useUserTrips = (limit?: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-trips', user?.id, limit],
    queryFn: async (): Promise<UserTrip[]> => {
      if (!user?.id) return [];

      let query = supabase
        .from('user_trips')
        .select(`
          *,
          transport_modes (
            id,
            name,
            co2_factor_per_km,
            calories_per_km
          )
        `)
        .eq('user_id', user.id)
        .order('trip_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user trips:', error);
        throw error;
      }

      return data?.map(trip => ({
        ...trip,
        transport_mode: trip.transport_modes
      })) || [];
    },
    enabled: !!user?.id
  });
};
