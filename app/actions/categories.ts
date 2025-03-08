"use server"

import { createClient, createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"
import { revalidatePath } from "next/cache"
import type { Category } from "@/app/types/categories"

//=============================================================================
// ACTIVE CATEGORIES
//=============================================================================

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
      .eq('active', true)
      .order('name')
    
    if (error) {
      console.error("Error fetching active categories:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data as Category[] }
  } catch (error) {
    console.error("Unexpected error fetching active categories:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: []
    }
  }
}

// Cache the fetch function
const getCachedActiveCategories = unstable_cache(
  fetchActiveCategories,
  ["active-categories"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Get active categories with caching
 * 
 * Public function that returns cached active categories
 * Used in the business creation form and category filters
 * 
 * @returns Object with success status and data or error details
 */
export async function getActiveCategories() {
  return getCachedActiveCategories()
}

//=============================================================================
// ALL CATEGORIES
//=============================================================================

/**
 * Fetch all categories with caching
 * 
 * Retrieves all categories (active and inactive) with their subcategories and attributes
 * Used primarily in admin interfaces
 * 
 * @returns Object with success status and data or error details
 */
export const getCategories = unstable_cache(
  async () => {
    try {
      const supabase = await createClient()
      
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
        .order('name')
      
      if (error) {
        console.error("Error fetching categories:", error)
        return { success: false, error: error.message, data: [] }
      }
      
      return { success: true, data: data as Category[] }
    } catch (error) {
      console.error("Unexpected error fetching categories:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["all-categories"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

//=============================================================================
// CATEGORY BY SLUG
//=============================================================================

/**
 * Fetch a single category by slug with caching
 * 
 * Retrieves a specific category by its slug with subcategories and attributes
 * Used for category detail pages and filtering
 * 
 * @param slug - The URL-friendly slug of the category
 * @returns Object with success status and data or error details
 */
export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const supabase = await createClient()
      
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
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error(`Error fetching category by slug ${slug}:`, error)
        return { success: false, error: error.message }
      }
      
      return { success: true, data: data as Category }
    } catch (error) {
      console.error(`Unexpected error fetching category by slug ${slug}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }
    }
  },
  ["category-by-slug"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

//=============================================================================
// CACHE REVALIDATION
//=============================================================================

/**
 * Revalidate category caches
 * 
 * Call this function after updating categories to refresh the cache
 * This ensures that users see the most up-to-date category information
 */
export async function revalidateCategories() {
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/admin/categories")
} 