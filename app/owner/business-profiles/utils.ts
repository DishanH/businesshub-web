"use server"

import { createClient } from "@/utils/supabase/server"

/**
 * Verify that the current user owns the specified business
 * 
 * @param businessId - Business ID to check
 * @returns Object with success status, business data if successful, and error details if not
 */
export async function verifyBusinessOwnership(businessId: string) {
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

    // Get the business and check ownership
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (error) {
      console.error("Error fetching business:", error);
      return {
        success: false,
        error: `Failed to fetch business: ${error.message}`
      };
    }

    if (data.user_id !== user.id) {
      return {
        success: false,
        error: "You don't have permission to access this business"
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in verifyBusinessOwnership:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
} 