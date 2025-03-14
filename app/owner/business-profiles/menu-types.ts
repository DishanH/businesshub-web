// Types for business menu sections

export interface BusinessMenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string | null;
  price_numeric: number | null;
  is_featured: boolean;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessMenuCategory {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  items?: BusinessMenuItem[];
}

export interface BusinessMenuSection {
  id: string;
  business_id: string;
  title: string;
  icon: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  categories?: BusinessMenuCategory[];
}

// Types for the menu data structure
export interface BusinessMenuData {
  section: BusinessMenuSection;
  categories: BusinessMenuCategory[];
}

// Form types for creating/updating menu items
export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  is_featured: boolean;
  image_url?: string;
}

export interface MenuCategoryFormData {
  name: string;
  description?: string;
}

export interface MenuSectionFormData {
  title: string;
  icon: string;
  is_visible: boolean;
} 