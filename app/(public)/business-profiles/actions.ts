"use server"

import { createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"

/**
 * Fetch featured businesses without caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
async function fetchFeaturedBusinesses(limit: number = 4, locationId?: string) {
  try {
    // Use the client without cookies for this function
    const supabase = createClientWithoutCookies()
    
    let query = supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        phone, 
        email, 
        website, 
        category_id, 
        subcategory_id, 
        price_range, 
        rating, 
        image, 
        is_active, 
        deactivated_by_user, 
        user_id, 
        created_at, 
        updated_at,
        business_attributes(*)
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })
    
    // Apply location filter if provided
    if (locationId) {
      // Convert locationId to city name (in a real app, you might have a mapping table)
      const cityName = locationId.charAt(0).toUpperCase() + locationId.slice(1).replace(/-/g, ' ')
      query = query.ilike('city', `%${cityName}%`)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) {
      console.error("Error fetching featured businesses:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching featured businesses:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

// Export cached version of the function
export const getFeaturedBusinesses = unstable_cache(
  fetchFeaturedBusinesses,
  ["featured-businesses"],
  { revalidate: 3600 } // Cache for 1 hour
)

/**
 * Fetch newly added businesses without caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
async function fetchNewlyAddedBusinesses(limit: number = 4, locationId?: string) {
  try {
    // Use the client without cookies for this function
    const supabase = createClientWithoutCookies()
    
    let query = supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        phone, 
        email, 
        website, 
        category_id, 
        subcategory_id, 
        price_range, 
        rating, 
        image, 
        is_active, 
        deactivated_by_user, 
        user_id, 
        created_at, 
        updated_at,
        business_attributes(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    // Apply location filter if provided
    if (locationId) {
      // Convert locationId to city name (in a real app, you might have a mapping table)
      const cityName = locationId.charAt(0).toUpperCase() + locationId.slice(1).replace(/-/g, ' ')
      query = query.ilike('city', `%${cityName}%`)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) {
      console.error("Error fetching newly added businesses:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching newly added businesses:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

// Export cached version of the function
export const getNewlyAddedBusinesses = unstable_cache(
  fetchNewlyAddedBusinesses,
  ["newly-added-businesses"],
  { revalidate: 3600 } // Cache for 1 hour
)

/**
 * Search businesses by query
 * 
 * @param query - Search query
 * @param location - Location to filter businesses by (city name)
 * @returns Object with success status and data or error details
 */
export async function searchBusinesses(query: string, location?: string) {
  try {
    const supabase = createClientWithoutCookies()
    
    // Create the base query
    let dbQuery = supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        rating, 
        image, 
        category_id, 
        subcategory_id
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`)
    
    // Apply location filter if provided
    if (location && location !== 'nearby') {
      // Convert location string to city name format
      const cityName = location.charAt(0).toUpperCase() + location.slice(1).toLowerCase()
      dbQuery = dbQuery.ilike('city', `%${cityName}%`)
    }
    
    // Execute the query
    const { data, error } = await dbQuery
      .order('rating', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error("Error searching businesses:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error searching businesses:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

/**
 * Get businesses by category
 * 
 * @param categoryId - Category ID to filter by
 * @returns Object with success status and data or error details
 */
export async function getBusinessesByCategory(categoryId: string) {
  try {
    const supabase = createClientWithoutCookies()
    
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        rating, 
        image
      `)
      .eq('is_active', true)
      .eq('category_id', categoryId)
      .order('rating', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error("Error fetching businesses by category:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching businesses by category:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

/**
 * Get businesses by location
 * 
 * @param locationId - Location ID to filter by
 * @returns Object with success status and data or error details
 */
export async function getBusinessesByLocation(locationId: string) {
  try {
    const supabase = createClientWithoutCookies()
    
    // Convert locationId to city name (in a real app, you might have a mapping table)
    const cityName = locationId.charAt(0).toUpperCase() + locationId.slice(1).replace(/-/g, ' ')
    
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        rating, 
        image
      `)
      .eq('is_active', true)
      .ilike('city', `%${cityName}%`)
      .order('rating', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error("Error fetching businesses by location:", error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching businesses by location:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
} 