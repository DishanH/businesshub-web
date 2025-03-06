"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const subcategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

const attributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  description: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  subcategories: z.array(subcategorySchema),
  attributes: z.array(attributeSchema),
  active: z.boolean().default(true),
});

/**
 * Fetch all categories
 */
export async function fetchCategories() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id, 
        name, 
        description, 
        slug, 
        icon, 
        active, 
        created_at, 
        updated_at,
        subcategories:category_subcategories(id, name, description, active),
        attributes:category_attributes(
          id, 
          name, 
          type, 
          options, 
          required, 
          description
        )
      `)
      .order('name');
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategoryById(id: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id, 
        name, 
        description, 
        slug, 
        icon, 
        active, 
        created_at, 
        updated_at,
        subcategories:category_subcategories(id, name, description, active),
        attributes:category_attributes(
          id, 
          name, 
          type, 
          options, 
          required, 
          description
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Create a new category
 */
export async function createCategory(formData: z.infer<typeof categorySchema>) {
  try {
    const supabase = await createClient();
    
    // Validate the input data
    const validatedData = categorySchema.parse(formData);
    
    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication required");
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");
    
    // Insert the category
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        slug: validatedData.slug,
        icon: validatedData.icon,
        active: validatedData.active,
      })
      .select('id')
      .single();
    
    if (categoryError) throw categoryError;
    
    const categoryId = categoryData.id;
    
    // Insert subcategories if any
    if (validatedData.subcategories && validatedData.subcategories.length > 0) {
      const subcategories = validatedData.subcategories.map(sub => ({
        category_id: categoryId,
        name: sub.name,
        description: sub.description || '',
        active: sub.active,
      }));
      
      const { error: subcategoryError } = await supabase
        .from("category_subcategories")
        .insert(subcategories);
      
      if (subcategoryError) throw subcategoryError;
    }
    
    // Insert attributes if any
    if (validatedData.attributes && validatedData.attributes.length > 0) {
      const attributes = validatedData.attributes.map(attr => ({
        category_id: categoryId,
        name: attr.name,
        type: attr.type,
        options: attr.options || [],
        required: attr.required,
        description: attr.description || '',
      }));
      
      const { error: attributeError } = await supabase
        .from("category_attributes")
        .insert(attributes);
      
      if (attributeError) throw attributeError;
    }
    
    // Revalidate the categories page
    revalidatePath("/admin/categories");
    
    return { success: true, id: categoryId };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, formData: z.infer<typeof categorySchema>) {
  try {
    const supabase = await createClient();
    
    // Validate the input data
    const validatedData = categorySchema.parse(formData);
    
    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication required");
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");
    
    // Update the category
    const { error: categoryError } = await supabase
      .from("categories")
      .update({
        name: validatedData.name,
        description: validatedData.description,
        slug: validatedData.slug,
        icon: validatedData.icon,
        active: validatedData.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (categoryError) throw categoryError;
    
    // Delete existing subcategories and attributes to replace with new ones
    const { error: deleteSubcategoriesError } = await supabase
      .from("category_subcategories")
      .delete()
      .eq('category_id', id);
    
    if (deleteSubcategoriesError) throw deleteSubcategoriesError;
    
    const { error: deleteAttributesError } = await supabase
      .from("category_attributes")
      .delete()
      .eq('category_id', id);
    
    if (deleteAttributesError) throw deleteAttributesError;
    
    // Insert subcategories if any
    if (validatedData.subcategories && validatedData.subcategories.length > 0) {
      const subcategories = validatedData.subcategories.map(sub => ({
        category_id: id,
        name: sub.name,
        description: sub.description || '',
        active: sub.active,
      }));
      
      const { error: subcategoryError } = await supabase
        .from("category_subcategories")
        .insert(subcategories);
      
      if (subcategoryError) throw subcategoryError;
    }
    
    // Insert attributes if any
    if (validatedData.attributes && validatedData.attributes.length > 0) {
      const attributes = validatedData.attributes.map(attr => ({
        category_id: id,
        name: attr.name,
        type: attr.type,
        options: attr.options || [],
        required: attr.required,
        description: attr.description || '',
      }));
      
      const { error: attributeError } = await supabase
        .from("category_attributes")
        .insert(attributes);
      
      if (attributeError) throw attributeError;
    }
    
    // Revalidate the categories page
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Toggle category active status
 */
export async function toggleCategoryActive(id: string) {
  try {
    const supabase = await createClient();
    
    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication required");
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");
    
    // Get current active status
    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select('active')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Toggle the active status
    const { error: updateError } = await supabase
      .from("categories")
      .update({
        active: !category.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Revalidate the categories page
    revalidatePath("/admin/categories");
    
    return { success: true };
  } catch (error) {
    console.error(`Error toggling active status for category with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient();
    
    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication required");
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");
    
    // Delete the category (cascade will handle subcategories and attributes)
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Revalidate the categories page
    revalidatePath("/admin/categories");
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
} 