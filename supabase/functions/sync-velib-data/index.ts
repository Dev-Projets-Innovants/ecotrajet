
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
    console.log('Starting Vélib data sync...');

    const supabase = createClient(
      'https://knebskomwvvvoaclrwjv.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let allStations: VelibStation[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    // Récupérer toutes les stations par chunks de 100
    while (hasMore) {
      console.log(`Fetching stations ${offset} to ${offset + limit}...`);
      
      const apiUrl = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=${limit}&offset=${offset}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: VelibApiResponse = await response.json();
      allStations = allStations.concat(data.results);
      
      console.log(`Retrieved ${data.results.length} stations (total: ${allStations.length})`);
      
      if (data.results.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }

      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Total stations retrieved: ${allStations.length}`);

    // Upsert des stations (créer ou mettre à jour)
    const stationsToUpsert = allStations
      .filter(station => station.coordonnees_geo && station.coordonnees_geo.lat && station.coordonnees_geo.lon)
      .map(station => ({
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
      throw stationsError;
    }

    // Insérer les données de disponibilité
    const availabilityData = allStations
      .filter(station => station.coordonnees_geo && station.coordonnees_geo.lat && station.coordonnees_geo.lon)
      .map(station => ({
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
      throw availabilityError;
    }

    // Vérifier les alertes utilisateur et envoyer des notifications si nécessaire
    await checkUserAlerts(supabase, allStations);

    console.log('Vélib data sync completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        stations_synced: allStations.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sync-velib-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
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
      console.log('No active alerts to check');
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
