
-- Ajouter le champ user_email à la table user_alerts
ALTER TABLE public.user_alerts 
ADD COLUMN user_email TEXT;

-- Ajouter un champ pour éviter le spam (cooldown)
ALTER TABLE public.user_alerts 
ADD COLUMN last_notification_sent TIMESTAMP WITH TIME ZONE;

-- Ajouter un champ pour la fréquence d'envoi
ALTER TABLE public.user_alerts 
ADD COLUMN notification_frequency TEXT DEFAULT 'immediate' CHECK (notification_frequency IN ('immediate', 'hourly', 'daily'));

-- Créer une table pour suivre l'historique des notifications envoyées
CREATE TABLE public.alert_notifications_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES public.user_alerts(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  station_name TEXT,
  alert_type TEXT,
  threshold INTEGER,
  current_value INTEGER,
  email_status TEXT DEFAULT 'sent' CHECK (email_status IN ('sent', 'failed', 'pending'))
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_alert_notifications_alert_id ON public.alert_notifications_history(alert_id);
CREATE INDEX idx_alert_notifications_sent_at ON public.alert_notifications_history(sent_at DESC);

-- RLS pour l'historique des notifications
ALTER TABLE public.alert_notifications_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification history" 
ON public.alert_notifications_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_alerts 
    WHERE user_alerts.id = alert_notifications_history.alert_id 
    AND user_alerts.user_id = auth.uid()
  )
);
