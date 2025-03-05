'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Ban a user (soft delete)
 */
export async function banUser(userId: string) {
  try {
    const supabase = await createClient()
    
    // Check if current user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication required')
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') throw new Error('Admin access required')
    
    // Ban the user using Supabase Auth admin API
    const { error: banError } = await supabase.auth.admin.deleteUser(
      userId,
      true // soft delete (ban)
    )
    
    if (banError) throw banError
    
    // Revalidate admin pages
    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (error) {
    console.error('Error banning user:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Unban a user
 */
export async function unbanUser(userId: string) {
  try {
    const supabase = await createClient()
    
    // Check if current user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw new Error('Authentication required')
    
    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') throw new Error('Admin access required')
    
    // Unban the user by restoring them
    const { error: unbanError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        ban_duration: ''  // Empty string to remove the ban
      }
    )
    
    if (unbanError) throw unbanError
    
    // Revalidate admin pages
    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (error) {
    console.error('Error unbanning user:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
} 