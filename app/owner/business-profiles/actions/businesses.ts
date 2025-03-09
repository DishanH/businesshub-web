"use server"

import { createClient, createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"
import { revalidatePath } from "next/cache"

//=============================================================================
// FEATURED BUSINESSES
//=============================================================================

/**
 * Fetch featured businesses without caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
export async function fetchFeaturedBusinesses(limit: number = 4, locationId?: string) {
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

// Placeholder exports for functions that will be implemented later
// These are needed for the core.ts file to compile
export async function getUserBusinesses() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: "Authentication required" 
      };
    }
    
    // Get businesses for the current user with related data
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        category:category_id(name),
        images:business_images(url, alt_text, is_primary)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching businesses:", error);
      return { 
        success: false, 
        error: `Failed to fetch businesses: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error("Error in getUserBusinesses:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred" 
    };
  }
}

export async function getBusinessById(id: string) {
  try {
    const supabase = await createClient();
    
    // Get the business with related data
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        category:category_id(id, name),
        subcategory:subcategory_id(id, name),
        images:business_images(id, url, alt_text, is_primary),
        hours:business_hours(id, day_of_week, open_time, close_time, is_closed),
        social:business_social_media(id, platform, url),
        attributes:business_attributes(id, attribute_id, value)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching business:", error);
      return { 
        success: false, 
        error: `Failed to fetch business: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error("Error in getBusinessById:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred" 
    };
  }
}

export async function deleteBusiness(id: string) {
  // Implementation will be added later
  return { success: false, error: "Not implemented yet" }
}

export async function updateBusinessStatus(id: string, isActive: boolean) {
  // Implementation will be added later
  return { success: false, error: "Not implemented yet" }
}

export async function getBusinessesByCategory(categoryId: string) {
  // Implementation will be added later
  return { success: false, error: "Not implemented yet" }
}

export async function getBusinessesByLocation(locationId: string) {
  // Implementation will be added later
  return { success: false, error: "Not implemented yet" }
}

export async function getNewlyAddedBusinesses() {
  // Implementation will be added later
  return { success: false, error: "Not implemented yet" }
}

export async function revalidateBusinesses() {
  // Implementation will be added later
  revalidatePath('/businesses')
  return { success: true }
}

/**
 * Search businesses by query
 * 
 * @param query - Search query
 * @returns Object with success status and data or error details
 */
export async function searchBusinesses(query: string) {
  try {
    const supabase = createClientWithoutCookies()
    
    // Search businesses by name, description, or address
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
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`)
      .order('rating', { ascending: false })
    
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