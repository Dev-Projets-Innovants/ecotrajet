
-- Modifier la valeur par défaut de is_approved pour les nouveaux posts
ALTER TABLE public.forum_posts ALTER COLUMN is_approved SET DEFAULT false;

-- Mettre à jour la politique RLS pour que seuls les posts approuvés soient visibles publiquement
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.forum_posts;

CREATE POLICY "Posts are viewable by everyone" 
  ON public.forum_posts FOR SELECT 
  USING (is_approved = true);

-- Permettre aux utilisateurs de voir leurs propres posts même s'ils ne sont pas approuvés
CREATE POLICY "Users can view their own posts" 
  ON public.forum_posts FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );
