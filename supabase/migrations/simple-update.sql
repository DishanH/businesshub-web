-- Simple SQL Script to update the businesses table in Supabase

-- 1. Add is_active column
ALTER TABLE businesses ADD COLUMN is_active BOOLEAN DEFAULT FALSE;

-- 2. Copy data from active to is_active
UPDATE businesses SET is_active = active WHERE active IS NOT NULL;

-- 3. Add deactivated_by_user column
ALTER TABLE businesses ADD COLUMN deactivated_by_user BOOLEAN DEFAULT FALSE;

-- 4. Add foreign key constraint for user_id
ALTER TABLE businesses 
ADD CONSTRAINT businesses_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 5. Drop the active column
ALTER TABLE businesses DROP COLUMN active;

-- 6. Update any existing businesses to have proper values
UPDATE businesses 
SET 
  is_active = COALESCE(is_active, FALSE),
  deactivated_by_user = COALESCE(deactivated_by_user, FALSE); 