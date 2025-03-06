-- Drop the is_active column from user_profiles
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS is_active;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS role;

-- Update the handle_email_verification function to remove is_active update
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Email verification is now handled by Supabase Auth
    -- No need to update user_profiles
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Create new RLS policies that check user metadata for admin role
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Create a function to get user profiles that bypasses RLS
CREATE OR REPLACE FUNCTION public.admin_get_user_profiles()
RETURNS SETOF public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user is an admin
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN QUERY SELECT * FROM public.user_profiles;
  ELSE
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;
END;
$$; 