
-- Créer une fonction pour vérifier si un utilisateur peut supprimer un post
CREATE OR REPLACE FUNCTION can_delete_post(post_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post_record forum_posts;
  current_user_id UUID;
  current_user_identifier TEXT;
BEGIN
  -- Récupérer les informations du post
  SELECT * INTO post_record FROM forum_posts WHERE id = post_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Récupérer l'utilisateur actuel
  current_user_id := auth.uid();
  
  -- Si l'utilisateur est connecté et est l'auteur du post
  IF current_user_id IS NOT NULL AND post_record.user_id = current_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Pour les utilisateurs anonymes, on ne peut pas vérifier l'identifiant ici
  -- La vérification se fera côté client
  
  RETURN FALSE;
END;
$$;

-- Créer une fonction pour supprimer un post et ses données associées
CREATE OR REPLACE FUNCTION delete_post_with_relations(post_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier les permissions
  IF NOT can_delete_post(post_uuid) THEN
    RAISE EXCEPTION 'Permission denied to delete this post';
  END IF;
  
  -- Supprimer les likes des commentaires du post
  DELETE FROM forum_comment_likes 
  WHERE comment_id IN (
    SELECT id FROM forum_comments WHERE post_id = post_uuid
  );
  
  -- Supprimer les commentaires du post
  DELETE FROM forum_comments WHERE post_id = post_uuid;
  
  -- Supprimer les likes du post
  DELETE FROM forum_post_likes WHERE post_id = post_uuid;
  
  -- Supprimer les signalements du post
  DELETE FROM forum_reports WHERE post_id = post_uuid;
  
  -- Supprimer le post lui-même
  DELETE FROM forum_posts WHERE id = post_uuid;
  
  RETURN TRUE;
END;
$$;
