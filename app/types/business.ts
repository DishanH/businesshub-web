import { z } from "zod";

// Define the business hours schema
export const businessHoursSchema = z.array(
  z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })
);

// Define the social media schema
export const socialMediaSchema = z
  .array(
    z.object({
      platform: z.string(),
      url: z.string().url("Invalid URL format").optional().or(z.literal("")),
    })
  )
  .default([])
  .optional();

// Define the business attribute schema
export const businessAttributeSchema = z.object({
  attributeId: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

// Define the form schema
export const addBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priceRange: z.coerce
    .number()
    .min(1)
    .max(4, "Price range must be between 1 and 4"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  attributes: z.array(businessAttributeSchema),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  businessHours: businessHoursSchema,
  socialMedia: socialMediaSchema,
  additionalInfo: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  images: z.array(z.string()).default([]),
});

export type AddBusinessFormData = z.infer<typeof addBusinessSchema>;
