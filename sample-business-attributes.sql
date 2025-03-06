-- Sample Business Attributes SQL Script for BusinessHub
-- This script inserts attributes for businesses based on the categories defined in sample-categories.sql

-- Clear existing data (if needed)
DELETE FROM business_attributes;

-- First, we need to get the business IDs and attribute IDs
-- We'll use variables to store these IDs for reference

-- Restaurants
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Italian'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Cuisine Type'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '$$$'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Price Range'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Dine-in", "Takeout", "Delivery"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Dining Options'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Reservations Accepted'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Outdoor Seating'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Full Bar'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pasta Paradise'
    AND ca.name = 'Alcohol Served'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

-- Sushi Sensation (Japanese restaurant)
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Japanese'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sushi Sensation'
    AND ca.name = 'Cuisine Type'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '$$$$'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sushi Sensation'
    AND ca.name = 'Price Range'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Dine-in", "Takeout"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sushi Sensation'
    AND ca.name = 'Dining Options'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sushi Sensation'
    AND ca.name = 'Reservations Accepted'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Beer & Wine'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sushi Sensation'
    AND ca.name = 'Alcohol Served'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'restaurants');

-- Cafes & Bakeries
-- Sweet Delights Bakery
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Coffee", "Pastries", "Cakes"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sweet Delights Bakery'
    AND ca.name = 'Service Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '$$'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sweet Delights Bakery'
    AND ca.name = 'Price Range'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Indoor", "Outdoor"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sweet Delights Bakery'
    AND ca.name = 'Seating Options'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Sweet Delights Bakery'
    AND ca.name = 'Wifi Available'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

-- Morning Brew Café
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Coffee", "Tea", "Breakfast", "Pastries"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Morning Brew Café'
    AND ca.name = 'Service Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '$$'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Morning Brew Café'
    AND ca.name = 'Price Range'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Indoor", "Outdoor"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Morning Brew Café'
    AND ca.name = 'Seating Options'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Morning Brew Café'
    AND ca.name = 'Wifi Available'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries');

-- Fitness
-- Pacific Fitness
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Gym'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pacific Fitness'
    AND ca.name = 'Facility Type'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Group Classes", "Personal Training", "Nutrition Counseling"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pacific Fitness'
    AND ca.name = 'Services'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Showers", "Lockers", "Sauna", "Parking"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pacific Fitness'
    AND ca.name = 'Amenities'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pacific Fitness'
    AND ca.name = '24/7 Access'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Pacific Fitness'
    AND ca.name = 'Membership Required'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- Zen Yoga Studio
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Studio'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Zen Yoga Studio'
    AND ca.name = 'Facility Type'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Group Classes", "Private Sessions", "Meditation"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Zen Yoga Studio'
    AND ca.name = 'Services'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Showers", "Lockers", "Equipment Rental", "Parking"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Zen Yoga Studio'
    AND ca.name = 'Amenities'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'false'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Zen Yoga Studio'
    AND ca.name = 'Membership Required'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'fitness');

-- Spas & Salons
-- Tranquil Spa
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Massage", "Facials", "Body Treatments", "Waxing"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Tranquil Spa'
    AND ca.name = 'Service Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Unisex'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Tranquil Spa'
    AND ca.name = 'Gender Focus'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Tranquil Spa'
    AND ca.name = 'Appointment Required'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'false'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Tranquil Spa'
    AND ca.name = 'Walk-ins Welcome'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

-- Glamour Hair Salon
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Haircuts", "Hair Coloring", "Styling", "Treatments"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Glamour Hair Salon'
    AND ca.name = 'Service Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Unisex'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Glamour Hair Salon'
    AND ca.name = 'Gender Focus'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'false'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Glamour Hair Salon'
    AND ca.name = 'Appointment Required'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Glamour Hair Salon'
    AND ca.name = 'Walk-ins Welcome'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

-- Polished Nail Bar
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Manicure", "Pedicure", "Nail Art", "Waxing"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Polished Nail Bar'
    AND ca.name = 'Service Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Unisex'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Polished Nail Bar'
    AND ca.name = 'Gender Focus'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Polished Nail Bar'
    AND ca.name = 'Walk-ins Welcome'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'spas-salons');

-- Real Estate
-- Prime Properties Real Estate
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Residential", "Commercial", "Land"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Prime Properties Real Estate'
    AND ca.name = 'Property Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'real-estate');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Buying", "Selling", "Renting", "Property Management"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Prime Properties Real Estate'
    AND ca.name = 'Services'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'real-estate');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'Greater Toronto Area'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Prime Properties Real Estate'
    AND ca.name = 'Areas Served'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'real-estate');

-- Legal Services
-- Legal Eagles Law Firm
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Family Law", "Business Law", "Real Estate Law"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Legal Eagles Law Firm'
    AND ca.name = 'Practice Areas'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'legal-services');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Legal Eagles Law Firm'
    AND ca.name = 'Free Consultation'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'legal-services');

-- Auto Repair
-- Precision Auto Repair
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Domestic", "Import", "Luxury"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Precision Auto Repair'
    AND ca.name = 'Vehicle Types'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'auto-repair');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Engine Repair", "Transmission", "Brakes", "Electrical", "Maintenance"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Precision Auto Repair'
    AND ca.name = 'Services'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'auto-repair');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Precision Auto Repair'
    AND ca.name = 'Warranty Offered'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'auto-repair');

-- Car Wash & Detailing
-- Shine Car Wash & Detailing
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Basic Wash", "Premium Wash", "Interior Detailing", "Exterior Detailing", "Full Detailing"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Shine Car Wash & Detailing'
    AND ca.name = 'Services'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'car-wash-detailing');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Shine Car Wash & Detailing'
    AND ca.name = 'Eco-Friendly Products'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'car-wash-detailing');

-- Tutoring & Education
-- Bright Minds Tutoring
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Elementary", "Middle School", "High School", "College"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Bright Minds Tutoring'
    AND ca.name = 'Education Levels'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'tutoring-education');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Math", "Science", "English", "History", "Languages"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Bright Minds Tutoring'
    AND ca.name = 'Subjects'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'tutoring-education');

-- Childcare
-- Little Explorers Daycare
INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Infants", "Toddlers", "Preschool"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Little Explorers Daycare'
    AND ca.name = 'Age Groups'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'childcare');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    'true'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Little Explorers Daycare'
    AND ca.name = 'Licensed'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'childcare');

INSERT INTO business_attributes (id, business_id, attribute_id, value)
SELECT 
    uuid_generate_v4(),
    b.id,
    ca.id,
    '["Full-time", "Part-time", "Drop-in"]'
FROM 
    businesses b,
    category_attributes ca
WHERE 
    b.name = 'Little Explorers Daycare'
    AND ca.name = 'Schedule Options'
    AND ca.category_id = (SELECT id FROM categories WHERE slug = 'childcare'); 