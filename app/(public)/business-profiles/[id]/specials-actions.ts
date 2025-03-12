"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Define types
export interface BusinessSpecial {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  display_order: number | null;
}

export interface SectionPreference {
  id: string;
  business_id: string;
  section_type: string;
  title: string | null;
  is_visible: boolean;
}

// Create a new special
export async function createBusinessSpecial(data: {
  business_id: string;
  name: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: special, error } = await supabase
      .from('business_specials')
      .insert({
        business_id: data.business_id,
        name: data.name,
        description: data.description || null,
        image_url: data.image_url || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        is_active: data.is_active !== undefined ? data.is_active : true,
        display_order: data.display_order || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${data.business_id}`);
    
    return { success: true, data: special };
  } catch (error) {
    console.error("Error creating business special:", error);
    return { success: false, error: "Failed to create special" };
  }
}

// Update an existing special
export async function updateBusinessSpecial(
  specialId: string,
  data: {
    name?: string;
    description?: string;
    image_url?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    display_order?: number;
  }
) {
  try {
    const supabase = await createClient();
    
    // Get the business_id for revalidation
    const { data: special, error: fetchError } = await supabase
      .from('business_specials')
      .select('business_id')
      .eq('id', specialId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data: updatedSpecial, error } = await supabase
      .from('business_specials')
      .update({
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
        display_order: data.display_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', specialId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${special.business_id}`);
    
    return { success: true, data: updatedSpecial };
  } catch (error) {
    console.error("Error updating business special:", error);
    return { success: false, error: "Failed to update special" };
  }
}

// Delete a special
export async function deleteBusinessSpecial(specialId: string) {
  try {
    const supabase = await createClient();
    
    // Get the business_id for revalidation
    const { data: special, error: fetchError } = await supabase
      .from('business_specials')
      .select('business_id')
      .eq('id', specialId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { error } = await supabase
      .from('business_specials')
      .delete()
      .eq('id', specialId);
    
    if (error) throw error;
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${special.business_id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting business special:", error);
    return { success: false, error: "Failed to delete special" };
  }
}

// Get section preferences
export async function getSectionPreferences(businessId: string, sectionType: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('business_section_preferences')
      .select('*')
      .eq('business_id', businessId)
      .eq('section_type', sectionType)
      .single();
    
    if (error) {
      // If no record exists, create a default one
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: {
            business_id: businessId,
            section_type: sectionType,
            title: sectionType === 'specials' ? 'Featured Specials' : 'Our Services',
            is_visible: true
          }
        };
      }
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${sectionType} section preferences:`, error);
    return { 
      success: false, 
      error: `Failed to fetch ${sectionType} section preferences`,
      data: {
        business_id: businessId,
        section_type: sectionType,
        title: sectionType === 'specials' ? 'Featured Specials' : 'Our Services',
        is_visible: true
      }
    };
  }
}

// Update section preferences
export async function updateSectionPreferences(
  businessId: string,
  sectionType: string,
  data: {
    title?: string;
    is_visible?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    
    // Check if a record already exists
    const { data: existingPref } = await supabase
      .from('business_section_preferences')
      .select('id')
      .eq('business_id', businessId)
      .eq('section_type', sectionType)
      .maybeSingle();
    
    let result;
    
    if (existingPref) {
      // Update existing record
      const { data: updatedPref, error } = await supabase
        .from('business_section_preferences')
        .update({
          title: data.title,
          is_visible: data.is_visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPref.id)
        .select()
        .single();
      
      if (error) throw error;
      result = updatedPref;
    } else {
      // Create new record
      const { data: newPref, error } = await supabase
        .from('business_section_preferences')
        .insert({
          business_id: businessId,
          section_type: sectionType,
          title: data.title,
          is_visible: data.is_visible
        })
        .select()
        .single();
      
      if (error) throw error;
      result = newPref;
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error updating ${sectionType} section preferences:`, error);
    return { success: false, error: `Failed to update ${sectionType} section preferences` };
  }
} 