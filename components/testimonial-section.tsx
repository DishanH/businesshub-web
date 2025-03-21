"use client"

import { useState, useEffect } from "react"
import { TestimonialDialog } from "@/components/testimonial-dialog"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Star } from "lucide-react"
import { getUserTestimonials } from "@/app/actions/testimonials"

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

export function TestimonialSection() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        // Get session and user data
        const { data: sessionData } = await supabase.auth.getSession()
        const { data: userData } = await supabase.auth.getUser()
        
        // Check if user is authenticated (either through session or getUser)
        const user = userData?.user || sessionData?.session?.user
        
        if (user?.email) {
          setIsAuthenticated(true)
          setUserEmail(user.email)
          
          // Use the new server action to get the user's testimonials
          const { success, testimonials } = await getUserTestimonials()
          
          if (success && testimonials && testimonials.length > 0) {
            // Use the first testimonial if the user has multiple
            setUserTestimonial(testimonials[0] as Testimonial)
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
    return (
      <div className="bg-muted/30 p-8 rounded-xl max-w-3xl mx-auto text-center shadow-sm border border-border/30">
        <div className="py-4">Loading...</div>
      </div>
    )
  }
  
  // User has already submitted a testimonial - show their testimonial with edit option
  if (userTestimonial) {
    return (
      <div className="bg-card p-8 rounded-xl max-w-3xl mx-auto shadow-sm border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Star className="h-5 w-5 text-primary mr-2 fill-primary/80" />
            Your Testimonial
          </h2>
          <Button variant="outline" size="sm" className="text-primary" asChild>
            <Link href={`/testimonials/edit/${userTestimonial.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Status:</span> {userTestimonial.status === 'approved' ? 'Published' : 'Pending Review'}
            </p>
            <div className="flex items-center">
              {Array(userTestimonial.rating).fill(0).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
              {Array(5 - userTestimonial.rating).fill(0).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-muted" />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-sm italic pl-4 border-l-2 border-primary/20">
            &ldquo;{userTestimonial.text}&rdquo;
          </p>
        </div>
      </div>
    )
  }
  
  // User is logged in but hasn't submitted a testimonial
  if (isAuthenticated) {
    return (
      <div className="bg-muted/30 p-8 rounded-xl max-w-3xl mx-auto text-center shadow-sm border border-border/30">
        <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          We&apos;d love to hear about your experience with BusinessHub. Your feedback helps us improve our platform
          and inspires other businesses and customers.
        </p>
        <TestimonialDialog userEmail={userEmail} userTestimonial={null} />
      </div>
    )
  }
  
  // User is not logged in
  return (
    <div className="bg-muted/30 p-8 rounded-xl max-w-3xl mx-auto text-center shadow-sm border border-border/30">
      <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        Sign in to share your experience with BusinessHub. Your feedback helps us improve our platform
        and inspires other businesses and customers.
      </p>
      <Button variant="default" asChild>
        <Link href="/auth/sign-in?redirect=/testimonials">
          Sign in to leave a testimonial
        </Link>
      </Button>
    </div>
  )
} 