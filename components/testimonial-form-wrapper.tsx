"use client"

import { TestimonialForm } from "@/components/testimonial-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define the type for the form values
type TestimonialFormValues = {
  name: string;
  email: string;
  role?: string;
  business?: string;
  text: string;
  rating: number;
  category: "business-owner" | "customer";
};

interface TestimonialFormWrapperProps {
  userEmail: string
  redirectPath?: string
  initialData?: TestimonialFormValues
  isEdit?: boolean
  testimonialId?: string
}

export default function TestimonialFormWrapper({
  userEmail,
  initialData,
  isEdit,
  testimonialId
}: TestimonialFormWrapperProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
    router.refresh()
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Submit a Testimonial
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Share Your Experience</DialogTitle>
          <DialogDescription>
            We value your feedback. Please share your experience with BusinessHub.
          </DialogDescription>
        </DialogHeader>
        
        <TestimonialForm
          userEmail={userEmail}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          initialData={initialData}
          isEdit={isEdit}
          testimonialId={testimonialId}
        />
      </DialogContent>
    </Dialog>
  )
} 