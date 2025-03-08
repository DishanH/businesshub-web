// Define types for category data
export type Subcategory = {
  id: string
  name: string
  description?: string
  active: boolean
}

export type Attribute = {
  id: string
  name: string
  type: string
  options?: string[]
  required: boolean
  description?: string
}

export type Category = {
  id: string
  name: string
  description: string
  slug: string
  icon?: string
  active: boolean
  created_at: string
  updated_at: string
  subcategories: Subcategory[]
  attributes: Attribute[]
}

// Client-side types
export type ClientAttribute = {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "select" | "multiselect";
  options?: string[];
  required: boolean;
  description?: string;
};

export type ClientCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  subcategories: Subcategory[];
  attributes: ClientAttribute[];
}; 