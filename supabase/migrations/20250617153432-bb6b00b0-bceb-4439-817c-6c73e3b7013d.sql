
-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- Create a security definer function to check admin status (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE((
    SELECT is_admin 
    FROM public.profiles 
    WHERE id = auth.uid()
  ), false);
$$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Allow admins to delete profiles (except their own)
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE 
TO authenticated
USING (public.is_admin() AND auth.uid() != id);

-- Allow profile creation during signup
CREATE POLICY "Allow profile creation" ON public.profiles
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);
