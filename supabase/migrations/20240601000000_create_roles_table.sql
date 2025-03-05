-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, description, permissions)
VALUES 
  ('admin', 'Administrator with full access', '{view_users,manage_users,view_businesses,manage_businesses,view_content,manage_content,admin_access}'),
  ('business', 'Business owner with access to business features', '{view_businesses,manage_businesses,view_content}'),
  ('user', 'Regular user with basic access', '{view_content}')
ON CONFLICT (name) DO NOTHING;

-- Add RLS policies
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles
CREATE POLICY "Admins can view roles" ON public.roles
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles" ON public.roles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can update roles
CREATE POLICY "Admins can update roles" ON public.roles
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles" ON public.roles
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  ); 