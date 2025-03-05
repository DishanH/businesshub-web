'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  redirectTo: z.string().optional()
})

export type SignInFormData = z.infer<typeof signInSchema>

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo') || '/'
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { email, password, redirectTo } = validatedFields.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return { error: error.message }
  }

  // Get the user to verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Authentication failed' }
  }

  return { success: true, redirectTo }
}

export async function signInWithOAuth(provider: 'google' | 'github') {
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

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
} 