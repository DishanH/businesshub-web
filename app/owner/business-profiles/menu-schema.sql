-- Schema for Business Menu Sections

-- Table for business menu section preferences
CREATE TABLE business_menu_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Menu',
  icon VARCHAR(50) DEFAULT 'Utensils',
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for business menu categories
CREATE TABLE business_menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES business_menu_sections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for business menu items
CREATE TABLE business_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES business_menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(100),
  price_numeric DECIMAL(10, 2),
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_business_menu_sections_business_id ON business_menu_sections(business_id);
CREATE INDEX idx_business_menu_categories_section_id ON business_menu_categories(section_id);
CREATE INDEX idx_business_menu_items_category_id ON business_menu_items(category_id);
CREATE INDEX idx_business_menu_items_featured ON business_menu_items(is_featured);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_menu_sections_updated_at
BEFORE UPDATE ON business_menu_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_menu_categories_updated_at
BEFORE UPDATE ON business_menu_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_menu_items_updated_at
BEFORE UPDATE ON business_menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 