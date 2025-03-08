# Fixing Storage Permissions for Business Images

This document provides instructions on how to fix the "failed to process and save image with new row violated low level security policy" error that occurs when uploading business images.

## The Issue

The error occurs because of Row Level Security (RLS) policies in Supabase that restrict who can upload files to the storage buckets. Even if you set the bucket to public, you still need proper RLS policies to allow authenticated users to upload files.

## Solution

### 1. Update the Code (Already Done)

The application code has been updated to:
- Use the authenticated user's ID in the file path
- Create a proper folder structure: `{userId}/{businessId}/image-{index}.jpg`
- Add better error handling for RLS violations

### 2. Configure Supabase Storage Permissions

You need to run the SQL script in the Supabase SQL Editor to set up the proper permissions:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the following SQL script:

```sql
-- Storage permissions setup for business-images bucket

-- First, check if the bucket exists, if not create it
BEGIN;
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('business-images', 'business-images', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
COMMIT;

-- Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access for business-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to business-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own objects in business-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own objects in business-images" ON storage.objects;

-- Create policy to allow public read access to all objects in the business-images bucket
CREATE POLICY "Allow public read access for business-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-images');

-- Create policy to allow authenticated users to upload to business-images bucket
-- but only to their own user folder
CREATE POLICY "Allow authenticated users to upload to business-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'business-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to update their own objects
CREATE POLICY "Allow users to update their own objects in business-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'business-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to delete their own objects
CREATE POLICY "Allow users to delete their own objects in business-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'business-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy for service role full access (for admin operations)
CREATE POLICY "Allow service role full access to business-images"
ON storage.objects
TO service_role
USING (bucket_id = 'business-images');
```

4. Run the script
5. Verify that the policies have been created by checking the Storage > Policies section in your Supabase dashboard

### 3. Alternative: Configure via Supabase UI

If you prefer using the Supabase UI instead of SQL:

1. Go to Storage in your Supabase dashboard
2. Click on the "business-images" bucket (create it if it doesn't exist)
3. Go to the "Policies" tab
4. Create the following policies:
   - **Select (read) policy**: Allow public access to all files
   - **Insert (upload) policy**: Allow authenticated users to upload only to their own user folder
   - **Update policy**: Allow users to update only their own files
   - **Delete policy**: Allow users to delete only their own files

## Testing

After applying these changes:

1. Try uploading images again through the application
2. Check the browser console and server logs for any errors
3. Verify that images are being stored in the correct folder structure

## Troubleshooting

If you still encounter issues:

1. **Check Authentication**: Make sure the user is properly authenticated before uploading
2. **Check Bucket Existence**: Ensure the "business-images" bucket exists in Supabase
3. **Check File Paths**: Verify that the file paths include the user ID as the first folder
4. **Check Logs**: Look for specific error messages in the Supabase logs

For further assistance, please contact the development team. 