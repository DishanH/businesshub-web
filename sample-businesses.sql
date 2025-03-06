-- Sample Businesses SQL Script for BusinessHub
-- This script creates businesses with attributes for various categories

-- Function to generate UUIDs (if not using PostgreSQL's built-in uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clear existing data (if needed)
DELETE FROM business_attributes;
DELETE FROM businesses;

-- Insert businesses
INSERT INTO businesses (id, name, description, address, city, state, zip, phone, email, website, category_id, subcategory_id, price_range, rating, image, active, created_at, updated_at) VALUES
-- Restaurants
(uuid_generate_v4(), 'Sweet Delights Bakery', 'Artisanal cakes and pastries for all occasions.', '123 Main St', 'Toronto', 'ON', 'M5V 2H1', '416-555-1234', 'info@sweetdelights.com', 'https://sweetdelights.example.com', 
 (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 
 (SELECT id FROM category_subcategories WHERE name = 'Bakeries' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries')), 
 2, 4.5, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Pasta Paradise', 'Authentic Italian cuisine with homemade pasta.', '456 Queen St', 'Toronto', 'ON', 'M5V 2H2', '416-555-5678', 'info@pastaparadise.com', 'https://pastaparadise.example.com', 
 (SELECT id FROM categories WHERE slug = 'restaurants'), 
 (SELECT id FROM category_subcategories WHERE name = 'Italian' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants')), 
 3, 4.7, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Sushi Sensation', 'Fresh, authentic Japanese sushi and sashimi.', '789 King St', 'Vancouver', 'BC', 'V6B 1A1', '604-555-9012', 'info@sushisensation.com', 'https://sushisensation.example.com', 
 (SELECT id FROM categories WHERE slug = 'restaurants'), 
 (SELECT id FROM category_subcategories WHERE name = 'Asian' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants')), 
 4, 4.8, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Morning Brew Café', 'Cozy café with specialty coffees and fresh pastries.', '101 Yonge St', 'Toronto', 'ON', 'M5C 1W1', '416-555-3456', 'info@morningbrew.com', 'https://morningbrew.example.com', 
 (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 
 (SELECT id FROM category_subcategories WHERE name = 'Coffee Shops' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries')), 
 2, 4.6, '/placeholder.svg', true, NOW(), NOW()),

-- Health & Wellness
(uuid_generate_v4(), 'Pacific Fitness', 'State-of-the-art gym with personal trainers and group classes.', '202 Robson St', 'Vancouver', 'BC', 'V6B 1A2', '604-555-7890', 'info@pacificfitness.com', 'https://pacificfitness.example.com', 
 (SELECT id FROM categories WHERE slug = 'fitness'), 
 (SELECT id FROM category_subcategories WHERE name = 'Gyms' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness')), 
 3, 4.6, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Zen Yoga Studio', 'Peaceful yoga classes for all levels in a serene environment.', '303 Granville St', 'Vancouver', 'BC', 'V6C 1T2', '604-555-2345', 'info@zenyoga.com', 'https://zenyoga.example.com', 
 (SELECT id FROM categories WHERE slug = 'fitness'), 
 (SELECT id FROM category_subcategories WHERE name = 'Yoga Studios' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness')), 
 3, 4.9, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Tranquil Spa', 'Luxurious spa treatments and massages for ultimate relaxation.', '404 Burrard St', 'Vancouver', 'BC', 'V6C 3A6', '604-555-6789', 'info@tranquilspa.com', 'https://tranquilspa.example.com', 
 (SELECT id FROM categories WHERE slug = 'spas-salons'), 
 (SELECT id FROM category_subcategories WHERE name = 'Day Spas' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons')), 
 4, 4.8, '/placeholder.svg', true, NOW(), NOW()),

-- Home Services
(uuid_generate_v4(), 'Quick Fix Plumbing', '24/7 emergency plumbing services with licensed professionals.', '505 Dundas St', 'Toronto', 'ON', 'M5A 2B6', '416-555-0123', 'service@quickfixplumbing.com', 'https://quickfixplumbing.example.com', 
 (SELECT id FROM categories WHERE slug = 'repair-maintenance'), 
 (SELECT id FROM category_subcategories WHERE name = 'Home Repair' AND category_id = (SELECT id FROM categories WHERE slug = 'repair-maintenance')), 
 3, 4.5, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Green Thumb Landscaping', 'Professional landscaping and garden maintenance services.', '606 Spadina Ave', 'Toronto', 'ON', 'M5S 2H4', '416-555-4567', 'info@greenthumb.com', 'https://greenthumb.example.com', 
 (SELECT id FROM categories WHERE slug = 'landscaping'), 
 (SELECT id FROM category_subcategories WHERE name = 'Landscaping' AND category_id = (SELECT id FROM categories WHERE slug = 'landscaping')), 
 3, 4.7, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Spotless Cleaning', 'Eco-friendly residential and commercial cleaning services.', '707 Homer St', 'Vancouver', 'BC', 'V6B 5T4', '604-555-8901', 'info@spotlesscleaning.com', 'https://spotlesscleaning.example.com', 
 (SELECT id FROM categories WHERE slug = 'cleaning-services'), 
 (SELECT id FROM category_subcategories WHERE name = 'Home Cleaning' AND category_id = (SELECT id FROM categories WHERE slug = 'cleaning-services')), 
 2, 4.6, '/placeholder.svg', true, NOW(), NOW()),

-- Technology (Note: This category doesn't exist in sample-categories.sql, replacing with Electronics)
(uuid_generate_v4(), 'Tech Wizards', 'Expert computer repair and IT support for homes and businesses.', '808 Bay St', 'Toronto', 'ON', 'M5S 1M5', '416-555-2345', 'support@techwizards.com', 'https://techwizards.example.com', 
 (SELECT id FROM categories WHERE slug = 'electronics'), 
 (SELECT id FROM category_subcategories WHERE name = 'Computer Repair' AND category_id = (SELECT id FROM categories WHERE slug = 'electronics')), 
 3, 4.8, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Digital Solutions', 'Custom software development and web design services.', '909 Seymour St', 'Vancouver', 'BC', 'V6B 3M1', '604-555-6789', 'info@digitalsolutions.com', 'https://digitalsolutions.example.com', 
 (SELECT id FROM categories WHERE slug = 'marketing-design'), 
 (SELECT id FROM category_subcategories WHERE name = 'Web Design' AND category_id = (SELECT id FROM categories WHERE slug = 'marketing-design')), 
 4, 4.9, '/placeholder.svg', true, NOW(), NOW()),

-- Automotive
(uuid_generate_v4(), 'Precision Auto Repair', 'Quality auto repair and maintenance services for all makes and models.', '111 Front St', 'Toronto', 'ON', 'M5J 2M2', '416-555-7890', 'service@precisionauto.com', 'https://precisionauto.example.com', 
 (SELECT id FROM categories WHERE slug = 'auto-repair'), 
 (SELECT id FROM category_subcategories WHERE name = 'Auto Repair' AND category_id = (SELECT id FROM categories WHERE slug = 'auto-repair')), 
 3, 4.7, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Shine Car Wash & Detailing', 'Professional car washing and detailing services.', '222 Pacific Blvd', 'Vancouver', 'BC', 'V6Z 2V6', '604-555-0123', 'info@shinecarwash.com', 'https://shinecarwash.example.com', 
 (SELECT id FROM categories WHERE slug = 'car-wash-detailing'), 
 (SELECT id FROM category_subcategories WHERE name = 'Car Wash' AND category_id = (SELECT id FROM categories WHERE slug = 'car-wash-detailing')), 
 2, 4.5, '/placeholder.svg', true, NOW(), NOW()),

-- Professional Services
(uuid_generate_v4(), 'Clear Tax Accounting', 'Professional tax preparation and accounting services for individuals and businesses.', '333 University Ave', 'Toronto', 'ON', 'M5G 1T1', '416-555-4567', 'info@cleartax.com', 'https://cleartax.example.com', 
 (SELECT id FROM categories WHERE slug = 'financial-services'), 
 (SELECT id FROM category_subcategories WHERE name = 'Accounting' AND category_id = (SELECT id FROM categories WHERE slug = 'financial-services')), 
 3, 4.8, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Legal Eagles Law Firm', 'Experienced attorneys specializing in family, business, and real estate law.', '444 Richards St', 'Vancouver', 'BC', 'V6B 2Z3', '604-555-8901', 'info@legaleagles.com', 'https://legaleagles.example.com', 
 (SELECT id FROM categories WHERE slug = 'legal-services'), 
 (SELECT id FROM category_subcategories WHERE name = 'Law Firm' AND category_id = (SELECT id FROM categories WHERE slug = 'legal-services')), 
 4, 4.9, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Prime Properties Real Estate', 'Full-service real estate agency for buying, selling, and renting properties.', '555 Bloor St', 'Toronto', 'ON', 'M4W 1A5', '416-555-2345', 'info@primeproperties.com', 'https://primeproperties.example.com', 
 (SELECT id FROM categories WHERE slug = 'real-estate'), 
 (SELECT id FROM category_subcategories WHERE name = 'Real Estate Agency' AND category_id = (SELECT id FROM categories WHERE slug = 'real-estate')), 
 3, 4.7, '/placeholder.svg', true, NOW(), NOW()),

-- Beauty & Spa (Replacing with Spas & Salons)
(uuid_generate_v4(), 'Glamour Hair Salon', 'Trendy hair salon offering cutting, styling, coloring, and treatments.', '666 Queen St W', 'Toronto', 'ON', 'M6J 1E3', '416-555-6789', 'appointments@glamourhair.com', 'https://glamourhair.example.com', 
 (SELECT id FROM categories WHERE slug = 'spas-salons'), 
 (SELECT id FROM category_subcategories WHERE name = 'Hair Salons' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons')), 
 3, 4.8, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Polished Nail Bar', 'Upscale nail salon offering manicures, pedicures, and nail art.', '777 Davie St', 'Vancouver', 'BC', 'V6Z 1B7', '604-555-0123', 'info@polishednailbar.com', 'https://polishednailbar.example.com', 
 (SELECT id FROM categories WHERE slug = 'spas-salons'), 
 (SELECT id FROM category_subcategories WHERE name = 'Nail Salons' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons')), 
 2, 4.6, '/placeholder.svg', true, NOW(), NOW()),

-- Education (Replacing with Tutoring & Education)
(uuid_generate_v4(), 'Bright Minds Tutoring', 'Personalized tutoring services for students of all ages and subjects.', '888 College St', 'Toronto', 'ON', 'M6H 1A3', '416-555-4567', 'info@brightminds.com', 'https://brightminds.example.com', 
 (SELECT id FROM categories WHERE slug = 'tutoring-education'), 
 (SELECT id FROM category_subcategories WHERE name = 'Tutoring' AND category_id = (SELECT id FROM categories WHERE slug = 'tutoring-education')), 
 3, 4.9, '/placeholder.svg', true, NOW(), NOW()),

(uuid_generate_v4(), 'Little Explorers Daycare', 'Nurturing childcare center with educational activities for children ages 0-5.', '999 Cambie St', 'Vancouver', 'BC', 'V6B 5Y5', '604-555-8901', 'info@littleexplorers.com', 'https://littleexplorers.example.com', 
 (SELECT id FROM categories WHERE slug = 'childcare'), 
 (SELECT id FROM category_subcategories WHERE name = 'Daycare' AND category_id = (SELECT id FROM categories WHERE slug = 'childcare')), 
 3, 4.7, '/placeholder.svg', true, NOW(), NOW());

-- Store business IDs for reference
DO $$
DECLARE
    sweet_delights_id UUID;
    pasta_paradise_id UUID;
    sushi_sensation_id UUID;
    morning_brew_id UUID;
    pacific_fitness_id UUID;
    zen_yoga_id UUID;
    tranquil_spa_id UUID;
    quick_fix_id UUID;
    green_thumb_id UUID;
    spotless_cleaning_id UUID;
    tech_wizards_id UUID;
    digital_solutions_id UUID;
    precision_auto_id UUID;
    shine_car_wash_id UUID;
    clear_tax_id UUID;
    legal_eagles_id UUID;
    prime_properties_id UUID;
    glamour_hair_id UUID;
    polished_nail_id UUID;
    bright_minds_id UUID;
    little_explorers_id UUID;
BEGIN
    -- Get business IDs
    SELECT id INTO sweet_delights_id FROM businesses WHERE name = 'Sweet Delights Bakery' LIMIT 1;
    SELECT id INTO pasta_paradise_id FROM businesses WHERE name = 'Pasta Paradise' LIMIT 1;
    SELECT id INTO sushi_sensation_id FROM businesses WHERE name = 'Sushi Sensation' LIMIT 1;
    SELECT id INTO morning_brew_id FROM businesses WHERE name = 'Morning Brew Café' LIMIT 1;
    SELECT id INTO pacific_fitness_id FROM businesses WHERE name = 'Pacific Fitness' LIMIT 1;
    SELECT id INTO zen_yoga_id FROM businesses WHERE name = 'Zen Yoga Studio' LIMIT 1;
    SELECT id INTO tranquil_spa_id FROM businesses WHERE name = 'Tranquil Spa' LIMIT 1;
    SELECT id INTO quick_fix_id FROM businesses WHERE name = 'Quick Fix Plumbing' LIMIT 1;
    SELECT id INTO green_thumb_id FROM businesses WHERE name = 'Green Thumb Landscaping' LIMIT 1;
    SELECT id INTO spotless_cleaning_id FROM businesses WHERE name = 'Spotless Cleaning' LIMIT 1;
    SELECT id INTO tech_wizards_id FROM businesses WHERE name = 'Tech Wizards' LIMIT 1;
    SELECT id INTO digital_solutions_id FROM businesses WHERE name = 'Digital Solutions' LIMIT 1;
    SELECT id INTO precision_auto_id FROM businesses WHERE name = 'Precision Auto Repair' LIMIT 1;
    SELECT id INTO shine_car_wash_id FROM businesses WHERE name = 'Shine Car Wash & Detailing' LIMIT 1;
    SELECT id INTO clear_tax_id FROM businesses WHERE name = 'Clear Tax Accounting' LIMIT 1;
    SELECT id INTO legal_eagles_id FROM businesses WHERE name = 'Legal Eagles Law Firm' LIMIT 1;
    SELECT id INTO prime_properties_id FROM businesses WHERE name = 'Prime Properties Real Estate' LIMIT 1;
    SELECT id INTO glamour_hair_id FROM businesses WHERE name = 'Glamour Hair Salon' LIMIT 1;
    SELECT id INTO polished_nail_id FROM businesses WHERE name = 'Polished Nail Bar' LIMIT 1;
    SELECT id INTO bright_minds_id FROM businesses WHERE name = 'Bright Minds Tutoring' LIMIT 1;
    SELECT id INTO little_explorers_id FROM businesses WHERE name = 'Little Explorers Daycare' LIMIT 1;

    -- Insert business attributes for restaurants
    INSERT INTO business_attributes (id, business_id, attribute_id, value) VALUES
    -- Sweet Delights Bakery (Cafes & Bakeries category)
    (uuid_generate_v4(), sweet_delights_id, 
     (SELECT id FROM category_attributes WHERE name = 'Service Types' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '["Coffee", "Pastries", "Cakes"]'),
    (uuid_generate_v4(), sweet_delights_id, 
     (SELECT id FROM category_attributes WHERE name = 'Price Range' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '$$'),
    (uuid_generate_v4(), sweet_delights_id, 
     (SELECT id FROM category_attributes WHERE name = 'Seating Options' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '["Indoor", "Outdoor"]'),
    (uuid_generate_v4(), sweet_delights_id, 
     (SELECT id FROM category_attributes WHERE name = 'Wifi Available' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     'true'),

    -- Pasta Paradise (Restaurants category)
    (uuid_generate_v4(), pasta_paradise_id, 
     (SELECT id FROM category_attributes WHERE name = 'Cuisine Type' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'Italian'),
    (uuid_generate_v4(), pasta_paradise_id, 
     (SELECT id FROM category_attributes WHERE name = 'Price Range' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     '$$$'),
    (uuid_generate_v4(), pasta_paradise_id, 
     (SELECT id FROM category_attributes WHERE name = 'Dining Options' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     '["Dine-in", "Takeout", "Delivery"]'),
    (uuid_generate_v4(), pasta_paradise_id, 
     (SELECT id FROM category_attributes WHERE name = 'Reservations Accepted' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'true'),
    (uuid_generate_v4(), pasta_paradise_id, 
     (SELECT id FROM category_attributes WHERE name = 'Alcohol Served' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'Full Bar'),

    -- Sushi Sensation (Restaurants category)
    (uuid_generate_v4(), sushi_sensation_id, 
     (SELECT id FROM category_attributes WHERE name = 'Cuisine Type' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'Japanese'),
    (uuid_generate_v4(), sushi_sensation_id, 
     (SELECT id FROM category_attributes WHERE name = 'Price Range' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     '$$$$'),
    (uuid_generate_v4(), sushi_sensation_id, 
     (SELECT id FROM category_attributes WHERE name = 'Dining Options' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     '["Dine-in", "Takeout"]'),
    (uuid_generate_v4(), sushi_sensation_id, 
     (SELECT id FROM category_attributes WHERE name = 'Reservations Accepted' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'true'),
    (uuid_generate_v4(), sushi_sensation_id, 
     (SELECT id FROM category_attributes WHERE name = 'Alcohol Served' AND category_id = (SELECT id FROM categories WHERE slug = 'restaurants') LIMIT 1), 
     'Beer & Wine'),

    -- Morning Brew Café (Cafes & Bakeries category)
    (uuid_generate_v4(), morning_brew_id, 
     (SELECT id FROM category_attributes WHERE name = 'Service Types' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '["Coffee", "Tea", "Breakfast", "Pastries"]'),
    (uuid_generate_v4(), morning_brew_id, 
     (SELECT id FROM category_attributes WHERE name = 'Price Range' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '$$'),
    (uuid_generate_v4(), morning_brew_id, 
     (SELECT id FROM category_attributes WHERE name = 'Seating Options' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     '["Indoor", "Outdoor"]'),
    (uuid_generate_v4(), morning_brew_id, 
     (SELECT id FROM category_attributes WHERE name = 'Wifi Available' AND category_id = (SELECT id FROM categories WHERE slug = 'cafes-bakeries') LIMIT 1), 
     'true');

    -- Insert business attributes for fitness businesses
    INSERT INTO business_attributes (id, business_id, attribute_id, value) VALUES
    -- Pacific Fitness (Fitness category)
    (uuid_generate_v4(), pacific_fitness_id, 
     (SELECT id FROM category_attributes WHERE name = 'Facility Type' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     'Gym'),
    (uuid_generate_v4(), pacific_fitness_id, 
     (SELECT id FROM category_attributes WHERE name = 'Services' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     '["Group Classes", "Personal Training", "Nutrition Counseling"]'),
    (uuid_generate_v4(), pacific_fitness_id, 
     (SELECT id FROM category_attributes WHERE name = 'Amenities' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     '["Showers", "Lockers", "Sauna", "Parking"]'),
    (uuid_generate_v4(), pacific_fitness_id, 
     (SELECT id FROM category_attributes WHERE name = '24/7 Access' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     'true'),
    (uuid_generate_v4(), pacific_fitness_id, 
     (SELECT id FROM category_attributes WHERE name = 'Membership Required' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     'true'),

    -- Zen Yoga Studio (Fitness category)
    (uuid_generate_v4(), zen_yoga_id, 
     (SELECT id FROM category_attributes WHERE name = 'Facility Type' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     'Studio'),
    (uuid_generate_v4(), zen_yoga_id, 
     (SELECT id FROM category_attributes WHERE name = 'Services' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     '["Group Classes", "Private Sessions", "Meditation"]'),
    (uuid_generate_v4(), zen_yoga_id, 
     (SELECT id FROM category_attributes WHERE name = 'Amenities' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     '["Showers", "Lockers", "Equipment Rental", "Parking"]'),
    (uuid_generate_v4(), zen_yoga_id, 
     (SELECT id FROM category_attributes WHERE name = 'Membership Required' AND category_id = (SELECT id FROM categories WHERE slug = 'fitness') LIMIT 1), 
     'false');

    -- Insert business attributes for spa businesses
    INSERT INTO business_attributes (id, business_id, attribute_id, value) VALUES
    -- Tranquil Spa (Spas & Salons category)
    (uuid_generate_v4(), tranquil_spa_id, 
     (SELECT id FROM category_attributes WHERE name = 'Service Types' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     '["Massage", "Facials", "Body Treatments", "Waxing"]'),
    (uuid_generate_v4(), tranquil_spa_id, 
     (SELECT id FROM category_attributes WHERE name = 'Gender Focus' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'Unisex'),
    (uuid_generate_v4(), tranquil_spa_id, 
     (SELECT id FROM category_attributes WHERE name = 'Appointment Required' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'true'),
    (uuid_generate_v4(), tranquil_spa_id, 
     (SELECT id FROM category_attributes WHERE name = 'Walk-ins Welcome' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'false'),

    -- Glamour Hair Salon (Spas & Salons category)
    (uuid_generate_v4(), glamour_hair_id, 
     (SELECT id FROM category_attributes WHERE name = 'Service Types' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     '["Haircuts", "Hair Coloring", "Styling", "Treatments"]'),
    (uuid_generate_v4(), glamour_hair_id, 
     (SELECT id FROM category_attributes WHERE name = 'Gender Focus' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'Unisex'),
    (uuid_generate_v4(), glamour_hair_id, 
     (SELECT id FROM category_attributes WHERE name = 'Appointment Required' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'false'),
    (uuid_generate_v4(), glamour_hair_id, 
     (SELECT id FROM category_attributes WHERE name = 'Walk-ins Welcome' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'true'),

    -- Polished Nail Bar (Spas & Salons category)
    (uuid_generate_v4(), polished_nail_id, 
     (SELECT id FROM category_attributes WHERE name = 'Service Types' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     '["Manicure", "Pedicure", "Nail Art", "Waxing"]'),
    (uuid_generate_v4(), polished_nail_id, 
     (SELECT id FROM category_attributes WHERE name = 'Gender Focus' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'Unisex'),
    (uuid_generate_v4(), polished_nail_id, 
     (SELECT id FROM category_attributes WHERE name = 'Walk-ins Welcome' AND category_id = (SELECT id FROM categories WHERE slug = 'spas-salons') LIMIT 1), 
     'true');

    -- Insert business attributes for real estate
    INSERT INTO business_attributes (id, business_id, attribute_id, value) VALUES
    -- Prime Properties Real Estate (Real Estate category)
    (uuid_generate_v4(), prime_properties_id, 
     (SELECT id FROM category_attributes WHERE name = 'Property Types' AND category_id = (SELECT id FROM categories WHERE slug = 'real-estate') LIMIT 1), 
     '["Residential", "Commercial", "Land"]'),
    (uuid_generate_v4(), prime_properties_id, 
     (SELECT id FROM category_attributes WHERE name = 'Services' AND category_id = (SELECT id FROM categories WHERE slug = 'real-estate') LIMIT 1), 
     '["Buying", "Selling", "Renting", "Property Management"]'),
    (uuid_generate_v4(), prime_properties_id, 
     (SELECT id FROM category_attributes WHERE name = 'Areas Served' AND category_id = (SELECT id FROM categories WHERE slug = 'real-estate') LIMIT 1), 
     'Greater Toronto Area');

    -- Insert business attributes for pet care
    INSERT INTO business_attributes (id, business_id, attribute_id, value) VALUES
    -- Pet services would go here if we had pet businesses in the sample data
    -- Example for future pet businesses:
    -- (uuid_generate_v4(), pet_business_id, 
    --  (SELECT id FROM category_attributes WHERE name = 'Animals Served' AND category_id = (SELECT id FROM categories WHERE slug = 'pet-care') LIMIT 1), 
    --  '["Dogs", "Cats", "Small Mammals"]'),
    -- (uuid_generate_v4(), pet_business_id, 
    --  (SELECT id FROM category_attributes WHERE name = 'Services' AND category_id = (SELECT id FROM categories WHERE slug = 'pet-care') LIMIT 1), 
    --  '["Grooming", "Boarding", "Training"]');

END $$; 