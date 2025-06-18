
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VelibStation {
  stationcode: string;
  name: string;
  is_installed: string;
  capacity: number;
  numdocksavailable: number;
  numbikesavailable: number;
  mechanical: number;
  ebike: number;
  is_renting: string;
  is_returning: string;
  duedate: string;
  coordonnees_geo: {
    lon: number;
    lat: number;
  };
  nom_arrondissement_communes: string;
  code_insee_commune: string;
  station_opening_hours: string | null;
}

interface VelibApiResponse {
  total_count: number;
  results: VelibStation[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Vélib data sync at:', new Date().toISOString());

    const supabase = createClient(
      'https://knebskomwvvvoaclrwjv.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier la connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from('velib_stations')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Supabase connection test failed:', testError);
      throw new Error(`Supabase connection failed: ${testError.message}`);
    }

    console.log('Supabase connection verified');

    let allStations: VelibStation[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    let retryCount = 0;
    const maxRetries = 3;

    // Récupérer toutes les stations par chunks de 100
    while (hasMore && retryCount < maxRetries) {
      console.log(`Fetching stations ${offset} to ${offset + limit}... (attempt ${retryCount + 1})`);
      
      try {
        const apiUrl = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=${limit}&offset=${offset}`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'EcoTrajet/1.0 (Data Sync Service)'
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data: VelibApiResponse = await response.json();
        
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Invalid API response format');
        }

        allStations = allStations.concat(data.results);
        
        console.log(`Retrieved ${data.results.length} stations (total: ${allStations.length})`);
        
        if (data.results.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }

        // Reset retry count on success
        retryCount = 0;

        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (apiError) {
        console.error(`API request failed (attempt ${retryCount + 1}):`, apiError);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to fetch data after ${maxRetries} attempts: ${apiError.message}`);
        }
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    console.log(`Total stations retrieved: ${allStations.length}`);

    if (allStations.length === 0) {
      throw new Error('No stations data retrieved from API');
    }

    // Filtrer et valider les stations
    const validStations = allStations.filter(station => {
      return station.coordonnees_geo && 
             station.coordonnees_geo.lat && 
             station.coordonnees_geo.lon &&
             station.stationcode &&
             station.name;
    });

    console.log(`Valid stations after filtering: ${validStations.length}`);

    // Upsert des stations (créer ou mettre à jour)
    const stationsToUpsert = validStations.map(station => ({
      stationcode: station.stationcode,
      name: station.name || 'Station Vélib',
      coordonnees_geo_lat: station.coordonnees_geo.lat,
      coordonnees_geo_lon: station.coordonnees_geo.lon,
      capacity: station.capacity || 0,
      nom_arrondissement_communes: station.nom_arrondissement_communes,
      code_insee_commune: station.code_insee_commune,
      station_opening_hours: station.station_opening_hours,
      updated_at: new Date().toISOString()
    }));

    console.log(`Upserting ${stationsToUpsert.length} stations...`);

    const { error: stationsError } = await supabase
      .from('velib_stations')
      .upsert(stationsToUpsert, {
        onConflict: 'stationcode',
        ignoreDuplicates: false
      });

    if (stationsError) {
      console.error('Error upserting stations:', stationsError);
      throw new Error(`Failed to upsert stations: ${stationsError.message}`);
    }

    console.log('Stations upserted successfully');

    // Insérer les données de disponibilité
    const availabilityData = validStations.map(station => ({
      stationcode: station.stationcode,
      numbikesavailable: station.numbikesavailable || 0,
      numdocksavailable: station.numdocksavailable || 0,
      mechanical: station.mechanical || 0,
      ebike: station.ebike || 0,
      is_renting: station.is_renting === 'OUI',
      is_returning: station.is_returning === 'OUI',
      is_installed: station.is_installed === 'OUI',
      timestamp: new Date().toISOString()
    }));

    console.log(`Inserting ${availabilityData.length} availability records...`);

    const { error: availabilityError } = await supabase
      .from('velib_availability_history')
      .insert(availabilityData);

    if (availabilityError) {
      console.error('Error inserting availability data:', availabilityError);
      throw new Error(`Failed to insert availability data: ${availabilityError.message}`);
    }

    console.log('Availability data inserted successfully');

    // Vérifier les alertes utilisateur et envoyer des notifications si nécessaire
    await checkUserAlerts(supabase, validStations);

    // Nettoyer les anciennes données (plus de 30 jours)
    try {
      const { error: cleanupError } = await supabase
        .from('velib_availability_history')
        .delete()
        .lt('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (cleanupError) {
        console.warn('Warning: Failed to cleanup old data:', cleanupError);
      } else {
        console.log('Old data cleanup completed');
      }
    } catch (cleanupError) {
      console.warn('Warning: Cleanup operation failed:', cleanupError);
    }

    const successResponse = {
      success: true,
      stations_synced: validStations.length,
      timestamp: new Date().toISOString(),
      message: 'Vélib data sync completed successfully'
    };

    console.log('Sync completed:', successResponse);

    return new Response(
      JSON.stringify(successResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sync-velib-data function:', error);
    
    const errorResponse = {
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      success: false
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function checkUserAlerts(supabase: any, stations: VelibStation[]) {
  try {
    // Récupérer toutes les alertes actives
    const { data: alerts, error } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('is_active', true);

    if (error || !alerts) {
      console.log('No active alerts to check or error:', error);
      return;
    }

    console.log(`Checking ${alerts.length} user alerts...`);

    for (const alert of alerts) {
      const station = stations.find(s => s.stationcode === alert.stationcode);
      if (!station) continue;

      let shouldNotify = false;
      let currentValue = 0;

      switch (alert.alert_type) {
        case 'bikes_available':
          currentValue = station.numbikesavailable || 0;
          shouldNotify = currentValue >= alert.threshold;
          break;
        case 'docks_available':
          currentValue = station.numdocksavailable || 0;
          shouldNotify = currentValue >= alert.threshold;
          break;
        case 'ebikes_available':
          currentValue = station.ebike || 0;
          shouldNotify = currentValue >= alert.threshold;
          break;
      }

      if (shouldNotify) {
        console.log(`Alert triggered for user ${alert.user_id}: ${alert.alert_type} >= ${alert.threshold} at station ${alert.stationcode}`);
        // Ici on pourrait implémenter l'envoi de notifications push, email, etc.
      }
    }
  } catch (error) {
    console.error('Error checking user alerts:', error);
  }
}
