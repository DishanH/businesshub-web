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
import { deleteTestimonial } from "@/app/actions/testimonials"

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
}

interface TestimonialDialogProps {
  userEmail: string | null;
  userTestimonial?: Testimonial | null;
}

export function TestimonialDialog({ userEmail, userTestimonial }: TestimonialDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const toast = useToast?.()
  const router = useRouter()

  const handleSuccess = () => {
    setIsOpen(false)
    setTimeout(() => {
      router.refresh()
      window.location.reload()
    }, 100)
  }

  const handleDelete = async () => {
    if (!userTestimonial) return
    
    try {
      const result = await deleteTestimonial(userTestimonial.id)
      
      if (result.success) {
        setIsOpen(false)
        setIsAlertOpen(false)
        toast?.toast({
          title: "Testimonial deleted",
          description: "Your testimonial has been permanently removed.",
        })
        setTimeout(() => {
          router.refresh()
          window.location.reload()
        }, 100)
      } else {
        toast?.toast({
          title: "Error",
          description: result.error || "Failed to delete testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast?.toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {userTestimonial ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="px-4 hover:shadow-md transition-shadow flex items-center gap-2 ml-auto"
              >
                <Edit className="h-4 w-4" />
                Edit Your Testimonial
              </Button>
            ) : (
              <Button size="sm" className="font-medium px-4 hover:shadow-md transition-shadow">
                Submit Your Testimonial
              </Button>
            )}
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto p-0">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-t-lg">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-semibold flex items-center">
                  <Star className="h-5 w-5 text-primary mr-2 fill-primary/80" />
                  {userTestimonial ? "Edit Your Testimonial" : "Share Your Experience"}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {userTestimonial 
                    ? "Update your testimonial. It will need to be reviewed again before being published."
                    : "We value your feedback. Please share your experience with BusinessHub to help us improve and inspire others."
                  }
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="p-6">
              <TestimonialForm 
                onSuccess={handleSuccess} 
                userEmail={userEmail || ""} 
                onCancel={() => setIsOpen(false)}
                initialData={userTestimonial ? {
                  name: userTestimonial.name,
                  email: userTestimonial.email,
                  role: userTestimonial.role,
                  business: userTestimonial.business || "",
                  text: userTestimonial.text,
                  rating: userTestimonial.rating,
                  category: userTestimonial.category,
                } : undefined}
                isEdit={!!userTestimonial}
                testimonialId={userTestimonial?.id}
              />

              {userTestimonial && (
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
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

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