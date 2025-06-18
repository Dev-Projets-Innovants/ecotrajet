
-- Update the image URL with the provided link
UPDATE public.forum_posts 
SET image_url = 'https://cdn.sortiraparis.com/images/80/83517/577982-visuel-paris-velo-quai.jpg'
WHERE user_email = 'user1@gmail.com' 
AND title = 'Explorer la ville à vélo : mon expérience';
