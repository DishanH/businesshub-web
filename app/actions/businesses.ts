"use server"

import { createClient, createClientWithoutCookies } from "@/utils/supabase/server"
import { unstable_cache } from "next/cache"
import { revalidatePath } from "next/cache"

// Define types for the returned data
export type BusinessAttribute = {
  id: string
  business_id: string
  attribute_id: string
  value: string | number | boolean | string[]
}

export type Business = {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website?: string
  category_id: string
  subcategory_id?: string
  price_range: number
  rating: number
  image?: string
  active: boolean
  additional_info?: string
  created_at: string
  updated_at: string
  attributes?: BusinessAttribute[]
}

// Function to fetch featured businesses without caching
async function fetchFeaturedBusinesses(limit: number = 4, locationId?: string) {
  try {
    // Use the client without cookies for this function
    const supabase = createClientWithoutCookies()
    
    let query = supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        phone, 
        email, 
        website, 
        category_id, 
        subcategory_id, 
        price_range, 
        rating, 
        image, 
        active, 
        created_at, 
        updated_at,
        business_attributes(*)
      `)
      .eq('active', true)
      .order('rating', { ascending: false })
    
    // Apply location filter if provided
    if (locationId) {
      // Convert locationId to city name (in a real app, you might have a mapping table)
      const cityName = locationId.charAt(0).toUpperCase() + locationId.slice(1).replace(/-/g, ' ')
      query = query.ilike('city', `%${cityName}%`)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) {
      console.error(`Error fetching featured businesses:`, error)
      return { success: false, error: error.message, data: [] }
    }
    
    // Transform the data to include attributes as a nested property
    const transformedData = data.map(business => {
      const { business_attributes, ...rest } = business
      return {
        ...rest,
        attributes: business_attributes || []
      }
    })
    
    return { success: true, data: transformedData as Business[] }
  } catch (error) {
    console.error(`Unexpected error fetching featured businesses:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: []
    }
  }
}

// Cache the fetch function
const getCachedFeaturedBusinesses = unstable_cache(
  fetchFeaturedBusinesses,
  ["featured-businesses"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

// Public function to get featured businesses
export async function getFeaturedBusinesses(limit: number = 4, locationId?: string) {
  return getCachedFeaturedBusinesses(limit, locationId)
}

/**
 * Fetch businesses by category with caching
 */
export const getBusinessesByCategory = unstable_cache(
  async (categoryId: string) => {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          id, 
          name, 
          description, 
          address, 
          city, 
          state, 
          zip, 
          phone, 
          email, 
          website, 
          category_id, 
          subcategory_id, 
          price_range, 
          rating, 
          image, 
          active, 
          created_at, 
          updated_at,
          business_attributes(*)
        `)
        .eq('category_id', categoryId)
        .eq('active', true)
        .order('name')
      
      if (error) {
        console.error(`Error fetching businesses for category ${categoryId}:`, error)
        return { success: false, error: error.message, data: [] }
      }
      
      // Transform the data to include attributes as a nested property
      const transformedData = data.map(business => {
        const { business_attributes, ...rest } = business
        return {
          ...rest,
          attributes: business_attributes || []
        }
      })
      
      return { success: true, data: transformedData as Business[] }
    } catch (error) {
      console.error(`Unexpected error fetching businesses for category ${categoryId}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["businesses-by-category"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Fetch businesses by location with caching
 */
export const getBusinessesByLocation = unstable_cache(
  async (location: string) => {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          id, 
          name, 
          description, 
          address, 
          city, 
          state, 
          zip, 
          phone, 
          email, 
          website, 
          category_id, 
          subcategory_id, 
          price_range, 
          rating, 
          image, 
          active, 
          created_at, 
          updated_at,
          business_attributes(*)
        `)
        .or(`city.ilike.%${location}%,state.ilike.%${location}%,zip.ilike.%${location}%`)
        .eq('active', true)
        .order('name')
      
      if (error) {
        console.error(`Error fetching businesses for location ${location}:`, error)
        return { success: false, error: error.message, data: [] }
      }
      
      // Transform the data to include attributes as a nested property
      const transformedData = data.map(business => {
        const { business_attributes, ...rest } = business
        return {
          ...rest,
          attributes: business_attributes || []
        }
      })
      
      return { success: true, data: transformedData as Business[] }
    } catch (error) {
      console.error(`Unexpected error fetching businesses for location ${location}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["businesses-by-location"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Search businesses with caching
 */
export const searchBusinesses = unstable_cache(
  async (query: string) => {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          id, 
          name, 
          description, 
          address, 
          city, 
          state, 
          zip, 
          phone, 
          email, 
          website, 
          category_id, 
          subcategory_id, 
          price_range, 
          rating, 
          image, 
          active, 
          created_at, 
          updated_at,
          business_attributes(*)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('active', true)
        .order('name')
      
      if (error) {
        console.error(`Error searching businesses for query ${query}:`, error)
        return { success: false, error: error.message, data: [] }
      }
      
      // Transform the data to include attributes as a nested property
      const transformedData = data.map(business => {
        const { business_attributes, ...rest } = business
        return {
          ...rest,
          attributes: business_attributes || []
        }
      })
      
      return { success: true, data: transformedData as Business[] }
    } catch (error) {
      console.error(`Unexpected error searching businesses for query ${query}:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      }
    }
  },
  ["search-businesses"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

/**
 * Revalidate business caches
 */
export async function revalidateBusinesses() {
  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath("/business")
}

// Function to fetch newly added businesses without caching
async function fetchNewlyAddedBusinesses(limit: number = 8, locationId?: string) {
  try {
    // Use the client without cookies for this function
    const supabase = createClientWithoutCookies()
    
    let query = supabase
      .from("businesses")
      .select(`
        id, 
        name, 
        description, 
        address, 
        city, 
        state, 
        zip, 
        phone, 
        email, 
        website, 
        category_id, 
        subcategory_id, 
        price_range, 
        rating, 
        image, 
        active, 
        created_at, 
        updated_at,
        business_attributes(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    // Apply location filter if provided
    if (locationId) {
      // Convert locationId to city name (in a real app, you might have a mapping table)
      const cityName = locationId.charAt(0).toUpperCase() + locationId.slice(1).replace(/-/g, ' ')
      query = query.ilike('city', `%${cityName}%`)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) {
      console.error(`Error fetching newly added businesses:`, error)
      return { success: false, error: error.message, data: [] }
    }
    
    // Transform the data to include attributes as a nested property
    const transformedData = data.map(business => {
      const { business_attributes, ...rest } = business
      return {
        ...rest,
        attributes: business_attributes || []
      }
    })
    
    return { success: true, data: transformedData as Business[] }
  } catch (error) {
    console.error(`Unexpected error fetching newly added businesses:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      data: []
    }
  }
}

// Cache the fetch function
const getCachedNewlyAddedBusinesses = unstable_cache(
  fetchNewlyAddedBusinesses,
  ["newly-added-businesses"],
  { revalidate: 60 * 5 } // Cache for 5 minutes
)

// Public function to get newly added businesses
export async function getNewlyAddedBusinesses(limit: number = 8, locationId?: string) {
  return getCachedNewlyAddedBusinesses(limit, locationId)
} 