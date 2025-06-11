
-- Supprimer les anciennes politiques RLS qui utilisent auth.uid()
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can create alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON public.user_alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.user_alerts;

-- Créer de nouvelles politiques RLS qui permettent l'accès sans authentification Supabase
-- Temporairement désactiver RLS pour permettre les opérations avec user_identifier
ALTER TABLE public.user_alerts DISABLE ROW LEVEL SECURITY;

-- Ou alternativement, créer des politiques permissives pour user_identifier
-- ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow operations with user_identifier" 
-- ON public.user_alerts 
-- FOR ALL 
-- USING (user_identifier IS NOT NULL);
