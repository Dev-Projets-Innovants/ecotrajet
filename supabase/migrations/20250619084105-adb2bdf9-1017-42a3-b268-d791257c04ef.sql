
-- Table pour enregistrer les modes de transport avec leurs facteurs d'émission
CREATE TABLE public.transport_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  co2_factor_per_km DECIMAL(10,4) NOT NULL, -- kg CO2 par km
  calories_per_km INTEGER DEFAULT 0, -- calories brûlées par km
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour enregistrer les trajets des utilisateurs
CREATE TABLE public.user_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  transport_mode_id UUID REFERENCES public.transport_modes NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  co2_saved_kg DECIMAL(10,4) DEFAULT 0, -- CO2 économisé vs voiture
  calories_burned INTEGER DEFAULT 0,
  trip_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour stocker les statistiques calculées des utilisateurs
CREATE TABLE public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  total_trips INTEGER DEFAULT 0,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  total_co2_saved_kg DECIMAL(10,4) DEFAULT 0,
  total_calories_burned INTEGER DEFAULT 0,
  trees_equivalent DECIMAL(5,2) DEFAULT 0, -- équivalent en arbres plantés
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour définir les défis disponibles
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_value INTEGER NOT NULL, -- valeur cible à atteindre
  challenge_type TEXT NOT NULL, -- 'trips', 'distance', 'co2_saved', 'consecutive_days'
  reward_points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour suivre la progression des défis par utilisateur
CREATE TABLE public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  challenge_id UUID REFERENCES public.challenges NOT NULL,
  current_value INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Table pour les badges utilisateur
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  badge_title TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  earned_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.transport_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour transport_modes (lecture publique)
CREATE POLICY "Anyone can view transport modes" ON public.transport_modes FOR SELECT USING (true);

-- Politiques RLS pour user_trips (utilisateur peut voir/modifier ses propres trajets)
CREATE POLICY "Users can view their own trips" ON public.user_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trips" ON public.user_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.user_trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.user_trips FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour user_statistics
CREATE POLICY "Users can view their own statistics" ON public.user_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own statistics" ON public.user_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own statistics" ON public.user_statistics FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour challenges (lecture publique)
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);

-- Politiques RLS pour user_challenges
CREATE POLICY "Users can view their own challenges" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenges" ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenges" ON public.user_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insérer quelques modes de transport de base
INSERT INTO public.transport_modes (name, co2_factor_per_km, calories_per_km) VALUES
('Voiture', 0.195, 0), -- 195g CO2/km (référence)
('Vélo', 0.021, 45), -- 21g CO2/km (fabrication), 45 cal/km
('Marche', 0.000, 50), -- 0g CO2/km, 50 cal/km
('Trottinette électrique', 0.063, 25), -- 63g CO2/km, 25 cal/km
('Transport en commun', 0.101, 0), -- 101g CO2/km
('Vélib', 0.021, 45); -- Même que vélo

-- Insérer quelques défis de base
INSERT INTO public.challenges (title, description, target_value, challenge_type, reward_points) VALUES
('Premier Trajet', 'Effectuer votre premier trajet écologique', 1, 'trips', 10),
('10 Trajets', 'Compléter 10 trajets écologiques', 10, 'trips', 50),
('30 jours consécutifs', 'Effectuer au moins un trajet par jour pendant 30 jours', 30, 'consecutive_days', 100),
('Cycliste passionné', 'Parcourir 200 km à vélo', 200, 'distance', 75),
('Écologie urbaine', 'Économiser 50 kg de CO2', 50, 'co2_saved', 80);

-- Fonction pour mettre à jour automatiquement les statistiques utilisateur
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer ou mettre à jour les statistiques utilisateur
  INSERT INTO public.user_statistics (user_id, total_trips, total_distance_km, total_co2_saved_kg, total_calories_burned, trees_equivalent, last_updated)
  SELECT 
    NEW.user_id,
    COUNT(*),
    SUM(distance_km),
    SUM(co2_saved_kg),
    SUM(calories_burned),
    SUM(co2_saved_kg) / 21.77, -- 1 arbre absorbe ~21.77 kg CO2/an
    NOW()
  FROM public.user_trips 
  WHERE user_id = NEW.user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_trips = EXCLUDED.total_trips,
    total_distance_km = EXCLUDED.total_distance_km,
    total_co2_saved_kg = EXCLUDED.total_co2_saved_kg,
    total_calories_burned = EXCLUDED.total_calories_burned,
    trees_equivalent = EXCLUDED.trees_equivalent,
    last_updated = EXCLUDED.last_updated;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les statistiques à chaque nouveau trajet
CREATE TRIGGER trigger_update_user_statistics
  AFTER INSERT ON public.user_trips
  FOR EACH ROW
  EXECUTE FUNCTION update_user_statistics();

-- Fonction pour calculer le CO2 économisé vs voiture
CREATE OR REPLACE FUNCTION calculate_co2_saved()
RETURNS TRIGGER AS $$
DECLARE
  car_co2_factor DECIMAL(10,4) := 0.195; -- kg CO2/km pour une voiture
  transport_co2_factor DECIMAL(10,4);
BEGIN
  -- Récupérer le facteur CO2 du mode de transport
  SELECT co2_factor_per_km INTO transport_co2_factor
  FROM public.transport_modes
  WHERE id = NEW.transport_mode_id;

  -- Calculer le CO2 économisé
  NEW.co2_saved_kg := (car_co2_factor - transport_co2_factor) * NEW.distance_km;
  
  -- S'assurer que la valeur n'est pas négative
  IF NEW.co2_saved_kg < 0 THEN
    NEW.co2_saved_kg := 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement le CO2 économisé
CREATE TRIGGER trigger_calculate_co2_saved
  BEFORE INSERT ON public.user_trips
  FOR EACH ROW
  EXECUTE FUNCTION calculate_co2_saved();
