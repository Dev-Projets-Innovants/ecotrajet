
-- Fix the image URL for the test post
UPDATE public.forum_posts 
SET image_url = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&crop=center'
WHERE user_email = 'user1@gmail.com' 
AND title = 'Explorer la ville à vélo : mon expérience';
