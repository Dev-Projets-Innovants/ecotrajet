
import { supabase } from "@/integrations/supabase/client";

export async function sendAlertEmail(
  email: string,
  stationName: string,
  stationCode: string,
  alertType: 'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes',
  threshold: number,
  currentValue: number,
  alertId: string
): Promise<void> {
  const { error } = await supabase.functions.invoke('send-velib-alert', {
    body: {
      email,
      stationName,
      stationCode,
      alertType,
      threshold,
      currentValue,
      alertId
    }
  });

  if (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
}
