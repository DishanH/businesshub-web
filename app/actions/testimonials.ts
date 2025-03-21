'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Define the testimonial form schema
export type TestimonialFormData = {
  name: string
  email: string
  role?: string
  business?: string
  text: string
  rating: number
  category: 'business-owner' | 'customer'
}

// Create a Supabase client for server components
async function getSupabaseClient() {
  return await createClient()
}

// Function to get Supabase admin client
// This was previously used but is no longer needed
// function getAdminSupabaseClient() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
//   )
// }

// Submit a new testimonial
export async function submitTestimonial(formData: TestimonialFormData) {
  try {
    console.log('Starting submitTestimonial with data:', {
      ...formData,
      email: formData.email ? `${formData.email.substring(0, 3)}...` : null // Only log partial email for privacy
    })
    
    const supabase = await getSupabaseClient()
    
    // First try to get the authenticated user from session
    const { data: sessionData } = await supabase.auth.getSession()
    // Then try with getUser as fallback
    const { data: userData } = await supabase.auth.getUser()
    
    // Get user from either method
    const user = userData?.user || sessionData?.session?.user
    
    console.log('Auth check results:', { 
      sessionUser: !!sessionData?.session?.user,
      directUser: !!userData?.user,
      combinedUser: !!user
    })
    
    // Ensure user is authenticated
    if (!user) {
      console.error('No authenticated user found in either session or direct check')
      return { success: false, error: 'You must be signed in to submit a testimonial' }
    }
    
    // Ensure email matches the authenticated user's email
    const emailsMatch = user.email === formData.email
    console.log('Email match check:', { match: emailsMatch })
    
    if (!emailsMatch) {
      console.error('Email mismatch:', { 
        formEmail: formData.email ? `${formData.email.substring(0, 3)}...` : null,
        userEmail: user.email ? `${user.email.substring(0, 3)}...` : null
      })
      return { success: false, error: 'Email does not match your account email' }
    }
    
    // Set default role for customer if not provided
    if (formData.category === 'customer' && (!formData.role || formData.role.trim() === '')) {
      console.log('Setting default customer role')
      formData.role = 'Customer'
    }
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          role: formData.role || 'Customer',
          business: formData.business || null,
          text: formData.text,
          rating: formData.rating,
          category: formData.category,
          status: 'pending',
          active: true,
          user_id: user.id
        }
      ])
      .select()
    
    if (error) {
      console.error('Error submitting testimonial:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the testimonials page to show the new testimonial (when approved)
    revalidatePath('/testimonials')
    
    return { success: true, data }
  } catch (error) {
    console.error('Error in submitTestimonial:', error)
    return { success: false, error: 'Failed to submit testimonial' }
  }
}

// Get testimonials for display on the page
export async function getTestimonials(category: string | null = null) {
  try {
    const supabase = await getSupabaseClient()
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .eq('active', true)
      .order('date', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching testimonials:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, testimonials: data }
  } catch (error) {
    console.error('Error in getTestimonials:', error)
    return { success: false, error: 'Failed to fetch testimonials' }
  }
}

// Get current user's testimonials (regardless of status)
export async function getUserTestimonials() {
  try {
    const supabase = await getSupabaseClient()
    
    // First try to get the authenticated user from session
    const { data: sessionData } = await supabase.auth.getSession()
    // Then try with getUser as fallback
    const { data: userData } = await supabase.auth.getUser()
    
    // Get user from either method
    const user = userData?.user || sessionData?.session?.user
    
    // Ensure user is authenticated
    if (!user) {
      console.error('No authenticated user found in either session or direct check')
      return { success: false, error: 'You must be signed in to view your testimonials' }
    }
    
    // Query by user_id if available, fallback to email for backward compatibility
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user testimonials:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, testimonials: data }
  } catch (error) {
    console.error('Error in getUserTestimonials:', error)
    return { success: false, error: 'Failed to fetch your testimonials' }
  }
}

// Get all testimonials for admin dashboard (including inactive ones)
export async function getAllTestimonials() {
  try {
    const supabase = await getSupabaseClient()
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching all testimonials:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, testimonials: data }
  } catch (error) {
    console.error('Error in getAllTestimonials:', error)
    return { success: false, error: 'Failed to fetch all testimonials' }
  }
}

// Toggle testimonial active state
export async function toggleTestimonialActive(id: string, currentActiveState: boolean) {
  try {
    const supabase = await getSupabaseClient()
    
    const { error } = await supabase
      .from('testimonials')
      .update({ active: !currentActiveState })
      .eq('id', id)
    
    if (error) {
      console.error('Error toggling testimonial active state:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the testimonials page to update the UI
    revalidatePath('/testimonials')
    revalidatePath('/admin/testimonials')
    
    return { 
      success: true, 
      message: currentActiveState ? 'Testimonial deactivated successfully' : 'Testimonial activated successfully'
    }
  } catch (error) {
    console.error('Error in toggleTestimonialActive:', error)
    return { success: false, error: 'Failed to update testimonial status' }
  }
}

// Update testimonial status (pending, approved, rejected)
export async function updateTestimonialStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const supabase = await getSupabaseClient()
    
    const { error } = await supabase
      .from('testimonials')
      .update({ status })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating testimonial status:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the testimonials page to update the UI
    revalidatePath('/testimonials')
    revalidatePath('/admin/testimonials')
    
    return { success: true, message: `Testimonial ${status} successfully` }
  } catch (error) {
    console.error('Error in updateTestimonialStatus:', error)
    return { success: false, error: 'Failed to update testimonial status' }
  }
}

// Update a user's testimonial
export async function updateTestimonial(id: string, formData: TestimonialFormData) {
  try {
    const supabase = await getSupabaseClient()
    
    // First try to get the authenticated user from session
    const { data: sessionData } = await supabase.auth.getSession()
    // Then try with getUser as fallback
    const { data: userData } = await supabase.auth.getUser()
    
    // Get user from either method
    const user = userData?.user || sessionData?.session?.user
    
    // Ensure user is authenticated
    if (!user) {
      return { success: false, error: 'You must be signed in to update a testimonial' }
    }
    
    // Ensure email matches the authenticated user's email
    if (user.email !== formData.email) {
      return { success: false, error: 'Email does not match your account email' }
    }
    
    // First verify the testimonial belongs to this user
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('email, user_id')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching testimonial:', fetchError)
      return { success: false, error: 'Failed to verify testimonial ownership' }
    }
    
    // Check if the testimonial belongs to the current user
    if (!existingTestimonial || 
        (existingTestimonial.email !== user.email && 
         existingTestimonial.user_id !== user.id)) {
      return { success: false, error: 'You can only edit your own testimonials' }
    }
    
    // Update the testimonial
    const { error } = await supabase
      .from('testimonials')
      .update({
        name: formData.name,
        role: formData.role,
        business: formData.business || null,
        text: formData.text,
        rating: formData.rating,
        category: formData.category,
        status: 'pending', // Resets to pending for review
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating testimonial:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the testimonials page to reflect changes
    revalidatePath('/testimonials')
    
    return { success: true, message: 'Testimonial updated successfully' }
  } catch (error) {
    console.error('Error in updateTestimonial:', error)
    return { success: false, error: 'Failed to update testimonial' }
  }
}

// Delete a testimonial
export async function deleteTestimonial(id: string) {
  try {
    const supabase = await getSupabaseClient()
    
    // First try to get the authenticated user from session
    const { data: sessionData } = await supabase.auth.getSession()
    // Then try with getUser as fallback
    const { data: userData } = await supabase.auth.getUser()
    
    // Get user from either method
    const user = userData?.user || sessionData?.session?.user
    
    // Ensure user is authenticated
    if (!user) {
      return { success: false, error: 'You must be signed in to delete a testimonial' }
    }
    
    // First verify the testimonial belongs to this user
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('email, user_id')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching testimonial:', fetchError)
      return { success: false, error: 'Failed to verify testimonial ownership' }
    }
    
    // Check if the testimonial belongs to the current user
    if (!existingTestimonial || 
        (existingTestimonial.email !== user.email && 
         existingTestimonial.user_id !== user.id)) {
      return { success: false, error: 'You can only delete your own testimonials' }
    }
    
    // Delete the testimonial
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting testimonial:', error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the testimonials page to reflect changes
    revalidatePath('/testimonials')
    revalidatePath('/testimonials/my')
    
    return { success: true, message: 'Testimonial deleted successfully' }
  } catch (error) {
    console.error('Error in deleteTestimonial:', error)
    return { success: false, error: 'Failed to delete testimonial' }
  }
} 