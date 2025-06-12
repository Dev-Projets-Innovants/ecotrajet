
import { supabase } from "@/integrations/supabase/client";

export interface VelibStationWithAvailability {
  stationcode: string;
  name: string;
  nom_arrondissement_communes: string;
  coordonnees_geo: {
    lat: number;
    lon: number;
  };
  capacity: number;
  numbikesavailable: number;
  numdocksavailable: number;
  ebike: number;
  mechanical: number;
  is_installed: string;
  is_returning: string;
  is_renting: string;
  duedate: string;
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
