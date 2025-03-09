/**
 * Business Types
 * 
 * This file contains type definitions for business-related data.
 */

/**
 * Business attribute type definition
 */
export type BusinessAttribute = {
  id: string
  business_id: string
  attribute_id: string
  value: string | number | boolean | string[]
}

/**
 * Business type definition
 */
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
  is_active: boolean
  deactivated_by_user: boolean
  user_id: string
  additional_info?: string
  created_at: string
  updated_at: string
  attributes?: BusinessAttribute[]
} 