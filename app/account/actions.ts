'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the profile schema for validation
const profileSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export async function updateProfile(formData: ProfileFormData) {
  try {
    // Validate the form data
    const validatedData = profileSchema.parse(formData)
    
    // Create a Supabase client
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Update user metadata with avatar URL and name
    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        avatar_url: validatedData.avatarUrl,
        name: validatedData.fullName,
      }
    })

    if (updateUserError) {
      throw new Error(`Error updating user metadata: ${updateUserError.message}`)
    }
    
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Error checking profile: ${profileError.message}`)
    }
    
    let result
    
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from("user_profiles")
        .update({
          full_name: validatedData.fullName,
          phone_number: validatedData.phoneNumber,
          address: validatedData.address,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
    } else {
      // Insert new profile
      result = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          full_name: validatedData.fullName,
          phone_number: validatedData.phoneNumber,
          address: validatedData.address,
        })
    }
    
    if (result.error) {
      throw new Error(`Error updating profile: ${result.error.message}`)
    }
    
    // Revalidate the profile page to show updated data
    revalidatePath('/account')
    
    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const supabase = await createClient()
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file)
    
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`)
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)
    
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Avatar upload error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
} 