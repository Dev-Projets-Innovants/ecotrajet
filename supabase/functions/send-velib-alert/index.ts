
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { generateEmailHTML } from './emailTemplates.ts';
import { sendEmailWithGmailSMTP } from './gmailService.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VelibAlertRequest {
  email: string;
  stationName: string;
  stationCode: string;
  alertType: string;
  threshold: number;
  currentValue: number;
  alertId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alertData: VelibAlertRequest = await req.json();
    console.log('Sending Velib alert email via Gmail SMTP:', alertData);

    // Initialiser le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Envoyer l'email
    const emailResponse = await sendEmailWithGmailSMTP(
      alertData.email,
      `🚲 Alerte Vélib' - ${alertData.stationName}`,
      generateEmailHTML(alertData)
    );

    // Enregistrer dans l'historique des notifications
    const { error: historyError } = await supabase
      .from('alert_notifications_history')
      .insert({
        alert_id: alertData.alertId,
        email: alertData.email,
        station_name: alertData.stationName,
        alert_type: alertData.alertType,
        threshold: alertData.threshold,
        current_value: alertData.currentValue,
        email_status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('Error saving notification history:', historyError);
    }

    console.log("Alert email sent successfully via Gmail SMTP:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending Velib alert email via Gmail SMTP:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
