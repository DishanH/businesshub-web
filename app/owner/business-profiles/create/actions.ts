"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { addBusinessSchema, type AddBusinessFormData } from "@/app/types/business";
import { z } from 'zod';

/**
 * Add a new business to the database
 * 
 * This server action handles the complete process of adding a new business:
 * 1. Validates the form data
 * 2. Inserts the business record
 * 3. Adds business hours
 * 4. Adds social media links
 * 5. Adds business attributes
 * 6. Processes and uploads images
 * 
 * @param formData - The form data containing all business information
 * @returns Object with success status and data or error details
 */
export async function addBusiness(formData: AddBusinessFormData) {
  try {
    console.log("Received form data:", formData);

    // Validate the form data
    const validatedData = addBusinessSchema.parse(formData);
    console.log("Validated data:", validatedData);

    // Get the Supabase client
    const supabase = await createClient();

    // Insert the business data (without hours and social media)
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip: validatedData.zip,
        phone: validatedData.phone,
        email: validatedData.email,
        website: validatedData.website || null,
        category_id: validatedData.categoryId,
        subcategory_id: validatedData.subcategoryId,
        price_range: validatedData.priceRange,
        additional_info: validatedData.additionalInfo || null,
        is_active: false, // Set business as inactive by default
        deactivated_by_user: false, // Not deactivated by user initially
        user_id: (await supabase.auth.getUser()).data.user?.id, // Associate with current user
      })
      .select()
      .single();

    if (businessError) {
      console.error("Error creating business:", businessError);
      return { 
        success: false, 
        error: `Database error: ${businessError.message}`,
        details: businessError 
      };
    }

    console.log("Business created:", business);

    // Insert business hours
    if (validatedData.businessHours.length > 0) {
      const businessHoursData = validatedData.businessHours.map(hours => ({
        business_id: business.id,
        day_of_week: hours.day,
        open_time: hours.open,
        close_time: hours.close,
        is_closed: hours.closed,
      }));
      console.log("Inserting business hours:", businessHoursData);

      const { error: hoursError } = await supabase
        .from("business_hours")
        .insert(businessHoursData);

      if (hoursError) {
        console.error("Error adding business hours:", hoursError);
        return { 
          success: false, 
          error: `Failed to add business hours: ${hoursError.message}`,
          details: hoursError
        };
      }
    }

    // Insert social media links
    if (validatedData.socialMedia && validatedData.socialMedia.length > 0) {
      const socialMediaData = validatedData.socialMedia
        .filter(social => social.url) // Only insert if URL is provided
        .map(social => ({
          business_id: business.id,
          platform: social.platform,
          url: social.url,
        }));
      console.log("Inserting social media:", socialMediaData);

      if (socialMediaData.length > 0) {
        const { error: socialError } = await supabase
          .from("business_social_media")
          .insert(socialMediaData);

        if (socialError) {
          console.error("Error adding social media:", socialError);
          return { 
            success: false, 
            error: `Failed to add social media: ${socialError.message}`,
            details: socialError
          };
        }
      }
    }

    // Insert business attributes
    if (validatedData.attributes && validatedData.attributes.length > 0) {
      const attributeData = validatedData.attributes.map(attr => {
        // Convert value to string if it's an array, boolean, or number
        let stringValue = attr.value;
        if (Array.isArray(attr.value)) {
          stringValue = attr.value.join(',');
        } else if (typeof attr.value === 'boolean' || typeof attr.value === 'number') {
          stringValue = String(attr.value);
        }
        
        return {
          business_id: business.id,
          attribute_id: attr.attributeId,
          value: stringValue,
        };
      });
      console.log("Inserting attributes:", attributeData);

      const { error: attributesError } = await supabase
        .from("business_attributes")
        .insert(attributeData);

      if (attributesError) {
        console.error("Error adding business attributes:", attributesError);
        return { 
          success: false, 
          error: `Failed to add attributes: ${attributesError.message}`,
          details: attributesError
        };
      }
    }

    // Save business images
    if (validatedData.images && validatedData.images.length > 0) {
      try {
        // For each image URL, upload to storage
        const imagePromises = validatedData.images.map(async (imageUrl: string, index: number) => {
          try {
            // Skip if the image is already a storage URL
            if (imageUrl.startsWith('https://')) {
              return imageUrl;
            }
            
            // Handle data URLs (base64)
            if (imageUrl.startsWith('data:')) {
              // Extract base64 data from data URL
              const matches = imageUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
              
              if (!matches || matches.length !== 3) {
                console.error(`Invalid data URL format for image ${index}`);
                throw new Error('Invalid image data URL format');
              }
              
              const contentType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');
              
              // Get the current user ID
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                throw new Error('User not authenticated');
              }
              
              // Create a folder structure with user ID for better security
              const folderPath = `${user.id}/${business.id}`;
              const fileName = `image-${index}.jpg`;
              const filePath = `${folderPath}/${fileName}`;
              
              // Upload to Supabase storage with explicit user ID
              const { error: uploadError } = await supabase.storage
                .from('business-images')
                .upload(filePath, buffer, {
                  contentType: contentType || 'image/jpeg',
                  upsert: true
                });
              
              if (uploadError) {
                console.error("Error uploading image:", uploadError);
                
                // Check for specific RLS errors
                if (uploadError.message.includes('new row violates row level security')) {
                  throw new Error('Permission denied: You do not have access to upload to this bucket. Please contact support.');
                }
                
                throw uploadError;
              }
              
              // Get public URL
              const { data: publicUrlData } = supabase.storage
                .from('business-images')
                .getPublicUrl(filePath);
              
              return publicUrlData.publicUrl;
            }
            
            // If we get here, the URL format is not supported
            console.error(`Unsupported image URL format: ${imageUrl.substring(0, 30)}...`);
            throw new Error('Unsupported image URL format');
          } catch (error) {
            console.error(`Error processing image ${index}:`, error);
            throw error;
          }
        });
        
        // Wait for all uploads to complete
        const imageUrls = await Promise.all(imagePromises);
        
        // Save image URLs to business_images table
        const imageData = imageUrls.map((url: string, index: number) => ({
          business_id: business.id,
          url: url,
          alt_text: `${validatedData.name} - Image ${index + 1}`, // Add alt text based on business name
          is_primary: index === 0, // First image is primary
        }));
        
        const { error: imagesError } = await supabase
          .from('business_images')
          .insert(imageData);
        
        if (imagesError) {
          console.error("Error saving image records:", imagesError);
          return {
            success: false,
            error: `Failed to save images: ${imagesError.message}`,
            details: imagesError
          };
        }
      } catch (error) {
        console.error("Error processing images:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to process and save images",
          details: error
        };
      }
    }

    // Revalidate the businesses page
    revalidatePath("/businesses");
    revalidatePath("/businesses/manage");

    return { 
      success: true, 
      data: business 
    };

  } catch (error) {
    console.error("Error adding business:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Validation failed", 
        validationErrors: error.errors,
        details: error
      };
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      details: error
    };
  }
} 