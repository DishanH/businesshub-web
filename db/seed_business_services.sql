-- Insert dummy data for business with ID: f1ce39c0-c883-415b-9119-e1070699eebf

-- First, let's create service categories based on business type
-- We'll create categories for different business types
-- For this example, we'll create categories for a professional service business

-- Insert Service Categories
INSERT INTO business_service_categories (id, business_id, name, description, display_order)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Consultations', 'Initial and follow-up consultation services', 1),
  ('b2c3d4e5-f6a7-5b6c-9d0e-2f3a4b5c6d7e', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Ongoing Services', 'Regular service packages and retainers', 2),
  ('c3d4e5f6-a7b8-6c7d-0e1f-3a4b5c6d7e8f', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Specialized Offerings', 'Specialized and premium services', 3);

-- Insert Services
INSERT INTO business_services (id, business_id, category_id, name, description, price, price_description, is_featured, display_order)
VALUES
  -- Consultations
  ('d4e5f6a7-b8c9-7d0e-1f2a-4b5c6d7e8f9a', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d', 'Initial Consultation', 'Comprehensive first-time client assessment to understand your needs and goals.', 150.00, '$150', true, 1),
  ('e5f6a7b8-c9d0-8e1f-2a3b-5c6d7e8f9a0b', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d', 'Strategy Session', 'Focused problem-solving meeting to address specific challenges.', 200.00, '$200/hour', true, 2),
  ('f6a7b8c9-d0e1-9f2a-3b4c-6d7e8f9a0b1c', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d', 'Project Evaluation', 'Comprehensive review of your project to identify opportunities and risks.', 500.00, 'From $500', false, 3),
  
  -- Ongoing Services
  ('a7b8c9d0-e1f2-0a3b-4c5d-7e8f9a0b1c2d', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'b2c3d4e5-f6a7-5b6c-9d0e-2f3a4b5c6d7e', 'Monthly Retainer', 'Ongoing professional support with dedicated hours each month.', 1000.00, 'From $1,000/month', true, 1),
  ('b8c9d0e1-f2a3-1b4c-5d6e-8f9a0b1c2d3e', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'b2c3d4e5-f6a7-5b6c-9d0e-2f3a4b5c6d7e', 'Project-Based Work', 'Defined scope project completion with clear deliverables.', NULL, 'Custom quote', false, 2),
  ('c9d0e1f2-a3b4-2c5d-6e7f-9a0b1c2d3e4f', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'b2c3d4e5-f6a7-5b6c-9d0e-2f3a4b5c6d7e', 'Hourly Services', 'As-needed professional assistance for various tasks.', 175.00, '$175/hour', true, 3),
  
  -- Specialized Offerings
  ('d0e1f2a3-b4c5-3d6e-7f8a-0b1c2d3e4f5a', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'c3d4e5f6-a7b8-6c7d-0e1f-3a4b5c6d7e8f', 'Training Workshop', 'Group training sessions on specific topics for your team.', 750.00, 'From $750', false, 1),
  ('e1f2a3b4-c5d6-4e7f-8a9b-1c2d3e4f5a6b', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'c3d4e5f6-a7b8-6c7d-0e1f-3a4b5c6d7e8f', 'Document Preparation', 'Professional document creation and review services.', 350.00, 'From $350', true, 2),
  ('f2a3b4c5-d6e7-5f8a-9b0c-2d3e4f5a6b7c', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'c3d4e5f6-a7b8-6c7d-0e1f-3a4b5c6d7e8f', 'Expert Testimony', 'Professional testimony services for legal proceedings.', 300.00, '$300/hour', false, 3);

-- Insert Featured Specials
INSERT INTO business_specials (id, business_id, name, description, image_url, start_date, end_date, is_active, display_order)
VALUES
  ('a3b4c5d6-e7f8-6a9b-0c1d-2e3f4a5b6c7d', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Summer Special', 'Limited time offer: 20% off all consultation services through the summer months.', '/images/specials/summer-special.jpg', '2023-06-01', '2023-08-31', true, 1),
  ('b4c5d6e7-f8a9-7b0c-1d2e-3f4a5b6c7d8e', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'New Client Discount', 'First-time clients receive a complimentary 30-minute strategy session with any service package.', '/images/specials/new-client.jpg', '2023-01-01', '2023-12-31', true, 2),
  ('c5d6e7f8-a9b0-8c1d-2e3f-4a5b6c7d8e9f', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Loyalty Program', 'Join our loyalty program and earn points with every service that can be redeemed for future discounts.', '/images/specials/loyalty.jpg', '2023-01-01', NULL, true, 3);

-- You can add more dummy data for other business types by uncommenting and modifying the sections below

-- -- Restaurant/Food Service Categories
-- INSERT INTO business_service_categories (id, business_id, name, description, display_order)
-- VALUES 
--   ('d6e7f8a9-b0c1-9d2e-3f4a-5b6c7d8e9f0a', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Starters', 'Appetizers and small plates', 1),
--   ('e7f8a9b0-c1d2-0e3f-4a5b-6c7d8e9f0a1b', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Main Courses', 'Entrees and main dishes', 2),
--   ('f8a9b0c1-d2e3-1f4a-5b6c-7d8e9f0a1b2c', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Desserts', 'Sweet treats and desserts', 3);

-- -- Auto/Vehicle Service Categories
-- INSERT INTO business_service_categories (id, business_id, name, description, display_order)
-- VALUES 
--   ('a9b0c1d2-e3f4-2a5b-6c7d-8e9f0a1b2c3d', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Maintenance', 'Regular vehicle maintenance services', 1),
--   ('b0c1d2e3-f4a5-3b6c-7d8e-9f0a1b2c3d4e', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Repairs', 'Vehicle repair services', 2),
--   ('c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Packages', 'Service package deals', 3);

-- -- Gym/Fitness Service Categories
-- INSERT INTO business_service_categories (id, business_id, name, description, display_order)
-- VALUES 
--   ('d2e3f4a5-b6c7-5d8e-9f0a-1b2c3d4e5f6a', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Memberships', 'Gym membership options', 1),
--   ('e3f4a5b6-c7d8-6e9f-0a1b-2c3d4e5f6a7b', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Personal Training', 'One-on-one training services', 2),
--   ('f4a5b6c7-d8e9-7f0a-1b2c-3d4e5f6a7b8c', 'f1ce39c0-c883-415b-9119-e1070699eebf', 'Specialty Services', 'Specialized fitness offerings', 3); 