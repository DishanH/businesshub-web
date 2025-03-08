-- SQL Script to update the businesses table for PostgreSQL (Supabase)

-- 1. Check if is_active column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE businesses ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 2. Copy data from active to is_active (if active exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'active'
  ) THEN
    UPDATE businesses SET is_active = active WHERE active IS NOT NULL;
  END IF;
END $$;

-- 3. Check if deactivated_by_user column exists, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'deactivated_by_user'
  ) THEN
    ALTER TABLE businesses ADD COLUMN deactivated_by_user BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 4. Add foreign key constraint for user_id (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'businesses_user_id_fkey'
    AND table_name = 'businesses'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE businesses 
    ADD CONSTRAINT businesses_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Drop the active column (only after confirming is_active exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'active'
  ) AND EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'businesses' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE businesses DROP COLUMN active;
  END IF;
END $$;

-- 6. Update any existing businesses to have proper values
UPDATE businesses 
SET 
  is_active = COALESCE(is_active, FALSE),
  deactivated_by_user = COALESCE(deactivated_by_user, FALSE); 