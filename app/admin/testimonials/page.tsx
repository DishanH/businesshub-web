import { Metadata } from "next"
import { getAllTestimonials } from "@/app/actions/testimonials"
import { TestimonialAdminList } from "@/components/testimonial-admin-list"

export const metadata: Metadata = {
  title: "Manage Testimonials | Admin Dashboard",
  description: "Review, approve, and manage user testimonials",
}

export default async function AdminTestimonialsPage() {
  const { success, testimonials, error } = await getAllTestimonials()

  return (
    <div className="container py-10 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Testimonials</h1>
          <p className="text-muted-foreground">
            Review, approve, reject, and manage customer testimonials
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Inactive</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
          <p>Error loading testimonials: {error}</p>
        </div>
      )}
      
      {success && testimonials ? (
        <TestimonialAdminList testimonials={testimonials} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials found.</p>
        </div>
      )}
    </div>
  )
} 