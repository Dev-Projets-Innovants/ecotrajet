
-- Supprimer l'ancienne contrainte check qui limite les types d'alertes
ALTER TABLE public.user_alerts DROP CONSTRAINT IF EXISTS user_alerts_alert_type_check;

-- Ajouter une nouvelle contrainte qui inclut tous les types d'alertes supportés
ALTER TABLE public.user_alerts ADD CONSTRAINT user_alerts_alert_type_check 
CHECK (alert_type IN ('bikes_available', 'docks_available', 'ebikes_available', 'mechanical_bikes'));
