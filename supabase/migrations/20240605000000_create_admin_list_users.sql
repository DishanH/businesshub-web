-- Create a function to list users that bypasses RLS
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  id uuid,
  email text,
  user_metadata jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user is an admin
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN QUERY 
      SELECT 
        au.id,
        au.email::text,
        au.raw_user_meta_data as user_metadata,
        au.created_at
      FROM auth.users au
      ORDER BY au.created_at DESC;
  ELSE
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;
END;
$$; 