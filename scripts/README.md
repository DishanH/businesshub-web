# Authentication Fix Scripts

This directory contains scripts to fix authentication-related issues in the BusinessHub application.

## Prerequisites

Before running these scripts, you need to install the required dependencies:

```bash
npm install dotenv @supabase/supabase-js @types/dotenv --save-dev
```

## Available Scripts

### Fix User Profiles

This script creates user profiles for users who don't have one:

```bash
npx tsx scripts/fix-user-profiles.ts
```

### Fix User Roles

This script ensures all users have a role in their metadata:

```bash
npx tsx scripts/fix-user-roles.ts
```

## Environment Variables

These scripts require the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (not the anon key)

Make sure these are set in your `.env` file or environment.

## Common Issues and Solutions

### "Database error saving new user"

This error occurs when the database trigger fails to create a user profile. The `fix-user-profiles.ts` script will create profiles for users who don't have one.

### "Failed to load userroles"

This error occurs when users don't have a role in their metadata. The `fix-user-roles.ts` script will set a default role of 'user' for users who don't have one.

### "Using the user object as returned from supabase.auth.getSession() could be insecure"

This warning is shown when using `getSession()` instead of `getUser()`. We've updated all authentication code to use `getUser()` for better security.

### "auth-code-error" and "auth-error"

These are generic error codes from Supabase Auth. Check the specific error message for more details. Common causes include:
- Invalid email/password
- Account already exists
- Email not verified
- Rate limiting

## Manual Fixes

If the scripts don't resolve your issues, you can manually fix them in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Find the user with issues
4. Check their metadata for a role
5. Check if they have a profile in the user_profiles table 