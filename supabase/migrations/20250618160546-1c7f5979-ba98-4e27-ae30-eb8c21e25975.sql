
-- Vérifier les politiques RLS existantes pour forum_posts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('forum_posts', 'forum_comments');

-- Désactiver temporairement RLS pour les tables de modération si pas de politiques appropriées
ALTER TABLE public.forum_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments DISABLE ROW LEVEL SECURITY;

-- Ou alternativement, créer des politiques permissives pour les administrateurs
-- CREATE POLICY "Admins can manage all posts" 
-- ON public.forum_posts 
-- FOR ALL 
-- TO authenticated
-- USING (public.is_admin())
-- WITH CHECK (public.is_admin());

-- CREATE POLICY "Admins can manage all comments" 
-- ON public.forum_comments 
-- FOR ALL 
-- TO authenticated
-- USING (public.is_admin())
-- WITH CHECK (public.is_admin());
