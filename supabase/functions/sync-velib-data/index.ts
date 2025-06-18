
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

  const startTime = Date.now();
  let syncStats = {
    startTime: new Date().toISOString(),
    endTime: '',
    duration: 0,
    totalStations: 0,
    successfulStations: 0,
    errors: [] as string[],
    apiCalls: 0,
    dataPoints: 0
  };

  try {
    console.log('=== Démarrage de la synchronisation Vélib ===');
    console.log('Timestamp:', syncStats.startTime);

    const supabase = createClient(
      'https://knebskomwvvvoaclrwjv.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let allStations: VelibStation[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    let totalApiCalls = 0;

    // Récupérer toutes les stations par chunks
    while (hasMore) {
      console.log(`📡 Récupération des stations ${offset + 1} à ${offset + limit}...`);
      
      const apiUrl = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=${limit}&offset=${offset}`;
      
      try {
        const response = await fetch(apiUrl);
        totalApiCalls++;
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data: VelibApiResponse = await response.json();
        allStations = allStations.concat(data.results);
        
        console.log(`✅ Récupéré ${data.results.length} stations (total: ${allStations.length}/${data.total_count})`);
        
        if (data.results.length < limit || allStations.length >= data.total_count) {
          hasMore = false;
        } else {
          offset += limit;
        }

        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Erreur lors de la récupération chunk ${offset}:`, error);
        syncStats.errors.push(`API call failed at offset ${offset}: ${error.message}`);
        hasMore = false;
      }
    }

    syncStats.totalStations = allStations.length;
    syncStats.apiCalls = totalApiCalls;

    console.log(`📊 Total des stations récupérées: ${allStations.length}`);

    if (allStations.length === 0) {
      throw new Error('Aucune station récupérée de l\'API Vélib');
    }

    // Filtrer les stations valides
    const validStations = allStations.filter(station => 
      station.coordonnees_geo && 
      station.coordonnees_geo.lat && 
      station.coordonnees_geo.lon &&
      station.stationcode
    );

    console.log(`✅ Stations valides: ${validStations.length}/${allStations.length}`);

    // Upsert des stations
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

    console.log(`💾 Mise à jour de ${stationsToUpsert.length} stations...`);

    const { error: stationsError, count: stationsCount } = await supabase
      .from('velib_stations')
      .upsert(stationsToUpsert, {
        onConflict: 'stationcode',
        ignoreDuplicates: false,
        count: 'exact'
      });

    if (stationsError) {
      console.error('❌ Erreur lors de l\'upsert des stations:', stationsError);
      syncStats.errors.push(`Stations upsert failed: ${stationsError.message}`);
    } else {
      console.log(`✅ Stations mises à jour: ${stationsCount}`);
    }

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

    syncStats.dataPoints = availabilityData.length;

    console.log(`💾 Insertion de ${availabilityData.length} enregistrements de disponibilité...`);

    const { error: availabilityError, count: availabilityCount } = await supabase
      .from('velib_availability_history')
      .insert(availabilityData, { count: 'exact' });

    if (availabilityError) {
      console.error('❌ Erreur lors de l\'insertion des données de disponibilité:', availabilityError);
      syncStats.errors.push(`Availability insert failed: ${availabilityError.message}`);
    } else {
      console.log(`✅ Données de disponibilité insérées: ${availabilityCount}`);
      syncStats.successfulStations = availabilityCount || 0;
    }

    // Nettoyage des anciennes données (plus de 30 jours)
    console.log('🧹 Nettoyage des anciennes données...');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error: cleanupError, count: deletedCount } = await supabase
      .from('velib_availability_history')
      .delete({ count: 'exact' })
      .lt('timestamp', thirtyDaysAgo);

    if (cleanupError) {
      console.error('❌ Erreur lors du nettoyage:', cleanupError);
      syncStats.errors.push(`Cleanup failed: ${cleanupError.message}`);
    } else {
      console.log(`🗑️ Anciennes données supprimées: ${deletedCount || 0}`);
    }

    // Vérifier les alertes utilisateur
    await checkUserAlerts(supabase, validStations);

    syncStats.endTime = new Date().toISOString();
    syncStats.duration = Date.now() - startTime;

    console.log('=== Synchronisation Vélib terminée ===');
    console.log(`⏱️ Durée: ${syncStats.duration}ms`);
    console.log(`📊 Statistiques:`, {
      apiCalls: syncStats.apiCalls,
      totalStations: syncStats.totalStations,
      validStations: validStations.length,
      successfulStations: syncStats.successfulStations,
      errors: syncStats.errors.length
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        stats: syncStats,
        message: `Synchronisation réussie: ${syncStats.successfulStations} stations mises à jour`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    syncStats.endTime = new Date().toISOString();
    syncStats.duration = Date.now() - startTime;
    syncStats.errors.push(error.message || 'Unknown error occurred');

    console.error('💥 Erreur critique lors de la synchronisation:', error);
    console.log('📊 Statistiques d\'échec:', syncStats);

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Unknown error occurred',
        stats: syncStats
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
    console.log('🔔 Vérification des alertes utilisateur...');
    
    const { data: alerts, error } = await supabase
      .from('user_alerts')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Erreur lors de la récupération des alertes:', error);
      return;
    }

    if (!alerts || alerts.length === 0) {
      console.log('ℹ️ Aucune alerte active trouvée');
      return;
    }

    console.log(`🔍 Vérification de ${alerts.length} alertes actives...`);

    let triggeredAlerts = 0;

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
        triggeredAlerts++;
        console.log(`🚨 Alerte déclenchée pour l'utilisateur ${alert.user_id}: ${alert.alert_type} >= ${alert.threshold} à la station ${alert.stationcode} (valeur: ${currentValue})`);
        // Ici on pourrait implémenter l'envoi de notifications
      }
    }

    console.log(`📈 Alertes déclenchées: ${triggeredAlerts}/${alerts.length}`);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des alertes:', error);
  }
}
