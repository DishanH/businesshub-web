-- Safe SQL Script to update the businesses table in Supabase
-- This script handles errors and checks if columns exist before modifying them

BEGIN;

-- 1. Add is_active column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'businesses' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE businesses ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_active column';
    ELSE
        RAISE NOTICE 'is_active column already exists';
    END IF;
END $$;

-- 2. Copy data from active to is_active if active exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'businesses' AND column_name = 'active'
    ) THEN
        UPDATE businesses SET is_active = active WHERE active IS NOT NULL;
        RAISE NOTICE 'Copied data from active to is_active';
    ELSE
        RAISE NOTICE 'active column does not exist, skipping data copy';
    END IF;
END $$;

-- 3. Add deactivated_by_user column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'businesses' AND column_name = 'deactivated_by_user'
    ) THEN
        ALTER TABLE businesses ADD COLUMN deactivated_by_user BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added deactivated_by_user column';
    ELSE
        RAISE NOTICE 'deactivated_by_user column already exists';
    END IF;
END $$;

-- 4. Add foreign key constraint for user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints
        WHERE constraint_name = 'businesses_user_id_fkey' AND table_name = 'businesses'
    ) THEN
        ALTER TABLE businesses 
        ADD CONSTRAINT businesses_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint for user_id';
    ELSE
        RAISE NOTICE 'Foreign key constraint for user_id already exists';
    END IF;
END $$;

-- 5. Drop the active column if it exists and is_active exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'businesses' AND column_name = 'active'
    ) AND EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'businesses' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE businesses DROP COLUMN active;
        RAISE NOTICE 'Dropped active column';
    ELSE
        RAISE NOTICE 'Cannot drop active column (either it does not exist or is_active does not exist)';
    END IF;
END $$;

-- 6. Update any existing businesses to have proper values
UPDATE businesses 
SET 
    is_active = COALESCE(is_active, FALSE),
    deactivated_by_user = COALESCE(deactivated_by_user, FALSE);
RAISE NOTICE 'Updated existing businesses with default values';

COMMIT; 