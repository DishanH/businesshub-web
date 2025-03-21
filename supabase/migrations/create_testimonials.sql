-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(100) NOT NULL,
  business VARCHAR(255),
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('business-owner', 'customer')),
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  active BOOLEAN DEFAULT true,
  image VARCHAR(255) DEFAULT '/placeholder.svg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS testimonials_category_idx ON testimonials(category);
CREATE INDEX IF NOT EXISTS testimonials_status_idx ON testimonials(status);
CREATE INDEX IF NOT EXISTS testimonials_featured_idx ON testimonials(featured);
CREATE INDEX IF NOT EXISTS testimonials_active_idx ON testimonials(active);

-- Sample data
INSERT INTO testimonials (id, name, email, role, business, text, rating, date, category, featured, status, image) VALUES
(uuid_generate_v4(), 'Sarah Johnson', 'sarah.j@example.com', 'Restaurant Owner', 'Seaside Bistro', 'BusinessHub completely transformed how I connect with customers. After joining, I saw a 40% increase in new customer visits within just 3 months! The platform''s analytics tools have been invaluable for understanding customer preferences.', 5, '2023-05-12T10:30:00Z', 'business-owner', true, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Michael Chen', 'mchen@example.com', 'Customer', NULL, 'I use BusinessHub every time I need a local service. The reviews are honest, and I''ve discovered so many amazing businesses I wouldn''t have found otherwise. The filter options make it easy to find exactly what I''m looking for.', 5, '2023-06-24T14:45:00Z', 'customer', true, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Jessica Williams', 'jessica.w@example.com', 'Salon Owner', 'Glamour Studio', 'As a small business owner, visibility is everything. BusinessHub made it easy to showcase my services and helped me establish a strong online presence. Customer bookings have increased by 60% since joining.', 5, '2023-04-18T09:15:00Z', 'business-owner', true, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'David Miller', 'david.m@example.com', 'Fitness Trainer', 'Peak Performance Gym', 'BusinessHub gave my fitness studio the digital presence it needed. The custom profile features let me highlight what makes my training approach unique, and I''ve connected with clients who specifically mentioned finding me through the platform.', 4, '2023-07-05T16:20:00Z', 'business-owner', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Rebecca Torres', 'rtorres@example.com', 'Customer', NULL, 'I relocated to a new city and BusinessHub was my go-to for finding trustworthy local businesses. The detailed profiles and verified reviews gave me confidence in my choices. I''ve recommended it to everyone I know!', 5, '2023-08-11T11:10:00Z', 'customer', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'James Wilson', 'jwilson@example.com', 'Bookstore Owner', 'Chapter One Books', 'The targeted advertising options on BusinessHub helped my independent bookstore reach the right audience. We''ve seen a significant increase in foot traffic from readers who share our passion for literature.', 5, '2023-03-29T13:40:00Z', 'business-owner', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Emily Parker', 'eparker@example.com', 'Customer', NULL, 'The event notifications from businesses I follow on BusinessHub keep me in the loop about sales and special events. It''s become my social calendar for local happenings, and I love supporting community businesses.', 4, '2023-09-15T15:30:00Z', 'customer', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Robert Garcia', 'rgarcia@example.com', 'Cafe Owner', 'Morning Brew', 'The insights BusinessHub provides about customer engagement helped us refine our menu offerings and opening hours. The platform practically paid for itself within the first month!', 4, '2023-02-08T08:50:00Z', 'business-owner', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Olivia Thompson', 'othompson@example.com', 'Customer', NULL, 'I appreciate how easy BusinessHub makes it to leave thoughtful feedback for businesses. As someone who relies heavily on reviews, I feel like I''m contributing to a helpful community of consumers.', 5, '2023-10-27T12:15:00Z', 'customer', false, 'approved', '/placeholder.svg'),
(uuid_generate_v4(), 'Alex Rodriguez', 'arod@example.com', 'Shop Owner', 'Tech Hub', 'Since joining BusinessHub, I''ve been able to showcase my product range effectively. Their platform is user-friendly and has significantly increased my shop''s visibility.', 4, '2023-11-05T10:20:00Z', 'business-owner', false, 'pending', '/placeholder.svg');

-- Create or replace function to handle testimonial submission
CREATE OR REPLACE FUNCTION submit_testimonial(
  p_name VARCHAR,
  p_email VARCHAR,
  p_role VARCHAR,
  p_business VARCHAR,
  p_text TEXT,
  p_rating INTEGER,
  p_category VARCHAR
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO testimonials (
    name, email, role, business, text, rating, category, status
  ) VALUES (
    p_name, p_email, p_role, p_business, p_text, p_rating, p_category, 'pending'
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 