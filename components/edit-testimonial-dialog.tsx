"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TestimonialForm } from "@/components/testimonial-form"
import { Star, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { 
  deleteTestimonial
} from "@/app/actions/testimonials"

// Define testimonial type
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
  active?: boolean;
}

interface EditTestimonialDialogProps {
  testimonial: Testimonial;
  userEmail: string;
}

export function EditTestimonialDialog({ testimonial, userEmail }: EditTestimonialDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Pre-populate form with testimonial data
  const formData = {
    name: testimonial.name,
    email: testimonial.email,
    role: testimonial.role,
    business: testimonial.business || "",
    text: testimonial.text,
    rating: testimonial.rating,
    category: testimonial.category,
  }

  const handleSuccess = () => {
    setIsOpen(false)
    router.refresh()
  }

  const handleDelete = async () => {
    try {
      // Use the dedicated delete function instead of toggling active state
      const result = await deleteTestimonial(testimonial.id)
      
      if (result.success) {
        setIsOpen(false)
        setIsAlertOpen(false)
        toast({
          title: "Testimonial deleted",
          description: "Your testimonial has been permanently removed.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-primary">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-t-lg">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-semibold flex items-center">
                <Star className="h-5 w-5 text-primary mr-2 fill-primary/80" />
                Edit Your Testimonial
              </DialogTitle>
              <DialogDescription className="mt-2">
                Make changes to your testimonial. It will need to be reviewed again before being published.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6">
            <TestimonialForm 
              onSuccess={handleSuccess} 
              userEmail={userEmail} 
              onCancel={() => setIsOpen(false)}
              initialData={formData}
              isEdit={true}
              testimonialId={testimonial.id}
            />

            <div className="mt-6 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setIsAlertOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Testimonial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove your testimonial
              from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 