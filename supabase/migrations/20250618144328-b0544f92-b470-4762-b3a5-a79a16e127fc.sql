
-- Activer REPLICA IDENTITY FULL pour capturer toutes les données lors des mises à jour
ALTER TABLE public.forum_posts REPLICA IDENTITY FULL;
ALTER TABLE public.forum_post_likes REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comments REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comment_likes REPLICA IDENTITY FULL;

-- Ajouter les tables à la publication supabase_realtime pour activer les mises à jour en temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comment_likes;
