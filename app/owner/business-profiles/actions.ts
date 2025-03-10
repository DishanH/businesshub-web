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

// Define types for services and categories
export interface BusinessServiceCategory {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessService {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  price_description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessSpecial {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Fetch business services by business ID
export async function getBusinessServicesByBusinessId(businessId: string) {
  try {
    const supabase = await createClient();
    
    // First, get the service categories
    const { data: categories, error: categoriesError } = await supabase
      .from('business_service_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (categoriesError) throw categoriesError;
    
    // Then, get all services for this business
    const { data: services, error: servicesError } = await supabase
      .from('business_services')
      .select('*')
      .eq('business_id', businessId)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (servicesError) throw servicesError;
    
    // Create a map of category ID to services
    const servicesByCategory = (categories || []).map((category: BusinessServiceCategory) => {
      const categoryServices = (services || []).filter((service: BusinessService) => service.category_id === category.id);
      return {
        ...category,
        services: categoryServices
      };
    });
    
    // Also include services without a category
    const uncategorizedServices = (services || []).filter((service: BusinessService) => !service.category_id);
    
    return {
      data: {
        categories: servicesByCategory,
        uncategorizedServices: uncategorizedServices,
        featuredServices: (services || []).filter((service: BusinessService) => service.is_featured)
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching business services:', error);
    return {
      data: null,
      error: 'Failed to fetch business services'
    };
  }
}

// Fetch business specials by business ID
export async function getBusinessSpecialsByBusinessId(businessId: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('business_specials')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .or('end_date.is.null,end_date.gte.now()')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return {
      data: data as BusinessSpecial[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching business specials:', error);
    return {
      data: null,
      error: 'Failed to fetch business specials'
    };
  }
}

// Create a new business service category
export async function createBusinessServiceCategory(data: {
  business_id: string;
  name: string;
  description?: string;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('business_service_categories')
      .insert({
        business_id: data.business_id,
        name: data.name,
        description: data.description || null,
        display_order: data.display_order || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error creating business service category:', error);
    return {
      data: null,
      error: 'Failed to create business service category'
    };
  }
}

// Create a new business service
export async function createBusinessService(data: {
  business_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  price_description?: string;
  is_featured?: boolean;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('business_services')
      .insert({
        business_id: data.business_id,
        category_id: data.category_id || null,
        name: data.name,
        description: data.description || null,
        price: data.price || null,
        price_description: data.price_description || null,
        is_featured: data.is_featured || false,
        display_order: data.display_order || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error creating business service:', error);
    return {
      data: null,
      error: 'Failed to create business service'
    };
  }
}

// Update a business service category
export async function updateBusinessServiceCategory(id: string, data: {
  name?: string;
  description?: string;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('business_service_categories')
      .update({
        name: data.name,
        description: data.description,
        display_order: data.display_order
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error updating business service category:', error);
    return {
      data: null,
      error: 'Failed to update business service category'
    };
  }
}

// Update a business service
export async function updateBusinessService(id: string, data: {
  category_id?: string;
  name?: string;
  description?: string;
  price?: number;
  price_description?: string;
  is_featured?: boolean;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('business_services')
      .update({
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        price: data.price,
        price_description: data.price_description,
        is_featured: data.is_featured,
        display_order: data.display_order
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error updating business service:', error);
    return {
      data: null,
      error: 'Failed to update business service'
    };
  }
}

// Delete a business service category
export async function deleteBusinessServiceCategory(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('business_service_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error deleting business service category:', error);
    return {
      success: false,
      error: 'Failed to delete business service category'
    };
  }
}

// Delete a business service
export async function deleteBusinessService(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('business_services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error deleting business service:', error);
    return {
      success: false,
      error: 'Failed to delete business service'
    };
  }
} 