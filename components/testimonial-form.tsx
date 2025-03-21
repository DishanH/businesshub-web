"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { submitTestimonial } from "@/app/actions/testimonials"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define the form schema with validation
const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  business: z.string().optional(),
  text: z.string().min(20, "Please share more details (minimum 20 characters)").max(500, "Please keep your testimonial under 500 characters"),
  rating: z.coerce.number().min(1).max(5),
  category: z.enum(["business-owner", "customer"]),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

export function TestimonialForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form with default values
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      business: "",
      text: "",
      rating: 5,
      category: "customer",
    },
  })

  // Handle form submission
  async function onSubmit(data: TestimonialFormValues) {
    setIsSubmitting(true)
    
    try {
      const result = await submitTestimonial(data)
      
      if (result.success) {
        toast({
          title: "Testimonial submitted!",
          description: "Thank you for sharing your experience. Your testimonial will be reviewed shortly.",
          variant: "default",
        })
        form.reset()
        onSuccess()
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "There was a problem submitting your testimonial. Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your testimonial. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>You are a</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="customer" />
                    </FormControl>
                    <FormLabel className="font-normal">Customer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="business-owner" />
                    </FormControl>
                    <FormLabel className="font-normal">Business Owner</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={form.watch("category") === "business-owner" ? "Restaurant Owner" : "Customer"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch("category") === "business-owner" && (
            <FormField
              control={form.control}
              name="business"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => field.onChange(rating)}
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          rating <= field.value
                            ? "text-primary fill-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share your experience with BusinessHub..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share how BusinessHub has helped you or your business.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </form>
    </Form>
  )
} 