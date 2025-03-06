-- Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can view roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.roles;

-- Create new RLS policies that only check user metadata
-- Only admins can view roles
CREATE POLICY "Admins can view roles" ON public.roles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles" ON public.roles
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can update roles
CREATE POLICY "Admins can update roles" ON public.roles
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles" ON public.roles
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Create a function to get roles that bypasses RLS
CREATE OR REPLACE FUNCTION public.admin_get_roles()
RETURNS SETOF public.roles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user is an admin
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN QUERY SELECT * FROM public.roles ORDER BY name;
  ELSE
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;
END;
$$; 