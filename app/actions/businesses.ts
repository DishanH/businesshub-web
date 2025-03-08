"use server"

import { createClient, createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"
import { revalidatePath } from "next/cache"

//=============================================================================
// TYPE DEFINITIONS
//=============================================================================

/**
 * Business attribute type definition
 */
export type BusinessAttribute = {
  id: string
  business_id: string
  attribute_id: string
  value: string | number | boolean | string[]
}

/**
 * Business type definition
 */
export type Business = {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website?: string
  category_id: string
  subcategory_id?: string
  price_range: number
  rating: number
  image?: string
  is_active: boolean
  deactivated_by_user: boolean
  user_id: string
  additional_info?: string
  created_at: string
  updated_at: string
  attributes?: BusinessAttribute[]
}

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
      console.error(`Error fetching featured businesses:`, error)
      return { success: false, error: error.message, data: [] }
    }
    
    // Transform the data to include attributes as a nested property
    const transformedData = data.map(business => {
      const { business_attributes, ...rest } = business
      return {
        ...rest,
        attributes: business_attributes || []
      }
    })
    
    return { success: true, data: transformedData as Business[] }
  } catch (error) {
    console.error(`Unexpected error fetching featured businesses:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: []
    }
  }
}

// Cache the fetch function
const getCachedFeaturedBusinesses = unstable_cache(
  fetchFeaturedBusinesses,
  ["featured-businesses"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Get featured businesses with caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
export async function getFeaturedBusinesses(limit: number = 4, locationId?: string) {
  return getCachedFeaturedBusinesses(limit, locationId)
}

//=============================================================================
// BUSINESSES BY CATEGORY
//=============================================================================

/**
 * Fetch businesses by category with caching
 * 
 * @param categoryId - Category ID to filter by
 * @returns Object with success status and data or error details
 */
export const getBusinessesByCategory = unstable_cache(
  async (categoryId: string) => {
    try {
      const supabase = await createClient()
      
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
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error(`Error fetching businesses for category ${categoryId}:`, error)
        return { success: false, error: error.message, data: [] }
      }
      
      // Transform the data to include attributes as a nested property
      const transformedData = data.map(business => {
        const { business_attributes, ...rest } = business
        return {
          ...rest,
          attributes: business_attributes || []
        }
      })
      
      return { success: true, data: transformedData as Business[] }
    } catch (error) {
      console.error(`Unexpected error fetching businesses for category ${categoryId}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["businesses-by-category"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

//=============================================================================
// BUSINESSES BY LOCATION
//=============================================================================

/**
 * Fetch businesses by location with caching
 * 
 * @param location - Location string to filter by
 * @returns Object with success status and data or error details
 */
export const getBusinessesByLocation = unstable_cache(
  async (location: string) => {
    try {
      const supabase = await createClient()
      
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
        .or(`city.ilike.%${location}%,state.ilike.%${location}%,zip.ilike.%${location}%`)
        .eq('is_active', true)
        .order('name')
      
      if (error) {
        console.error(`Error fetching businesses for location ${location}:`, error)
        return { success: false, error: error.message, data: [] }
      }
      
      // Transform the data to include attributes as a nested property
      const transformedData = data.map(business => {
        const { business_attributes, ...rest } = business
        return {
          ...rest,
          attributes: business_attributes || []
        }
      })
      
      return { success: true, data: transformedData as Business[] }
    } catch (error) {
      console.error(`Unexpected error fetching businesses for location ${location}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["businesses-by-location"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

//=============================================================================
// CACHE REVALIDATION
//=============================================================================

/**
 * Revalidate all business-related cache entries
 */
export async function revalidateBusinesses() {
  revalidatePath("/businesses")
  revalidatePath("/businesses/manage")
}

//=============================================================================
// NEWLY ADDED BUSINESSES
//=============================================================================

/**
 * Fetch newly added businesses without caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
async function fetchNewlyAddedBusinesses(limit: number = 8, locationId?: string) {
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
      console.error(`Error fetching newly added businesses:`, error)
      return { success: false, error: error.message, data: [] }
    }
    
    // Transform the data to include attributes as a nested property
    const transformedData = data.map(business => {
      const { business_attributes, ...rest } = business
      return {
        ...rest,
        attributes: business_attributes || []
      }
    })
    
    return { success: true, data: transformedData as Business[] }
  } catch (error) {
    console.error(`Unexpected error fetching newly added businesses:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: []
    }
  }
}

// Cache the fetch function
const getCachedNewlyAddedBusinesses = unstable_cache(
  fetchNewlyAddedBusinesses,
  ["newly-added-businesses"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Get newly added businesses with caching
 * 
 * @param limit - Maximum number of businesses to return
 * @param locationId - Optional location filter
 * @returns Object with success status and data or error details
 */
export async function getNewlyAddedBusinesses(limit: number = 8, locationId?: string) {
  return getCachedNewlyAddedBusinesses(limit, locationId)
}

//=============================================================================
// USER BUSINESSES
//=============================================================================

/**
 * Get all businesses for the current user
 * 
 * @returns Object with success status and data or error details
 */
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

//=============================================================================
// BUSINESS DETAILS
//=============================================================================

/**
 * Get a single business by ID
 * 
 * @param businessId - Business ID to fetch
 * @returns Object with success status and data or error details
 */
export async function getBusinessById(businessId: string) {
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
      .eq("id", businessId)
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

//=============================================================================
// BUSINESS MANAGEMENT
//=============================================================================

/**
 * Delete a business
 * 
 * @param businessId - Business ID to delete
 * @returns Object with success status and data or error details
 */
export async function deleteBusiness(businessId: string) {
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
    
    // Check if the business belongs to the current user
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError) {
      console.error("Error fetching business:", businessError);
      return { 
        success: false, 
        error: `Failed to fetch business: ${businessError.message}` 
      };
    }
    
    if (business.user_id !== user.id) {
      return { 
        success: false, 
        error: "You do not have permission to delete this business" 
      };
    }
    
    // Delete related records first
    
    // Delete business hours
    const { error: hoursError } = await supabase
      .from("business_hours")
      .delete()
      .eq("business_id", businessId);
    
    if (hoursError) {
      console.error("Error deleting business hours:", hoursError);
      return { 
        success: false, 
        error: `Failed to delete business hours: ${hoursError.message}` 
      };
    }
    
    // Delete social media links
    const { error: socialError } = await supabase
      .from("business_social_media")
      .delete()
      .eq("business_id", businessId);
    
    if (socialError) {
      console.error("Error deleting social media links:", socialError);
      return { 
        success: false, 
        error: `Failed to delete social media links: ${socialError.message}` 
      };
    }
    
    // Delete business attributes
    const { error: attributesError } = await supabase
      .from("business_attributes")
      .delete()
      .eq("business_id", businessId);
    
    if (attributesError) {
      console.error("Error deleting business attributes:", attributesError);
      return { 
        success: false, 
        error: `Failed to delete business attributes: ${attributesError.message}` 
      };
    }
    
    // Delete business images
    const { error: imagesError } = await supabase
      .from("business_images")
      .delete()
      .eq("business_id", businessId);
    
    if (imagesError) {
      console.error("Error deleting business images:", imagesError);
      return { 
        success: false, 
        error: `Failed to delete business images: ${imagesError.message}` 
      };
    }
    
    // Finally, delete the business
    const { error: deleteError } = await supabase
      .from("businesses")
      .delete()
      .eq("id", businessId);
    
    if (deleteError) {
      console.error("Error deleting business:", deleteError);
      return { 
        success: false, 
        error: `Failed to delete business: ${deleteError.message}` 
      };
    }
    
    // Revalidate the businesses page
    revalidatePath("/businesses");
    revalidatePath("/businesses/manage");
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error("Error in deleteBusiness:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred" 
    };
  }
}

/**
 * Update business active status
 * 
 * @param businessId - Business ID to update
 * @param isActive - New active status
 * @returns Object with success status and data or error details
 */
export async function updateBusinessStatus(businessId: string, isActive: boolean) {
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
    
    // Check if the business belongs to the current user
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError) {
      console.error("Error fetching business:", businessError);
      return { 
        success: false, 
        error: `Failed to fetch business: ${businessError.message}` 
      };
    }
    
    if (business.user_id !== user.id) {
      return { 
        success: false, 
        error: "You do not have permission to update this business" 
      };
    }
    
    // Update the business status
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ 
        is_active: isActive,
        deactivated_by_user: !isActive // If deactivating, set deactivated_by_user to true
      })
      .eq("id", businessId);
    
    if (updateError) {
      console.error("Error updating business status:", updateError);
      return { 
        success: false, 
        error: `Failed to update business status: ${updateError.message}` 
      };
    }
    
    // Revalidate the businesses page
    revalidatePath("/businesses");
    revalidatePath("/businesses/manage");
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error("Error in updateBusinessStatus:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred" 
    };
  }
} 