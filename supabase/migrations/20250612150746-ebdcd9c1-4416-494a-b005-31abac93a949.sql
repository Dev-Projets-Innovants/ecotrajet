
-- Supprimer les politiques RLS existantes qui causent la récursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Créer des politiques RLS corrigées sans récursion
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Politique pour les admins (simplifiée pour éviter la récursion)
CREATE POLICY "Service role can access all profiles" 
ON public.profiles 
FOR ALL 
USING (auth.role() = 'service_role');
