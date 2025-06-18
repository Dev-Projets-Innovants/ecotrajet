
-- Create table to store user experiences/testimonials
CREATE TABLE public.user_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT,
  experience_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  category TEXT DEFAULT 'bike_maintenance',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.user_experiences ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own experiences
CREATE POLICY "Users can create experiences" 
  ON public.user_experiences 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to view their own experiences
CREATE POLICY "Users can view their own experiences" 
  ON public.user_experiences 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow everyone to view approved experiences (for public display)
CREATE POLICY "Anyone can view approved experiences" 
  ON public.user_experiences 
  FOR SELECT 
  TO anon, authenticated
  USING (is_approved = true);

-- Allow admins to view and update all experiences
CREATE POLICY "Admins can manage all experiences" 
  ON public.user_experiences 
  FOR ALL 
  TO authenticated
  USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_user_experiences_updated_at
  BEFORE UPDATE ON public.user_experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
