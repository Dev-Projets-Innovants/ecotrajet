
-- Création complète des tables pour le système de forum

-- Table des catégories de forum
CREATE TABLE public.forum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#10B981',
  icon TEXT DEFAULT 'MessageSquare',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des posts de forum
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  user_identifier TEXT,
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  is_reported BOOLEAN DEFAULT false,
  reported_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des commentaires
CREATE TABLE public.forum_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  user_identifier TEXT,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  is_reported BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des likes pour les posts
CREATE TABLE public.forum_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_identifier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id),
  UNIQUE(post_id, user_identifier)
);

-- Table des likes pour les commentaires
CREATE TABLE public.forum_comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_identifier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(comment_id, user_id),
  UNIQUE(comment_id, user_identifier)
);

-- Table des signalements
CREATE TABLE public.forum_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reporter_identifier TEXT,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Insertion des catégories par défaut
INSERT INTO public.forum_categories (name, description, color, icon) VALUES
  ('Vélo', 'Discussions sur le vélo, entretien, conseils et trajets', '#10B981', 'Bike'),
  ('Covoiturage', 'Partage de trajets et conseils covoiturage', '#3B82F6', 'Car'),
  ('Transport Public', 'Bus, métro, tram et autres transports en commun', '#8B5CF6', 'Bus'),
  ('Marche', 'Conseils et expériences de marche urbaine', '#F59E0B', 'MapPin'),
  ('Général', 'Discussions générales sur la mobilité durable', '#6B7280', 'MessageSquare'),
  ('Conseils & Astuces', 'Partage de conseils pratiques', '#EF4444', 'Lightbulb');

-- Activation de Row Level Security
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les catégories (lecture publique)
CREATE POLICY "Categories are viewable by everyone" 
  ON public.forum_categories FOR SELECT 
  USING (is_active = true);

-- Politiques RLS pour les posts (lecture publique, écriture pour utilisateurs connectés ou avec identifier)
CREATE POLICY "Posts are viewable by everyone" 
  ON public.forum_posts FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can create posts" 
  ON public.forum_posts FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

CREATE POLICY "Users can update their own posts" 
  ON public.forum_posts FOR UPDATE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

-- Politiques RLS pour les commentaires
CREATE POLICY "Comments are viewable by everyone" 
  ON public.forum_comments FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can create comments" 
  ON public.forum_comments FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

-- Politiques RLS pour les likes de posts
CREATE POLICY "Post likes are viewable by everyone" 
  ON public.forum_post_likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can like posts" 
  ON public.forum_post_likes FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

CREATE POLICY "Users can remove their likes on posts" 
  ON public.forum_post_likes FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

-- Politiques RLS pour les likes de commentaires
CREATE POLICY "Comment likes are viewable by everyone" 
  ON public.forum_comment_likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can like comments" 
  ON public.forum_comment_likes FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

CREATE POLICY "Users can remove their likes on comments" 
  ON public.forum_comment_likes FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND user_identifier IS NOT NULL)
  );

-- Politiques RLS pour les signalements
CREATE POLICY "Users can create reports" 
  ON public.forum_reports FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND reporter_user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND reporter_identifier IS NOT NULL)
  );

-- Fonction pour mettre à jour le compteur de likes des posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le compteur de commentaires des posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le compteur de likes des commentaires
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_comments 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les compteurs
CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON public.forum_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON public.forum_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON public.forum_comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER handle_updated_at_forum_posts
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_forum_comments
  BEFORE UPDATE ON public.forum_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_forum_categories
  BEFORE UPDATE ON public.forum_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Configuration pour les mises à jour en temps réel
ALTER TABLE public.forum_posts REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comments REPLICA IDENTITY FULL;
ALTER TABLE public.forum_post_likes REPLICA IDENTITY FULL;
ALTER TABLE public.forum_comment_likes REPLICA IDENTITY FULL;

-- Index pour optimiser les performances
CREATE INDEX idx_forum_posts_category_id ON public.forum_posts(category_id);
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX idx_forum_comments_parent_id ON public.forum_comments(parent_comment_id);
CREATE INDEX idx_forum_post_likes_post_id ON public.forum_post_likes(post_id);
CREATE INDEX idx_forum_comment_likes_comment_id ON public.forum_comment_likes(comment_id);
