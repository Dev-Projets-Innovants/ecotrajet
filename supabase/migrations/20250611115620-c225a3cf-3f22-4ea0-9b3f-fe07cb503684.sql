
-- Supprimer les politiques existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can create alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.user_alerts;

DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorite_stations;
DROP POLICY IF EXISTS "Users can create favorites" ON public.user_favorite_stations;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorite_stations;

-- Activer RLS sur les tables
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_stations ENABLE ROW LEVEL SECURITY;

-- Recréer les politiques pour user_alerts
CREATE POLICY "Users can view their own alerts" 
ON public.user_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create alerts" 
ON public.user_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
ON public.user_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
ON public.user_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Recréer les politiques pour user_favorite_stations
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorite_stations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" 
ON public.user_favorite_stations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorite_stations 
FOR DELETE 
USING (auth.uid() = user_id);
