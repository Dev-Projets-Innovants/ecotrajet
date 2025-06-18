import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VelibStation {
  stationCode: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  arrondissement?: string;
  commune?: string;
  station_opening_hours?: string;
}

interface VelibAvailability {
  stationCode: string;
  numBikesAvailable: number;
  numDocksAvailable: number;
  mechanical: number;
  ebike: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
}

Deno.serve(async (req) => {
  console.log('=== Sync Vélib Data Function Started ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('Fetching Vélib station information...');
    
    // Fetch station information
    const stationInfoResponse = await fetch(
      'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json'
    );
    
    if (!stationInfoResponse.ok) {
      throw new Error(`Failed to fetch station info: ${stationInfoResponse.status}`);
    }
    
    const stationInfoData = await stationInfoResponse.json();
    console.log(`Fetched ${stationInfoData.data?.stations?.length || 0} stations info`);

    // Fetch station status
    const stationStatusResponse = await fetch(
      'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json'
    );
    
    if (!stationStatusResponse.ok) {
      throw new Error(`Failed to fetch station status: ${stationStatusResponse.status}`);
    }
    
    const stationStatusData = await stationStatusResponse.json();
    console.log(`Fetched ${stationStatusData.data?.stations?.length || 0} stations status`);

    const stations: VelibStation[] = stationInfoData.data?.stations?.map((station: any) => ({
      stationCode: station.station_id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      capacity: station.capacity,
      arrondissement: station.station_area || null,
      commune: station.municipality || null,
      station_opening_hours: station.rental_methods?.join(', ') || null,
    })) || [];

    const availabilities: VelibAvailability[] = stationStatusData.data?.stations?.map((station: any) => ({
      stationCode: station.station_id,
      numBikesAvailable: station.num_bikes_available || 0,
      numDocksAvailable: station.num_docks_available || 0,
      mechanical: station.num_bikes_available_types?.mechanical || 0,
      ebike: station.num_bikes_available_types?.ebike || 0,
      is_installed: station.is_installed === 1,
      is_renting: station.is_renting === 1,
      is_returning: station.is_returning === 1,
    })) || [];

    console.log(`Processing ${stations.length} stations and ${availabilities.length} availability records`);

    // Upsert stations
    if (stations.length > 0) {
      const { error: stationsError } = await supabase
        .from('velib_stations')
        .upsert(
          stations.map(station => ({
            stationcode: station.stationCode,
            name: station.name,
            coordonnees_geo_lat: station.lat,
            coordonnees_geo_lon: station.lon,
            capacity: station.capacity,
            nom_arrondissement_communes: station.arrondissement,
            code_insee_commune: station.commune,
            station_opening_hours: station.station_opening_hours,
            updated_at: new Date().toISOString()
          })),
          { 
            onConflict: 'stationcode',
            ignoreDuplicates: false 
          }
        );

      if (stationsError) {
        console.error('Error upserting stations:', stationsError);
        throw stationsError;
      }
      console.log(`✅ Successfully upserted ${stations.length} stations`);
    }

    // Insert availability history
    if (availabilities.length > 0) {
      const { error: availabilityError } = await supabase
        .from('velib_availability_history')
        .insert(
          availabilities.map(availability => ({
            stationcode: availability.stationCode,
            numbikesavailable: availability.numBikesAvailable,
            numdocksavailable: availability.numDocksAvailable,
            mechanical: availability.mechanical,
            ebike: availability.ebike,
            is_installed: availability.is_installed,
            is_renting: availability.is_renting,
            is_returning: availability.is_returning,
            timestamp: new Date().toISOString()
          }))
        );

      if (availabilityError) {
        console.error('Error inserting availability:', availabilityError);
        throw availabilityError;
      }
      console.log(`✅ Successfully inserted ${availabilities.length} availability records`);
    }

    // Clean old data (keep only last 30 days)
    const { error: cleanError } = await supabase.rpc('clean_old_availability_data');
    if (cleanError) {
      console.error('Error cleaning old data:', cleanError);
    } else {
      console.log('✅ Cleaned old availability data');
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      stationsProcessed: stations.length,
      availabilityRecordsInserted: availabilities.length,
      message: 'Vélib data synchronized successfully'
    };

    console.log('=== Sync completed successfully ===', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('=== Sync failed ===', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
