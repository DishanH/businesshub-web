import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUserRoles() {
  console.log('Starting to fix user roles...')

  // Get all users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return
  }

  console.log(`Found ${users.users.length} users`)

  // For each user, check if they have a role in their metadata
  for (const user of users.users) {
    const userRole = user.user_metadata?.role

    if (!userRole) {
      console.log(`User ${user.id} (${user.email}) has no role, setting to 'user'`)
      
      // Update user metadata to include role
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, role: 'user' } }
      )

      if (updateError) {
        console.error(`Error updating role for user ${user.id}:`, updateError)
      } else {
        console.log(`Successfully set role for user ${user.id} to 'user'`)
      }
    } else {
      console.log(`User ${user.id} (${user.email}) already has role: ${userRole}`)
    }
  }

  console.log('Finished fixing user roles')
}

// Run the function
fixUserRoles()
  .catch(console.error)
  .finally(() => process.exit(0)) 