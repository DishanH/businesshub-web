"use server";

import { 
  createBusinessServiceCategory, 
  createBusinessService,
  updateBusinessServiceCategory,
  updateBusinessService
} from "@/app/owner/business-profiles/actions";

export async function createCategory(
  businessId: string,
  name: string,
  description?: string
) {
  if (!name) return { success: false, error: "Name is required" };
  
  try {
    const result = await createBusinessServiceCategory({
      business_id: businessId,
      name,
      description: description || undefined,
    });
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  categoryId: string,
  name: string,
  description?: string
) {
  if (!name) return { success: false, error: "Name is required" };
  
  try {
    const result = await updateBusinessServiceCategory(categoryId, {
      name,
      description: description || undefined,
    });
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function createService(
  businessId: string,
  name: string,
  categoryId?: string,
  description?: string,
  price?: number,
  priceDescription?: string,
  isFeatured?: boolean
) {
  if (!name) return { success: false, error: "Name is required" };
  
  try {
    const result = await createBusinessService({
      business_id: businessId,
      category_id: categoryId || undefined,
      name,
      description: description || undefined,
      price,
      price_description: priceDescription || undefined,
      is_featured: isFeatured || false,
    });
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

export async function updateService(
  serviceId: string,
  name: string,
  categoryId?: string,
  description?: string,
  price?: number,
  priceDescription?: string,
  isFeatured?: boolean
) {
  if (!name) return { success: false, error: "Name is required" };
  
  try {
    const result = await updateBusinessService(serviceId, {
      category_id: categoryId || undefined,
      name,
      description: description || undefined,
      price,
      price_description: priceDescription || undefined,
      is_featured: isFeatured || false,
    });
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "Failed to update service" };
  }
} 