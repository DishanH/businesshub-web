"use server"

import { createClient } from "@/utils/supabase/server"
import { 
  BusinessMenuSection, 
  BusinessMenuCategory, 
  BusinessMenuItem, 
  BusinessMenuData,
  MenuSectionFormData,
  MenuCategoryFormData,
  MenuItemFormData
} from "./menu-types"

/**
 * Get menu data for a business
 * 
 * @param businessId - Business ID to fetch menu for
 * @returns Object with success status and data or error details
 */
export async function getBusinessMenuData(businessId: string): Promise<{ 
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
      // If no section exists, create a default one
      if (sectionError.code === "PGRST116") {
        const { data: newSection, error: createError } = await supabase
          .from("business_menu_sections")
          .insert({
            business_id: businessId,
            title: "Menu",
            icon: "Utensils",
            is_visible: true
          })
          .select("*")
          .single()
        
        if (createError) {
          throw createError
        }
        
        return {
          success: true,
          data: {
            section: newSection as BusinessMenuSection,
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
        section: sectionData as BusinessMenuSection,
        categories: categoriesData as BusinessMenuCategory[]
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

/**
 * Update menu section preferences
 * 
 * @param sectionId - Section ID to update
 * @param data - Updated section data
 * @returns Object with success status and data or error details
 */
export async function updateMenuSection(sectionId: string, data: MenuSectionFormData): Promise<{ 
  success: boolean; 
  data?: BusinessMenuSection; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    const { data: updatedSection, error } = await supabase
      .from("business_menu_sections")
      .update({
        title: data.title,
        icon: data.icon,
        is_visible: data.is_visible
      })
      .eq("id", sectionId)
      .select("*")
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: updatedSection as BusinessMenuSection
    }
  } catch (error) {
    console.error("Error updating menu section:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Create a new menu category
 * 
 * @param sectionId - Section ID to create category in
 * @param data - Category data
 * @returns Object with success status and data or error details
 */
export async function createMenuCategory(sectionId: string, data: MenuCategoryFormData): Promise<{ 
  success: boolean; 
  data?: BusinessMenuCategory; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // Get the current highest display order
    const { data: existingCategories } = await supabase
      .from("business_menu_categories")
      .select("display_order")
      .eq("section_id", sectionId)
      .order("display_order", { ascending: false })
      .limit(1)
    
    const displayOrder = existingCategories && existingCategories.length > 0 
      ? (existingCategories[0].display_order + 1) 
      : 0
    
    const { data: newCategory, error } = await supabase
      .from("business_menu_categories")
      .insert({
        section_id: sectionId,
        name: data.name,
        description: data.description || null,
        display_order: displayOrder
      })
      .select("*")
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: newCategory as BusinessMenuCategory
    }
  } catch (error) {
    console.error("Error creating menu category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Update a menu category
 * 
 * @param categoryId - Category ID to update
 * @param data - Updated category data
 * @returns Object with success status and data or error details
 */
export async function updateMenuCategory(categoryId: string, data: MenuCategoryFormData): Promise<{ 
  success: boolean; 
  data?: BusinessMenuCategory; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    const { data: updatedCategory, error } = await supabase
      .from("business_menu_categories")
      .update({
        name: data.name,
        description: data.description || null
      })
      .eq("id", categoryId)
      .select("*")
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: updatedCategory as BusinessMenuCategory
    }
  } catch (error) {
    console.error("Error updating menu category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Delete a menu category
 * 
 * @param categoryId - Category ID to delete
 * @returns Object with success status or error details
 */
export async function deleteMenuCategory(categoryId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from("business_menu_categories")
      .delete()
      .eq("id", categoryId)
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting menu category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Create a new menu item
 * 
 * @param categoryId - Category ID to create item in
 * @param data - Item data
 * @returns Object with success status and data or error details
 */
export async function createMenuItem(categoryId: string, data: MenuItemFormData): Promise<{ 
  success: boolean; 
  data?: BusinessMenuItem; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // Get the current highest display order
    const { data: existingItems } = await supabase
      .from("business_menu_items")
      .select("display_order")
      .eq("category_id", categoryId)
      .order("display_order", { ascending: false })
      .limit(1)
    
    const displayOrder = existingItems && existingItems.length > 0 
      ? (existingItems[0].display_order + 1) 
      : 0
    
    // Extract numeric price if possible
    let priceNumeric = null
    if (data.price) {
      const numericPrice = data.price.replace(/[^0-9.]/g, '')
      priceNumeric = numericPrice ? parseFloat(numericPrice) : null
    }
    
    const { data: newItem, error } = await supabase
      .from("business_menu_items")
      .insert({
        category_id: categoryId,
        name: data.name,
        description: data.description || null,
        price: data.price || null,
        price_numeric: priceNumeric,
        is_featured: data.is_featured,
        image_url: data.image_url || null,
        display_order: displayOrder
      })
      .select("*")
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: newItem as BusinessMenuItem
    }
  } catch (error) {
    console.error("Error creating menu item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Update a menu item
 * 
 * @param itemId - Item ID to update
 * @param data - Updated item data
 * @returns Object with success status and data or error details
 */
export async function updateMenuItem(itemId: string, data: MenuItemFormData): Promise<{ 
  success: boolean; 
  data?: BusinessMenuItem; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // Extract numeric price if possible
    let priceNumeric = null
    if (data.price) {
      const numericPrice = data.price.replace(/[^0-9.]/g, '')
      priceNumeric = numericPrice ? parseFloat(numericPrice) : null
    }
    
    const { data: updatedItem, error } = await supabase
      .from("business_menu_items")
      .update({
        name: data.name,
        description: data.description || null,
        price: data.price || null,
        price_numeric: priceNumeric,
        is_featured: data.is_featured,
        image_url: data.image_url || null
      })
      .eq("id", itemId)
      .select("*")
      .single()
    
    if (error) {
      throw error
    }
    
    return {
      success: true,
      data: updatedItem as BusinessMenuItem
    }
  } catch (error) {
    console.error("Error updating menu item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Delete a menu item
 * 
 * @param itemId - Item ID to delete
 * @returns Object with success status or error details
 */
export async function deleteMenuItem(itemId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from("business_menu_items")
      .delete()
      .eq("id", itemId)
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
} 