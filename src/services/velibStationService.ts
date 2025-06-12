
import { supabase } from "@/integrations/supabase/client";

export interface VelibStationWithAvailability {
  stationcode: string;
  name: string;
  nom_arrondissement_communes: string;
  coordonnees_geo_lat: number;
  coordonnees_geo_lon: number;
  capacity: number;
  numbikesavailable: number;
  numdocksavailable: number;
  ebike: number;
  mechanical: number;
  is_installed: boolean;
  is_returning: boolean;
  is_renting: boolean;
  last_updated?: string;
}

export const getStationByCode = async (stationcode: string): Promise<VelibStationWithAvailability | null> => {
  try {
    const { data, error } = await supabase
      .from('velib_stations')
      .select('*')
      .eq('stationcode', stationcode)
      .single();

    if (error) {
      console.error('Error fetching station:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching station:', error);
    return null;
  }
};

export const getAllStations = async (): Promise<VelibStationWithAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('velib_stations')
      .select('*');

    if (error) {
      console.error('Error fetching stations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching stations:', error);
    return [];
  }
};

export const getStationsWithAvailability = async (options?: { limit?: number }): Promise<VelibStationWithAvailability[]> => {
  try {
    let query = supabase.from('velib_stations').select('*');
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stations with availability:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching stations with availability:', error);
    return [];
  }
};

export const triggerVelibSync = async (): Promise<boolean> => {
  try {
    // This would typically call an edge function to sync data
    console.log('Sync triggered');
    return true;
  } catch (error) {
    console.error('Error triggering sync:', error);
    return false;
  }
};

export const searchStations = async (query: string): Promise<VelibStationWithAvailability[]> => {
  try {
    const { data, error } = await supabase
      .from('velib_stations')
      .select('*')
      .or(`name.ilike.%${query}%,nom_arrondissement_communes.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching stations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error searching stations:', error);
    return [];
  }
};
