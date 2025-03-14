-- SQL script to populate menu data for a business
-- Business ID: f1ce39c0-c883-415b-9119-e1070699eebf
-- Run this script directly in the Supabase SQL editor
-- Execute each step separately and update the IDs manually

-- Step 1: Delete any existing data for this business to avoid conflicts
DELETE FROM business_menu_items 
WHERE category_id IN (
  SELECT bmc.id 
  FROM business_menu_categories bmc
  JOIN business_menu_sections bms ON bmc.section_id = bms.id
  WHERE bms.business_id = 'f1ce39c0-c883-415b-9119-e1070699eebf'
);

DELETE FROM business_menu_categories 
WHERE section_id IN (
  SELECT id 
  FROM business_menu_sections 
  WHERE business_id = 'f1ce39c0-c883-415b-9119-e1070699eebf'
);

DELETE FROM business_menu_sections 
WHERE business_id = 'f1ce39c0-c883-415b-9119-e1070699eebf';

-- Step 2: Insert menu section
INSERT INTO business_menu_sections (business_id, title, icon, is_visible, display_order)
VALUES ('f1ce39c0-c883-415b-9119-e1070699eebf', 'Professional Services', 'Briefcase', true, 0);

-- Step 3: Get the section ID (run this query and note the ID)
SELECT id FROM business_menu_sections 
WHERE business_id = 'f1ce39c0-c883-415b-9119-e1070699eebf' AND title = 'Professional Services';

-- Step 4: Insert menu categories (replace SECTION_ID_HERE with the ID from Step 3)
-- These categories will appear as tabs in the UI
INSERT INTO business_menu_categories (section_id, name, description, display_order)
VALUES 
  ('SECTION_ID_HERE', 'Consultations', 'Initial and specialized consultation services', 0),
  ('SECTION_ID_HERE', 'Ongoing Services', 'Regular professional support options', 1),
  ('SECTION_ID_HERE', 'Specialized Offerings', 'Specialized professional services', 2);

-- Step 5: Get the category IDs (run this query and note the IDs)
SELECT id, name FROM business_menu_categories 
WHERE section_id = 'SECTION_ID_HERE';

-- Step 6: Insert menu items for Consultations category (replace CONSULTATIONS_ID_HERE with the appropriate ID from Step 5)
-- These items will appear in the "Consultations" tab
INSERT INTO business_menu_items (category_id, name, description, price, price_numeric, is_featured, display_order)
VALUES 
  ('CONSULTATIONS_ID_HERE', 'Initial Consultation', 'First-time client assessment and needs analysis', '$150', 150, true, 0),
  ('CONSULTATIONS_ID_HERE', 'Strategy Session', 'Focused problem-solving meeting with actionable outcomes', '$200/hour', 200, false, 1),
  ('CONSULTATIONS_ID_HERE', 'Project Evaluation', 'Comprehensive project review and recommendations', 'From $500', 500, false, 2);

-- Step 7: Insert menu items for Ongoing Services category (replace ONGOING_SERVICES_ID_HERE with the appropriate ID from Step 5)
-- These items will appear in the "Ongoing Services" tab
INSERT INTO business_menu_items (category_id, name, description, price, price_numeric, is_featured, display_order)
VALUES 
  ('ONGOING_SERVICES_ID_HERE', 'Monthly Retainer', 'Ongoing professional support with dedicated hours each month', 'From $1,000/month', 1000, true, 0),
  ('ONGOING_SERVICES_ID_HERE', 'Project-Based Work', 'Defined scope project completion with milestone deliverables', 'Custom quote', NULL, false, 1),
  ('ONGOING_SERVICES_ID_HERE', 'Hourly Services', 'As-needed professional assistance for specific tasks', '$175/hour', 175, false, 2);

-- Step 8: Insert menu items for Specialized Offerings category (replace SPECIALIZED_OFFERINGS_ID_HERE with the appropriate ID from Step 5)
-- These items will appear in the "Specialized Offerings" tab
INSERT INTO business_menu_items (category_id, name, description, price, price_numeric, is_featured, display_order)
VALUES 
  ('SPECIALIZED_OFFERINGS_ID_HERE', 'Training Workshop', 'Group training on specific topics with customized materials', 'From $750', 750, true, 0),
  ('SPECIALIZED_OFFERINGS_ID_HERE', 'Document Preparation', 'Professional document creation and review', 'From $350', 350, false, 1),
  ('SPECIALIZED_OFFERINGS_ID_HERE', 'Expert Testimony', 'Professional testimony services for legal proceedings', '$300/hour', 300, false, 2);

-- Step 9: Verify the data was inserted correctly
-- This will show how the menu data is structured with sections, categories (tabs), and items
SELECT 
  bms.title AS section_title,
  bmc.name AS category_name, -- These are the tabs in the UI
  bmi.name AS item_name,
  bmi.price,
  bmi.description
FROM business_menu_sections bms
JOIN business_menu_categories bmc ON bmc.section_id = bms.id
JOIN business_menu_items bmi ON bmi.category_id = bmc.id
WHERE bms.business_id = 'f1ce39c0-c883-415b-9119-e1070699eebf'
ORDER BY bmc.display_order, bmi.display_order; 