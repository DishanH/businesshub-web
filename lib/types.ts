import { z } from "zod"

// Base schemas
export const attributeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  description: z.string().optional(),
})

export const subcategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  active: z.boolean().default(true),
})

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slug: z.string(),
  icon: z.string().optional(),
  subcategories: z.array(subcategorySchema),
  attributes: z.array(attributeSchema),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const businessAttributeValueSchema = z.object({
  attributeId: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
})

export const businessSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string(),
  subcategoryId: z.string(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional(),
  priceRange: z.number().min(1).max(4),
  attributes: z.array(businessAttributeValueSchema),
  images: z.array(z.string()),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const businessOwnerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessId: z.string(),
  location: z.string(),
})

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  timestamp: z.date(),
  isRead: z.boolean(),
})

// Types
export type Attribute = z.infer<typeof attributeSchema>
export type Subcategory = z.infer<typeof subcategorySchema>
export type Category = z.infer<typeof categorySchema>
export type BusinessAttributeValue = z.infer<typeof businessAttributeValueSchema>
export type Business = z.infer<typeof businessSchema>

export type User = {
  id: string
  name: string
  email: string
  active: boolean
}

export type BusinessPost = {
  id: string
  title: string
  businessName: string
  content: string
  active: boolean
}

export type BusinessOwner = z.infer<typeof businessOwnerSchema>
export type Message = z.infer<typeof messageSchema>

