
-- Create a storage bucket for forum post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('forum-images', 'forum-images', true);

-- Create RLS policies for the forum-images bucket
CREATE POLICY "Anyone can view forum images" ON storage.objects
FOR SELECT USING (bucket_id = 'forum-images');

CREATE POLICY "Authenticated users can upload forum images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'forum-images');

CREATE POLICY "Users can update their own forum images" ON storage.objects
FOR UPDATE USING (bucket_id = 'forum-images');

CREATE POLICY "Users can delete their own forum images" ON storage.objects
FOR DELETE USING (bucket_id = 'forum-images');
