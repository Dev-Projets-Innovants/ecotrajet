
-- Modifier la table user_alerts pour ne plus dépendre des user_id authentifiés
ALTER TABLE public.user_alerts 
ALTER COLUMN user_id DROP NOT NULL,
ADD COLUMN user_identifier TEXT;

-- Créer un index pour améliorer les performances sur user_identifier
CREATE INDEX idx_user_alerts_user_identifier ON public.user_alerts(user_identifier);

-- Optionnel : Supprimer les alertes existantes avec des user_id invalides
DELETE FROM public.user_alerts WHERE user_id::text LIKE '550e8400-e29b-41d4-a716-%';
