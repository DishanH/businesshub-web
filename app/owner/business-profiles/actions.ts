"use server"

import { createClient } from "@/utils/supabase/server"

/**
 * Get a single business by ID
 * 
 * @param id - Business ID to fetch
 * @returns Object with success status and data or error details
 */
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