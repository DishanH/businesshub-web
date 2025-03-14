"use server"

import { createClient } from "@/utils/supabase/server"
import { BusinessMenuData } from "@/app/owner/business-profiles/menu-types"

/**
 * Get menu data for a business
 * 
 * @param businessId - Business ID to fetch menu for
 * @returns Object with success status and data or error details
 */
export async function getBusinessMenuDataForProfile(businessId: string): Promise<{ 
  success: boolean; 
  data?: BusinessMenuData; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // Get the menu section
    const { data: sectionData, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("*")
      .eq("business_id", businessId)
      .single()
    
    if (sectionError) {
      // If no section exists, return empty data
      if (sectionError.code === "PGRST116") {
        return {
          success: true,
          data: {
            section: {
              id: "",
              business_id: businessId,
              title: "Menu",
              icon: "Utensils",
              is_visible: true,
              display_order: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            categories: []
          }
        }
      }
      throw sectionError
    }
    
    // Get the menu categories with items
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("business_menu_categories")
      .select(`
        *,
        items:business_menu_items(*)
      `)
      .eq("section_id", sectionData.id)
      .order("display_order", { ascending: true })
    
    if (categoriesError) {
      throw categoriesError
    }
    
    return {
      success: true,
      data: {
        section: sectionData,
        categories: categoriesData || []
      }
    }
  } catch (error) {
    console.error("Error fetching business menu data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
} 