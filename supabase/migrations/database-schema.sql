-- Database Schema for BusinessHub
-- This script creates the necessary tables for businesses and related data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category Subcategories Table
CREATE TABLE IF NOT EXISTS category_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category Attributes Table
CREATE TABLE IF NOT EXISTS category_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    options TEXT[],
    required BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES category_subcategories(id) ON DELETE SET NULL,
    price_range INTEGER NOT NULL CHECK (price_range BETWEEN 1 AND 4),
    rating NUMERIC(3,1) DEFAULT 0.0 CHECK (rating BETWEEN 0.0 AND 5.0),
    image VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Attributes Table
CREATE TABLE IF NOT EXISTS business_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES category_attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Reviews Table
CREATE TABLE IF NOT EXISTS business_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Likes Table
CREATE TABLE IF NOT EXISTS business_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- Business Images Table
CREATE TABLE IF NOT EXISTS business_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_subcategory_id ON businesses(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_state ON businesses(state);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(active);
CREATE INDEX IF NOT EXISTS idx_category_subcategories_category_id ON category_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_category_attributes_category_id ON category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_business_attributes_business_id ON business_attributes(business_id);
CREATE INDEX IF NOT EXISTS idx_business_attributes_attribute_id ON business_attributes(attribute_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_business_id ON business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_likes_business_id ON business_likes(business_id);
CREATE INDEX IF NOT EXISTS idx_business_likes_user_id ON business_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_subcategories_updated_at
BEFORE UPDATE ON category_subcategories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_attributes_updated_at
BEFORE UPDATE ON category_attributes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_attributes_updated_at
BEFORE UPDATE ON business_attributes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_reviews_updated_at
BEFORE UPDATE ON business_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_images_updated_at
BEFORE UPDATE ON business_images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 