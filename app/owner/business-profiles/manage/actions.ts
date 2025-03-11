"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Get businesses for the current user
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
      .eq("owner_id", user.id)
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

/**
 * Delete a business
 * 
 * @param id - Business ID to delete
 * @returns Object with success status and error details if applicable
 */
export async function deleteBusiness(id: string) {
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
    
    // Verify ownership before deletion
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching business:", fetchError);
      return { 
        success: false, 
        error: `Failed to fetch business: ${fetchError.message}` 
      };
    }
    
    if (business.user_id !== user.id) {
      return { 
        success: false, 
        error: "You don't have permission to delete this business" 
      };
    }
    
    // Delete the business
    const { error: deleteError } = await supabase
      .from("businesses")
      .delete()
      .eq("id", id);
    
    if (deleteError) {
      console.error("Error deleting business:", deleteError);
      return { 
        success: false, 
        error: `Failed to delete business: ${deleteError.message}` 
      };
    }
    
    // Revalidate paths that display businesses
    revalidatePath('/owner/business-profiles/manage');
    revalidatePath('/owner/dashboard');
    
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
 * @param id - Business ID to update
 * @param isActive - New active status (opposite of deactivated_by_user)
 * @returns Object with success status and error details if applicable
 */
export async function updateBusinessStatus(id: string, isActive: boolean) {
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
    
    // Verify ownership before update
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("user_id, deactivated_by_user")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching business:", fetchError);
      return { 
        success: false, 
        error: `Failed to fetch business: ${fetchError.message}` 
      };
    }
    
    if (business.user_id !== user.id) {
      return { 
        success: false, 
        error: "You don't have permission to update this business" 
      };
    }
    console.log(isActive);
    // Update the business deactivated_by_user status
    // Note: is_active will be updated by admin after review
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ deactivated_by_user: isActive })
      .eq("id", id);
    
    if (updateError) {
      console.error("Error updating business status:", updateError);
      return { 
        success: false, 
        error: `Failed to update business status: ${updateError.message}` 
      };
    }
    
    // Revalidate paths that display businesses
    revalidatePath('/owner/business-profiles/manage');
    revalidatePath('/owner/dashboard');
    revalidatePath(`/business-profiles/${id}`);
    
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