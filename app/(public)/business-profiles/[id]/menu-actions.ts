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
  data: BusinessMenuData | null;
  error: string | null;
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
          },
          error: null
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
      data: {
        section: sectionData,
        categories: categoriesData || []
      },
      error: null
    }
  } catch (error) {
    console.error("Error fetching business menu data:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

// Update menu section
export async function updateMenuSection(businessId: string, sectionData: {
  id: string;
  title: string;
  icon: string;
  is_visible: boolean;
}) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // If section ID is empty, create a new section
    if (!sectionData.id) {
      const { data: newSection, error: insertError } = await supabase
        .from("business_menu_sections")
        .insert({
          business_id: businessId,
          title: sectionData.title,
          icon: sectionData.icon,
          is_visible: sectionData.is_visible,
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating menu section:", insertError);
        return { success: false, error: insertError.message };
      }
      
      return { success: true, data: newSection };
    }
    
    // Update the section
    const { error: updateError } = await supabase
      .from("business_menu_sections")
      .update({
        title: sectionData.title,
        icon: sectionData.icon,
        is_visible: sectionData.is_visible,
        updated_at: new Date().toISOString()
      })
      .eq("id", sectionData.id)
      .eq("business_id", businessId);
    
    if (updateError) {
      console.error("Error updating menu section:", updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateMenuSection:", error);
    return { success: false, error: "Failed to update menu section" };
  }
}

// Add menu category
export async function addMenuCategory(businessId: string, categoryData: {
  name: string;
  description: string;
  display_order: number;
  section_id: string;
}) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify section belongs to this business
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", categoryData.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Menu section not found" };
    }
    
    // Insert the category
    const { data: newCategory, error: insertError } = await supabase
      .from("business_menu_categories")
      .insert({
        section_id: categoryData.section_id,
        name: categoryData.name,
        description: categoryData.description,
        display_order: categoryData.display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error adding menu category:", insertError);
      return { success: false, error: insertError.message };
    }
    
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error in addMenuCategory:", error);
    return { success: false, error: "Failed to add menu category" };
  }
}

// Update menu category
export async function updateMenuCategory(businessId: string, categoryData: {
  id: string;
  name: string;
  description: string;
  display_order: number;
  section_id: string;
}) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify section belongs to this business
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", categoryData.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Menu section not found" };
    }
    
    // Update the category
    const { error: updateError } = await supabase
      .from("business_menu_categories")
      .update({
        name: categoryData.name,
        description: categoryData.description,
        display_order: categoryData.display_order,
        updated_at: new Date().toISOString()
      })
      .eq("id", categoryData.id)
      .eq("section_id", categoryData.section_id);
    
    if (updateError) {
      console.error("Error updating menu category:", updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateMenuCategory:", error);
    return { success: false, error: "Failed to update menu category" };
  }
}

// Delete menu category
export async function deleteMenuCategory(businessId: string, categoryId: string) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify category belongs to this business
    const { data: category, error: categoryError } = await supabase
      .from("business_menu_categories")
      .select("id, section_id")
      .eq("id", categoryId)
      .single();
    
    if (categoryError || !category) {
      return { success: false, error: "Category not found" };
    }
    
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", category.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Category does not belong to this business" };
    }
    
    // Delete all items in this category first
    const { error: deleteItemsError } = await supabase
      .from("business_menu_items")
      .delete()
      .eq("category_id", categoryId);
    
    if (deleteItemsError) {
      console.error("Error deleting menu items:", deleteItemsError);
      return { success: false, error: deleteItemsError.message };
    }
    
    // Delete the category
    const { error: deleteCategoryError } = await supabase
      .from("business_menu_categories")
      .delete()
      .eq("id", categoryId);
    
    if (deleteCategoryError) {
      console.error("Error deleting menu category:", deleteCategoryError);
      return { success: false, error: deleteCategoryError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMenuCategory:", error);
    return { success: false, error: "Failed to delete menu category" };
  }
}

// Add menu item
export async function addMenuItem(businessId: string, itemData: {
  name: string;
  description: string;
  price: string;
  price_numeric: number | null;
  is_featured: boolean;
  display_order: number;
  category_id: string;
}) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify category belongs to this business
    const { data: category, error: categoryError } = await supabase
      .from("business_menu_categories")
      .select("id, section_id")
      .eq("id", itemData.category_id)
      .single();
    
    if (categoryError || !category) {
      return { success: false, error: "Category not found" };
    }
    
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", category.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Category does not belong to this business" };
    }
    
    // Insert the item
    const { data: newItem, error: insertError } = await supabase
      .from("business_menu_items")
      .insert({
        category_id: itemData.category_id,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        price_numeric: itemData.price_numeric,
        is_featured: itemData.is_featured,
        display_order: itemData.display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error adding menu item:", insertError);
      return { success: false, error: insertError.message };
    }
    
    return { success: true, data: newItem };
  } catch (error) {
    console.error("Error in addMenuItem:", error);
    return { success: false, error: "Failed to add menu item" };
  }
}

// Update menu item
export async function updateMenuItem(businessId: string, itemData: {
  id: string;
  name: string;
  description: string;
  price: string;
  price_numeric: number | null;
  is_featured: boolean;
  display_order: number;
  category_id: string;
}) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify category belongs to this business
    const { data: category, error: categoryError } = await supabase
      .from("business_menu_categories")
      .select("id, section_id")
      .eq("id", itemData.category_id)
      .single();
    
    if (categoryError || !category) {
      return { success: false, error: "Category not found" };
    }
    
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", category.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Category does not belong to this business" };
    }
    
    // Update the item
    const { error: updateError } = await supabase
      .from("business_menu_items")
      .update({
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        price_numeric: itemData.price_numeric,
        is_featured: itemData.is_featured,
        display_order: itemData.display_order,
        updated_at: new Date().toISOString()
      })
      .eq("id", itemData.id)
      .eq("category_id", itemData.category_id);
    
    if (updateError) {
      console.error("Error updating menu item:", updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateMenuItem:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}

// Delete menu item
export async function deleteMenuItem(businessId: string, itemId: string) {
  try {
    const supabase = await createClient();
    
    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }
    
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single();
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" };
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this business" };
    }
    
    // Verify item belongs to this business
    const { data: item, error: itemError } = await supabase
      .from("business_menu_items")
      .select("id, category_id")
      .eq("id", itemId)
      .single();
    
    if (itemError || !item) {
      return { success: false, error: "Item not found" };
    }
    
    const { data: category, error: categoryError } = await supabase
      .from("business_menu_categories")
      .select("id, section_id")
      .eq("id", item.category_id)
      .single();
    
    if (categoryError || !category) {
      return { success: false, error: "Category not found" };
    }
    
    const { data: section, error: sectionError } = await supabase
      .from("business_menu_sections")
      .select("id")
      .eq("id", category.section_id)
      .eq("business_id", businessId)
      .single();
    
    if (sectionError || !section) {
      return { success: false, error: "Item does not belong to this business" };
    }
    
    // Delete the item
    const { error: deleteError } = await supabase
      .from("business_menu_items")
      .delete()
      .eq("id", itemId);
    
    if (deleteError) {
      console.error("Error deleting menu item:", deleteError);
      return { success: false, error: deleteError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMenuItem:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
} 