/**
 * This script ensures that all users in Supabase Auth have corresponding profiles
 * in the user_profiles table. It's useful for migrating existing users after
 * changing the profile structure.
 * 
 * Run with: npx tsx scripts/ensure-user-profiles.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please check your .env file.')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('Starting user profile migration...')
  
  try {
    // Get all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      throw usersError
    }
    
    console.log(`Found ${users.length} users in Auth`)
    
    // Get all existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id')
    
    if (profilesError) {
      throw profilesError
    }
    
    console.log(`Found ${profiles.length} existing profiles`)
    
    // Create a set of user IDs that already have profiles
    const existingProfileUserIds = new Set(profiles.map(profile => profile.user_id))
    
    // Filter users that don't have profiles
    const usersWithoutProfiles = users.filter(user => !existingProfileUserIds.has(user.id))
    
    console.log(`Found ${usersWithoutProfiles.length} users without profiles`)
    
    // Create profiles for users that don't have them
    for (const user of usersWithoutProfiles) {
      console.log(`Creating profile for user ${user.id} (${user.email})`)
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.name || 'User',
          email: user.email
        })
      
      if (insertError) {
        console.error(`Error creating profile for user ${user.id}:`, insertError)
      }
    }
    
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main() 