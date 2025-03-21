"use client"

import { useState, useEffect } from "react"
import { TestimonialDialog } from "@/components/testimonial-dialog"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Define testimonial type to match with TestimonialDialog
type Testimonial = {
  id: string;
  name: string;
  email: string;
  role: string;
  business: string | null;
  text: string;
  rating: number;
  category: 'business-owner' | 'customer';
  status?: string;
}

export function AuthenticatedTestimonialDialog() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email) {
          setIsAuthenticated(true)
          setUserEmail(user.email)
          
          // Check if user already has a testimonial
          const { data } = await supabase
            .from('testimonials')
            .select('*')
            .eq('email', user.email)
            .limit(1)
            .single()
            
          if (data) {
            setUserTestimonial(data as Testimonial)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [])
  
  if (isLoading) {
    return null // Or a loading indicator
  }
  
  // For non-authenticated users, only show login prompt
  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <Button variant="outline" asChild className="hover:bg-primary/5">
          <Link href="/auth/sign-in?redirect=/testimonials">
            Sign in to leave a testimonial
          </Link>
        </Button>
      </div>
    )
  }
  
  return <TestimonialDialog userEmail={userEmail} userTestimonial={userTestimonial} />
} 