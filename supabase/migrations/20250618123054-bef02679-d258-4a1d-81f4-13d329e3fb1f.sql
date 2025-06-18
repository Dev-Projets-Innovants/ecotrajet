
-- Créer d'abord la fonction pour obtenir l'identifiant utilisateur actuel
CREATE OR REPLACE FUNCTION get_current_user_identifier()
RETURNS TEXT AS $$
BEGIN
  -- Cette fonction sera utilisée côté client pour obtenir l'identifiant de l'utilisateur anonyme
  -- Pour l'instant, elle retourne NULL car l'identifiant est géré côté client
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer des politiques RLS pour les commentaires
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- Politique pour voir tous les commentaires approuvés
CREATE POLICY "Anyone can view approved comments" 
  ON public.forum_comments 
  FOR SELECT 
  USING (is_approved = true);

-- Politique pour créer des commentaires (utilisateurs connectés)
CREATE POLICY "Authenticated users can create comments" 
  ON public.forum_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour créer des commentaires (utilisateurs anonymes)
CREATE POLICY "Anonymous users can create comments" 
  ON public.forum_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NULL AND user_identifier IS NOT NULL);

-- Politique pour modifier ses propres commentaires (utilisateurs connectés)
CREATE POLICY "Users can update their own comments" 
  ON public.forum_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour modifier ses propres commentaires (utilisateurs anonymes)
CREATE POLICY "Anonymous users can update their own comments" 
  ON public.forum_comments 
  FOR UPDATE 
  USING (auth.uid() IS NULL AND user_identifier = get_current_user_identifier());

-- Créer des politiques RLS pour les likes de commentaires
ALTER TABLE public.forum_comment_likes ENABLE ROW LEVEL SECURITY;

-- Politique pour voir tous les likes
CREATE POLICY "Anyone can view comment likes" 
  ON public.forum_comment_likes 
  FOR SELECT 
  USING (true);

-- Politique pour créer des likes (utilisateurs connectés)
CREATE POLICY "Authenticated users can like comments" 
  ON public.forum_comment_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour créer des likes (utilisateurs anonymes)
CREATE POLICY "Anonymous users can like comments" 
  ON public.forum_comment_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NULL AND user_identifier IS NOT NULL);

-- Politique pour supprimer ses propres likes (utilisateurs connectés)
CREATE POLICY "Users can remove their own comment likes" 
  ON public.forum_comment_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres likes (utilisateurs anonymes)
CREATE POLICY "Anonymous users can remove their own comment likes" 
  ON public.forum_comment_likes 
  FOR DELETE 
  USING (auth.uid() IS NULL AND user_identifier = get_current_user_identifier());
