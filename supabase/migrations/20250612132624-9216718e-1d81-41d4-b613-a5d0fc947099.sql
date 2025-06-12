
-- Réactiver RLS pour la table user_favorite_stations
ALTER TABLE public.user_favorite_stations ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorite_stations;
DROP POLICY IF EXISTS "Users can create favorites" ON public.user_favorite_stations;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorite_stations;

-- Créer les nouvelles politiques RLS
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorite_stations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" 
ON public.user_favorite_stations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete leur own favorites" 
ON public.user_favorite_stations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Vérifier si la contrainte existe déjà avant de l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_user_favorite_stations_stationcode' 
                   AND table_name = 'user_favorite_stations') THEN
        ALTER TABLE public.user_favorite_stations 
        ADD CONSTRAINT fk_user_favorite_stations_stationcode 
        FOREIGN KEY (stationcode) REFERENCES public.velib_stations(stationcode) ON DELETE CASCADE;
    END IF;
END $$;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_favorite_stations_user_id ON public.user_favorite_stations(user_id);
