'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'business', 'admin']).default('user')
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export async function signUp(formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role') || 'user'
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { name, email, password, role } = validatedFields.data
  const supabase = await createClient()

  // Create the user with role in metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  // Create user profile manually instead of relying on the trigger
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        full_name: name,
        email: email,
        phone_number: null,
        address: null
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // We don't return an error here because the user was created successfully
      // The profile can be created later if needed
    }
  }

  // Email verification is handled by Supabase Auth
  return { success: true }
}

export async function signUpWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
    }
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { url: data.url }
} 