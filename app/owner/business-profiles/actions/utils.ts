"use server";

/**
 * Business Actions Utilities
 * 
 * This file contains utility functions for business-related actions.
 */

import { createClient } from "@/utils/supabase/server";

/**
 * Verify business ownership
 * 
 * Checks if the current user is the owner of the specified business.
 * 
 * @param businessId - The ID of the business to check
 * @returns Object with success status and data or error details
 */
export async function verifyBusinessOwnership(businessId: string) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: "Authentication required",
        isOwner: false
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
        error: `Failed to fetch business: ${businessError.message}`,
        isOwner: false
      };
    }
    
    const isOwner = business.user_id === user.id;
    
    return { 
      success: true,
      isOwner,
      userId: user.id,
      businessUserId: business.user_id
    };
  } catch (error) {
    console.error("Error in verifyBusinessOwnership:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred",
      isOwner: false
    };
  }
} 