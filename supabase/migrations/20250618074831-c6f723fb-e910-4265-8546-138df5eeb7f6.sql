
-- Supprimer la colonne image_url de la table user_experiences
ALTER TABLE public.user_experiences 
DROP COLUMN IF EXISTS image_url;
