
-- Table pour stocker les données des stations Vélib'
CREATE TABLE public.velib_stations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stationcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  coordonnees_geo_lat DECIMAL(10, 8) NOT NULL,
  coordonnees_geo_lon DECIMAL(11, 8) NOT NULL,
  capacity INTEGER NOT NULL,
  nom_arrondissement_communes TEXT,
  code_insee_commune TEXT,
  station_opening_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour l'historique des disponibilités
CREATE TABLE public.velib_availability_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stationcode TEXT NOT NULL REFERENCES public.velib_stations(stationcode) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  numbikesavailable INTEGER NOT NULL,
  numdocksavailable INTEGER NOT NULL,
  mechanical INTEGER NOT NULL DEFAULT 0,
  ebike INTEGER NOT NULL DEFAULT 0,
  is_renting BOOLEAN DEFAULT true,
  is_returning BOOLEAN DEFAULT true,
  is_installed BOOLEAN DEFAULT true
);

-- Table pour les alertes utilisateur
CREATE TABLE public.user_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stationcode TEXT NOT NULL REFERENCES public.velib_stations(stationcode) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('bikes_available', 'docks_available', 'ebikes_available')),
  threshold INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stationcode, alert_type)
);

-- Table pour les stations favorites des utilisateurs
CREATE TABLE public.user_favorite_stations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stationcode TEXT NOT NULL REFERENCES public.velib_stations(stationcode) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stationcode)
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_velib_availability_stationcode_timestamp ON public.velib_availability_history(stationcode, timestamp DESC);
CREATE INDEX idx_velib_stations_geo ON public.velib_stations(coordonnees_geo_lat, coordonnees_geo_lon);
CREATE INDEX idx_user_alerts_active ON public.user_alerts(user_id, is_active) WHERE is_active = true;

-- Activer le temps réel pour les tables importantes
ALTER TABLE public.velib_availability_history REPLICA IDENTITY FULL;
ALTER TABLE public.user_alerts REPLICA IDENTITY FULL;
ALTER TABLE public.user_favorite_stations REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.velib_availability_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_favorite_stations;

-- RLS (Row Level Security) policies
ALTER TABLE public.velib_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.velib_availability_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_stations ENABLE ROW LEVEL SECURITY;

-- Policies pour les stations (lecture publique)
CREATE POLICY "Stations are viewable by everyone" ON public.velib_stations FOR SELECT USING (true);

-- Policies pour l'historique (lecture publique)
CREATE POLICY "Availability history is viewable by everyone" ON public.velib_availability_history FOR SELECT USING (true);

-- Policies pour les alertes utilisateur (utilisateur propriétaire seulement)
CREATE POLICY "Users can view their own alerts" ON public.user_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts" ON public.user_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.user_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.user_alerts FOR DELETE USING (auth.uid() = user_id);

-- Policies pour les stations favorites (utilisateur propriétaire seulement)
CREATE POLICY "Users can view their own favorites" ON public.user_favorite_stations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.user_favorite_stations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.user_favorite_stations FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour nettoyer l'historique ancien (garder seulement 30 jours)
CREATE OR REPLACE FUNCTION clean_old_availability_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.velib_availability_history 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$;
