
-- Insert a test post for user1@gmail.com
INSERT INTO public.forum_posts (
  user_id,
  user_name,
  user_email,
  category_id,
  title,
  content,
  image_url,
  location,
  tags,
  likes_count,
  comments_count,
  is_approved,
  created_at,
  updated_at
) VALUES (
  '3740b8c8-0438-4382-86d6-1d5b01aae145',
  'user test',
  'user1@gmail.com',
  'e1ba3ffb-0960-411d-82d6-64ecc378c705',
  'Explorer la ville à vélo : mon expérience',
  'Le vélo en ville m''a permis de découvrir des quartiers que je n''aurais jamais vus en métro, tout en réduisant mon empreinte carbone de 80% sur mes trajets quotidiens. C''est devenu bien plus qu''un moyen de transport : c''est ma façon de rester connecté à ma ville et de contribuer à un environnement plus sain.',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center',
  'Paris Centre',
  ARRAY['vélo', 'écologie', 'paris', 'transport'],
  0,
  0,
  true,
  NOW(),
  NOW()
);
