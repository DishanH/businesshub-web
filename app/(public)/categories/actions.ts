"use server"

import { createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"

// Define the Category type
export type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: {
    id: string;
    name: string;
    description: string;
    active: boolean;
  }[];
  attributes?: {
    id: string;
    name: string;
    type: string;
    options?: string[];
    required: boolean;
    description?: string;
  }[];
};

/**
 * Fetch active categories without caching
 * 
 * Retrieves all active categories with their subcategories and attributes
 * 
 * @returns Object with success status and data or error details
 */
async function fetchActiveCategories() {
  try {
    // Use the client without cookies for this function
    const supabase = createClientWithoutCookies()
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id, 
        name, 
        description, 
        slug, 
        icon, 
        active, 
        created_at, 
        updated_at,
        subcategories:category_subcategories(id, name, description, active),
        attributes:category_attributes(
          id, 
          name, 
          type, 
          options, 
          required, 
          description
        )
      `)
      .eq("active", true)
      .order("name")
    
    if (error) {
      console.error("Error fetching active categories:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching active categories:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

// Cache the fetch function
export const getActiveCategories = unstable_cache(
  fetchActiveCategories,
  ["active-categories"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Get all categories (active and inactive)
 * 
 * @returns Object with success status and data or error details
 */
export async function getAllCategories() {
  try {
    const supabase = createClientWithoutCookies()
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id, 
        name, 
        description, 
        slug, 
        icon, 
        active, 
        created_at, 
        updated_at,
        subcategories:category_subcategories(id, name, description, active),
        attributes:category_attributes(
          id, 
          name, 
          type, 
          options, 
          required, 
          description
        )
      `)
      .order("name")
    
    if (error) {
      console.error("Error fetching all categories:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching all categories:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

/**
 * Get a single category by ID
 * 
 * @param id - Category ID to fetch
 * @returns Object with success status and data or error details
 */
export async function getCategoryById(id: string) {
  try {
    const supabase = createClientWithoutCookies()
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id, 
        name, 
        description, 
        slug, 
        icon, 
        active, 
        created_at, 
        updated_at,
        subcategories:category_subcategories(id, name, description, active),
        attributes:category_attributes(
          id, 
          name, 
          type, 
          options, 
          required, 
          description
        )
      `)
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching category:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
} 