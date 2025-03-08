# Database Update Instructions

This folder contains SQL scripts to update the database schema for the Business Hub application.

## Schema Changes

The SQL scripts will make the following changes to the database:

1. Rename `active` column to `is_active` in the businesses table
2. Add `deactivated_by_user` column (boolean, default false) to the businesses table
3. Add foreign key constraint for `user_id` referencing `auth.users(id)`

## Available SQL Scripts

1. **simple-update.sql** - Basic script with direct SQL commands
2. **safe-update.sql** - Safer script with error handling and checks (recommended)
3. **database-update.sql** - Full script with PostgreSQL DO blocks for conditional execution

## How to Run the SQL Script

### Option 1: Using Supabase SQL Editor (Recommended)

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `safe-update.sql` into the editor
5. Run the query
6. Check the output for any notices or errors

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db execute --file ./app/admin/safe-update.sql
```

### Option 3: Using psql

If you have direct access to the PostgreSQL database:

```bash
psql -h your-database-host -U your-database-user -d your-database-name -f ./app/admin/safe-update.sql
```

## Troubleshooting

If you encounter errors when running the script:

1. **Column already exists**: You can safely ignore these errors. The script is designed to handle cases where columns already exist.

2. **Foreign key constraint already exists**: This means the constraint is already in place, which is fine.

3. **Column doesn't exist**: If you get an error about the `active` column not existing, it might have already been renamed or removed. You can skip that step.

## After Running the Script

After successfully running the script, make sure to:

1. Verify that the `is_active` column exists and has the correct values
2. Verify that the `deactivated_by_user` column exists
3. Test the application to ensure it works with the new schema

## Code Changes

The application code has already been updated to use the new column names. The following files have been modified:

1. `app/actions/businesses.ts` - Updated to use `is_active` instead of `active`
2. `app/actions/add-business.ts` - Updated to use `is_active` and added `deactivated_by_user`
3. `app/my-businesses/page.tsx` - Added support for the `deactivated_by_user` flag 