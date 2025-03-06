"use server"

import { createClient, createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"
import { revalidatePath } from "next/cache"

// Define types for the returned data
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

// Function to fetch active categories without caching
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

// Public function to get active categories
export async function getActiveCategories() {
  return getCachedActiveCategories()
}

/**
 * Fetch all categories with caching
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

/**
 * Fetch a single category by slug with caching
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

/**
 * Revalidate category caches
 */
export async function revalidateCategories() {
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/admin/categories")
} 