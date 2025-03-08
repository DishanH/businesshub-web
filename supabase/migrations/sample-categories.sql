-- Sample Categories SQL Script for BusinessHub
-- This script creates 25 categories with subcategories and attributes for local businesses

-- Function to generate UUIDs (if not using PostgreSQL's built-in uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clear existing data (if needed)
DELETE FROM category_attributes;
DELETE FROM category_subcategories;
DELETE FROM categories;

-- Insert categories
INSERT INTO categories (id, name, description, slug, icon, active, created_at, updated_at) VALUES
-- Restaurants & Food
(uuid_generate_v4(), 'Restaurants', 'Dining establishments offering prepared food and beverages', 'restaurants', 'utensils', true, NOW(), NOW()),
(uuid_generate_v4(), 'Cafes & Bakeries', 'Coffee shops, bakeries, and dessert places', 'cafes-bakeries', 'coffee', true, NOW(), NOW()),
(uuid_generate_v4(), 'Food Delivery', 'Food delivery services and meal prep businesses', 'food-delivery', 'truck', true, NOW(), NOW()),

-- Retail & Shopping
(uuid_generate_v4(), 'Clothing & Fashion', 'Clothing stores, boutiques, and fashion retailers', 'clothing-fashion', 'shirt', true, NOW(), NOW()),
(uuid_generate_v4(), 'Electronics', 'Electronics stores and repair services', 'electronics', 'laptop', true, NOW(), NOW()),
(uuid_generate_v4(), 'Home Goods', 'Furniture, decor, and home improvement stores', 'home-goods', 'home', true, NOW(), NOW()),
(uuid_generate_v4(), 'Specialty Shops', 'Specialty and niche retail stores', 'specialty-shops', 'gift', true, NOW(), NOW()),

-- Health & Wellness
(uuid_generate_v4(), 'Fitness', 'Gyms, fitness studios, and personal trainers', 'fitness', 'dumbbell', true, NOW(), NOW()),
(uuid_generate_v4(), 'Spas & Salons', 'Beauty salons, spas, and wellness centers', 'spas-salons', 'scissors', true, NOW(), NOW()),
(uuid_generate_v4(), 'Healthcare', 'Medical clinics, dental offices, and healthcare providers', 'healthcare', 'stethoscope', true, NOW(), NOW()),

-- Professional Services
(uuid_generate_v4(), 'Legal Services', 'Law firms, attorneys, and legal consultants', 'legal-services', 'gavel', true, NOW(), NOW()),
(uuid_generate_v4(), 'Financial Services', 'Accounting, tax preparation, and financial advisors', 'financial-services', 'dollar-sign', true, NOW(), NOW()),
(uuid_generate_v4(), 'Real Estate', 'Real estate agencies, property management, and brokers', 'real-estate', 'building', true, NOW(), NOW()),
(uuid_generate_v4(), 'Marketing & Design', 'Marketing agencies, graphic design, and creative services', 'marketing-design', 'pen-tool', true, NOW(), NOW()),

-- Home Services
(uuid_generate_v4(), 'Cleaning Services', 'Home cleaning, commercial cleaning, and specialized cleaning', 'cleaning-services', 'spray-can', true, NOW(), NOW()),
(uuid_generate_v4(), 'Repair & Maintenance', 'Home repair, maintenance, and handyman services', 'repair-maintenance', 'tool', true, NOW(), NOW()),
(uuid_generate_v4(), 'Landscaping', 'Landscaping, lawn care, and gardening services', 'landscaping', 'tree', true, NOW(), NOW()),

-- Automotive
(uuid_generate_v4(), 'Auto Repair', 'Auto repair shops, mechanics, and maintenance services', 'auto-repair', 'wrench', true, NOW(), NOW()),
(uuid_generate_v4(), 'Car Wash & Detailing', 'Car wash, detailing, and auto cleaning services', 'car-wash-detailing', 'droplet', true, NOW(), NOW()),

-- Education & Childcare
(uuid_generate_v4(), 'Tutoring & Education', 'Tutoring services, educational centers, and schools', 'tutoring-education', 'book', true, NOW(), NOW()),
(uuid_generate_v4(), 'Childcare', 'Daycare centers, babysitting, and childcare services', 'childcare', 'child', true, NOW(), NOW()),

-- Entertainment & Events
(uuid_generate_v4(), 'Event Planning', 'Event planners, party supplies, and venue rentals', 'event-planning', 'calendar', true, NOW(), NOW()),
(uuid_generate_v4(), 'Entertainment Venues', 'Movie theaters, arcades, and entertainment centers', 'entertainment-venues', 'film', true, NOW(), NOW()),

-- Pet Services
(uuid_generate_v4(), 'Pet Care', 'Pet grooming, boarding, and veterinary services', 'pet-care', 'heart', true, NOW(), NOW()),
(uuid_generate_v4(), 'Pet Supplies', 'Pet stores, food, and supplies', 'pet-supplies', 'shopping-bag', true, NOW(), NOW());

-- Store category IDs for reference
DO $$
DECLARE
    restaurants_id UUID;
    cafes_id UUID;
    food_delivery_id UUID;
    clothing_id UUID;
    electronics_id UUID;
    home_goods_id UUID;
    specialty_shops_id UUID;
    fitness_id UUID;
    spas_id UUID;
    healthcare_id UUID;
    legal_id UUID;
    financial_id UUID;
    real_estate_id UUID;
    marketing_id UUID;
    cleaning_id UUID;
    repair_id UUID;
    landscaping_id UUID;
    auto_repair_id UUID;
    car_wash_id UUID;
    tutoring_id UUID;
    childcare_id UUID;
    event_planning_id UUID;
    entertainment_id UUID;
    pet_care_id UUID;
    pet_supplies_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO restaurants_id FROM categories WHERE slug = 'restaurants' LIMIT 1;
    SELECT id INTO cafes_id FROM categories WHERE slug = 'cafes-bakeries' LIMIT 1;
    SELECT id INTO food_delivery_id FROM categories WHERE slug = 'food-delivery' LIMIT 1;
    SELECT id INTO clothing_id FROM categories WHERE slug = 'clothing-fashion' LIMIT 1;
    SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics' LIMIT 1;
    SELECT id INTO home_goods_id FROM categories WHERE slug = 'home-goods' LIMIT 1;
    SELECT id INTO specialty_shops_id FROM categories WHERE slug = 'specialty-shops' LIMIT 1;
    SELECT id INTO fitness_id FROM categories WHERE slug = 'fitness' LIMIT 1;
    SELECT id INTO spas_id FROM categories WHERE slug = 'spas-salons' LIMIT 1;
    SELECT id INTO healthcare_id FROM categories WHERE slug = 'healthcare' LIMIT 1;
    SELECT id INTO legal_id FROM categories WHERE slug = 'legal-services' LIMIT 1;
    SELECT id INTO financial_id FROM categories WHERE slug = 'financial-services' LIMIT 1;
    SELECT id INTO real_estate_id FROM categories WHERE slug = 'real-estate' LIMIT 1;
    SELECT id INTO marketing_id FROM categories WHERE slug = 'marketing-design' LIMIT 1;
    SELECT id INTO cleaning_id FROM categories WHERE slug = 'cleaning-services' LIMIT 1;
    SELECT id INTO repair_id FROM categories WHERE slug = 'repair-maintenance' LIMIT 1;
    SELECT id INTO landscaping_id FROM categories WHERE slug = 'landscaping' LIMIT 1;
    SELECT id INTO auto_repair_id FROM categories WHERE slug = 'auto-repair' LIMIT 1;
    SELECT id INTO car_wash_id FROM categories WHERE slug = 'car-wash-detailing' LIMIT 1;
    SELECT id INTO tutoring_id FROM categories WHERE slug = 'tutoring-education' LIMIT 1;
    SELECT id INTO childcare_id FROM categories WHERE slug = 'childcare' LIMIT 1;
    SELECT id INTO event_planning_id FROM categories WHERE slug = 'event-planning' LIMIT 1;
    SELECT id INTO entertainment_id FROM categories WHERE slug = 'entertainment-venues' LIMIT 1;
    SELECT id INTO pet_care_id FROM categories WHERE slug = 'pet-care' LIMIT 1;
    SELECT id INTO pet_supplies_id FROM categories WHERE slug = 'pet-supplies' LIMIT 1;

    -- Insert subcategories for Restaurants
    INSERT INTO category_subcategories (id, category_id, name, description, active) VALUES
    (uuid_generate_v4(), restaurants_id, 'Fine Dining', 'Upscale restaurants with high-end cuisine', true),
    (uuid_generate_v4(), restaurants_id, 'Fast Food', 'Quick service restaurants with counter service', true),
    (uuid_generate_v4(), restaurants_id, 'Casual Dining', 'Relaxed restaurants with table service', true),
    (uuid_generate_v4(), restaurants_id, 'Italian', 'Italian cuisine restaurants', true),
    (uuid_generate_v4(), restaurants_id, 'Asian', 'Asian cuisine restaurants including Chinese, Japanese, Thai', true),
    (uuid_generate_v4(), restaurants_id, 'Mexican', 'Mexican cuisine restaurants', true),
    (uuid_generate_v4(), restaurants_id, 'Vegetarian/Vegan', 'Restaurants specializing in vegetarian and vegan options', true);

    -- Insert subcategories for Cafes & Bakeries
    INSERT INTO category_subcategories (id, category_id, name, description, active) VALUES
    (uuid_generate_v4(), cafes_id, 'Coffee Shops', 'Cafes specializing in coffee and espresso drinks', true),
    (uuid_generate_v4(), cafes_id, 'Bakeries', 'Shops specializing in baked goods', true),
    (uuid_generate_v4(), cafes_id, 'Dessert Shops', 'Specialty dessert establishments', true),
    (uuid_generate_v4(), cafes_id, 'Tea Houses', 'Cafes specializing in tea varieties', true);

    -- Insert subcategories for Fitness
    INSERT INTO category_subcategories (id, category_id, name, description, active) VALUES
    (uuid_generate_v4(), fitness_id, 'Gyms', 'Full-service fitness facilities', true),
    (uuid_generate_v4(), fitness_id, 'Yoga Studios', 'Studios specializing in yoga classes', true),
    (uuid_generate_v4(), fitness_id, 'Personal Trainers', 'Individual fitness coaching services', true),
    (uuid_generate_v4(), fitness_id, 'CrossFit', 'CrossFit boxes and high-intensity training', true),
    (uuid_generate_v4(), fitness_id, 'Pilates', 'Pilates studios and instructors', true);

    -- Insert subcategories for Spas & Salons
    INSERT INTO category_subcategories (id, category_id, name, description, active) VALUES
    (uuid_generate_v4(), spas_id, 'Hair Salons', 'Hair cutting, styling, and coloring services', true),
    (uuid_generate_v4(), spas_id, 'Nail Salons', 'Manicure and pedicure services', true),
    (uuid_generate_v4(), spas_id, 'Day Spas', 'Full-service spa facilities', true),
    (uuid_generate_v4(), spas_id, 'Massage Therapy', 'Massage and bodywork services', true),
    (uuid_generate_v4(), spas_id, 'Barbershops', 'Men\'s grooming and haircut services', true);

    -- Insert subcategories for Pet Care
    INSERT INTO category_subcategories (id, category_id, name, description, active) VALUES
    (uuid_generate_v4(), pet_care_id, 'Veterinarians', 'Veterinary clinics and animal hospitals', true),
    (uuid_generate_v4(), pet_care_id, 'Pet Grooming', 'Pet grooming and bathing services', true),
    (uuid_generate_v4(), pet_care_id, 'Pet Boarding', 'Kennels and pet boarding facilities', true),
    (uuid_generate_v4(), pet_care_id, 'Dog Walking', 'Dog walking and pet sitting services', true),
    (uuid_generate_v4(), pet_care_id, 'Pet Training', 'Animal behavior and training services', true);

    -- Insert attributes for Restaurants
    INSERT INTO category_attributes (id, category_id, name, type, options, required, description) VALUES
    (uuid_generate_v4(), restaurants_id, 'Cuisine Type', 'select', ARRAY['Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian', 'American', 'Mediterranean', 'French', 'Greek', 'Spanish', 'Korean', 'Vietnamese', 'Middle Eastern', 'Fusion', 'Other'], true, 'Primary cuisine style'),
    (uuid_generate_v4(), restaurants_id, 'Price Range', 'select', ARRAY['$', '$$', '$$$', '$$$$'], true, 'Price range indicator'),
    (uuid_generate_v4(), restaurants_id, 'Dining Options', 'multiselect', ARRAY['Dine-in', 'Takeout', 'Delivery', 'Curbside pickup', 'Drive-thru'], true, 'Available dining options'),
    (uuid_generate_v4(), restaurants_id, 'Reservations Accepted', 'boolean', NULL, false, 'Whether the restaurant accepts reservations'),
    (uuid_generate_v4(), restaurants_id, 'Outdoor Seating', 'boolean', NULL, false, 'Whether outdoor seating is available'),
    (uuid_generate_v4(), restaurants_id, 'Alcohol Served', 'select', ARRAY['None', 'Beer & Wine', 'Full Bar'], false, 'Alcohol service options');

    -- Insert attributes for Fitness
    INSERT INTO category_attributes (id, category_id, name, type, options, required, description) VALUES
    (uuid_generate_v4(), fitness_id, 'Facility Type', 'select', ARRAY['Gym', 'Studio', 'Home-based', 'Outdoor', 'Online'], true, 'Type of fitness facility'),
    (uuid_generate_v4(), fitness_id, 'Services', 'multiselect', ARRAY['Group Classes', 'Personal Training', 'Equipment Rental', 'Nutrition Counseling', 'Massage', 'Childcare'], true, 'Services offered'),
    (uuid_generate_v4(), fitness_id, 'Amenities', 'multiselect', ARRAY['Showers', 'Lockers', 'Sauna', 'Pool', 'Towel Service', 'Wifi', 'Parking'], false, 'Available amenities'),
    (uuid_generate_v4(), fitness_id, '24/7 Access', 'boolean', NULL, false, 'Whether 24/7 access is available'),
    (uuid_generate_v4(), fitness_id, 'Membership Required', 'boolean', NULL, false, 'Whether membership is required');

    -- Insert attributes for Spas & Salons
    INSERT INTO category_attributes (id, category_id, name, type, options, required, description) VALUES
    (uuid_generate_v4(), spas_id, 'Service Types', 'multiselect', ARRAY['Haircuts', 'Hair Coloring', 'Manicure', 'Pedicure', 'Facials', 'Massage', 'Waxing', 'Body Treatments', 'Makeup', 'Tanning'], true, 'Services offered'),
    (uuid_generate_v4(), spas_id, 'Gender Focus', 'select', ARRAY['Women', 'Men', 'Unisex'], false, 'Primary gender focus'),
    (uuid_generate_v4(), spas_id, 'Appointment Required', 'boolean', NULL, false, 'Whether appointments are required'),
    (uuid_generate_v4(), spas_id, 'Walk-ins Welcome', 'boolean', NULL, false, 'Whether walk-ins are accepted');

    -- Insert attributes for Pet Care
    INSERT INTO category_attributes (id, category_id, name, type, options, required, description) VALUES
    (uuid_generate_v4(), pet_care_id, 'Animals Served', 'multiselect', ARRAY['Dogs', 'Cats', 'Birds', 'Small Mammals', 'Reptiles', 'Fish', 'Exotic'], true, 'Types of animals served'),
    (uuid_generate_v4(), pet_care_id, 'Services', 'multiselect', ARRAY['Checkups', 'Vaccinations', 'Surgery', 'Grooming', 'Boarding', 'Training', 'Daycare', 'Emergency Care'], true, 'Services offered'),
    (uuid_generate_v4(), pet_care_id, 'House Calls', 'boolean', NULL, false, 'Whether house calls are available'),
    (uuid_generate_v4(), pet_care_id, 'Emergency Services', 'boolean', NULL, false, 'Whether emergency services are available');

    -- Insert attributes for Real Estate
    INSERT INTO category_attributes (id, category_id, name, type, options, required, description) VALUES
    (uuid_generate_v4(), real_estate_id, 'Property Types', 'multiselect', ARRAY['Residential', 'Commercial', 'Industrial', 'Land', 'Multi-family'], true, 'Types of properties handled'),
    (uuid_generate_v4(), real_estate_id, 'Services', 'multiselect', ARRAY['Buying', 'Selling', 'Renting', 'Property Management', 'Consulting', 'Appraisals'], true, 'Services offered'),
    (uuid_generate_v4(), real_estate_id, 'Areas Served', 'text', NULL, true, 'Geographic areas served');

END $$; 