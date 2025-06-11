
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscription aux mises à jour en temps réel
 */
export function subscribeToStationUpdates(
  stationcode: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`station-${stationcode}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'velib_availability_history',
        filter: `stationcode=eq.${stationcode}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToUserAlerts(callback: (payload: any) => void) {
  return supabase
    .channel('user-alerts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_alerts',
      },
      callback
    )
    .subscribe();
}
