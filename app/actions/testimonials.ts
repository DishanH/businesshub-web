'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Define the testimonial form schema
export type TestimonialFormData = {
  name: string
  email: string
  role: string
  business?: string
  text: string
  rating: number
  category: 'business-owner' | 'customer'
}

// Create a Supabase client for server components
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Submit a new testimonial
export async function submitTestimonial(formData: TestimonialFormData) {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          business: formData.business || null,
          text: formData.text,
          rating: formData.rating,
          category: formData.category,
          status: 'pending',
          active: true
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
    const supabase = getSupabaseClient()
    
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

// Get all testimonials for admin dashboard (including inactive ones)
export async function getAllTestimonials() {
  try {
    const supabase = getSupabaseClient()
    
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
    const supabase = getSupabaseClient()
    
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
    const supabase = getSupabaseClient()
    
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