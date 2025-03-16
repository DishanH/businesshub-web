-- Create the business_reviews table
CREATE TABLE IF NOT EXISTS business_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the business_review_replies table
CREATE TABLE IF NOT EXISTS business_review_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES business_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_reviews_business_id ON business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_user_id ON business_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_business_review_replies_review_id ON business_review_replies(review_id);
CREATE INDEX IF NOT EXISTS idx_business_review_replies_user_id ON business_review_replies(user_id);

-- Set up Row Level Security (RLS) policies
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_review_replies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read reviews" ON business_reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON business_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON business_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON business_reviews;
DROP POLICY IF EXISTS "Anyone can read review replies" ON business_review_replies;
DROP POLICY IF EXISTS "Authenticated users can insert replies" ON business_review_replies;
DROP POLICY IF EXISTS "Users can update their own replies" ON business_review_replies;
DROP POLICY IF EXISTS "Users can delete their own replies" ON business_review_replies;

-- Policy for reading reviews (anyone can read)
CREATE POLICY "Anyone can read reviews" 
  ON business_reviews FOR SELECT 
  USING (true);

-- Policy for inserting reviews (authenticated users only)
CREATE POLICY "Authenticated users can insert reviews" 
  ON business_reviews FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating reviews (only the author)
CREATE POLICY "Users can update their own reviews" 
  ON business_reviews FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting reviews (author, business owner, or admin)
CREATE POLICY "Users can delete their own reviews" 
  ON business_reviews FOR DELETE 
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy for reading replies (anyone can read)
CREATE POLICY "Anyone can read review replies" 
  ON business_review_replies FOR SELECT 
  USING (true);

-- Policy for inserting replies (authenticated users only)
CREATE POLICY "Authenticated users can insert replies" 
  ON business_review_replies FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating replies (only the author)
CREATE POLICY "Users can update their own replies" 
  ON business_review_replies FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting replies (author, business owner, or admin)
CREATE POLICY "Users can delete their own replies" 
  ON business_review_replies FOR DELETE 
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM business_reviews br
      JOIN businesses b ON br.business_id = b.id
      WHERE br.id = review_id AND b.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create a view to make it easier to join reviews with user data
CREATE OR REPLACE VIEW review_details AS
SELECT 
  br.id,
  br.business_id,
  br.user_id,
  br.rating,
  br.content,
  br.image_url,
  br.is_verified,
  br.created_at,
  br.updated_at,
  up.display_name,
  up.full_name,
  up.avatar_url
FROM 
  business_reviews br
LEFT JOIN 
  user_profiles up ON br.user_id = up.user_id;

-- Create a view to make it easier to join replies with user data
CREATE OR REPLACE VIEW reply_details AS
SELECT 
  brr.id,
  brr.review_id,
  brr.user_id,
  brr.content,
  brr.created_at,
  brr.updated_at,
  up.display_name,
  up.full_name,
  up.avatar_url
FROM 
  business_review_replies brr
LEFT JOIN 
  user_profiles up ON brr.user_id = up.user_id;

-- Insert sample review data (only if needed for testing)
-- Comment out or remove these inserts in production
/*
INSERT INTO business_reviews (business_id, user_id, rating, content, created_at)
VALUES 
  ('f1ce39c0-c883-415b-9119-e1070699eebf', '00000000-0000-0000-0000-000000000001', 5, 'Excellent service! The staff was very friendly and professional. I''ll definitely be coming back.', '2023-05-15T10:30:00Z'),
  ('f1ce39c0-c883-415b-9119-e1070699eebf', '00000000-0000-0000-0000-000000000002', 4, 'Great experience overall. The quality was top-notch, though prices are a bit on the higher side.', '2023-04-22T14:15:00Z'),
  ('f1ce39c0-c883-415b-9119-e1070699eebf', '00000000-0000-0000-0000-000000000003', 5, 'I''ve been a regular customer for years and have never been disappointed. Highly recommended!', '2023-03-10T09:45:00Z'),
  ('f1ce39c0-c883-415b-9119-e1070699eebf', '00000000-0000-0000-0000-000000000004', 3, 'Service was okay, but I had to wait longer than expected. The staff was apologetic though.', '2023-06-05T16:20:00Z'),
  ('f1ce39c0-c883-415b-9119-e1070699eebf', '00000000-0000-0000-0000-000000000005', 4, 'Very professional team. They addressed all my concerns and provided excellent solutions.', '2023-07-12T11:10:00Z');

-- Insert sample owner replies
INSERT INTO business_review_replies (review_id, user_id, content, created_at)
VALUES
  ((SELECT id FROM business_reviews WHERE content LIKE 'Service was okay%'), '00000000-0000-0000-0000-000000000010', 'Thank you for your feedback. We apologize for the wait time and are working to improve our scheduling. We hope you''ll give us another chance!', '2023-06-06T09:30:00Z'),
  ((SELECT id FROM business_reviews WHERE content LIKE 'I''ve been a regular%'), '00000000-0000-0000-0000-000000000010', 'We appreciate your continued support! Loyal customers like you make what we do worthwhile.', '2023-03-11T14:20:00Z');
*/ 