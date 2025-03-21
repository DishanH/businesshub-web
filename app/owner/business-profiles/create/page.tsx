"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"

// UI Components
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  MapPin, 
  Clock, 
  FileText,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Store,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Data and Types
import { getActiveCategories } from "@/app/(public)/categories/actions"
import { addBusiness } from "@/app/owner/business-profiles/create/actions"
import { updateBusiness } from "@/app/owner/business-profiles/edit/actions"
import { ClientCategory } from "@/app/types/categories"
import { cn } from "@/lib/utils"
import type { Business } from "@/app/owner/business-profiles/types"

// Extended Business type with additional properties needed for the form
interface ExtendedBusiness extends Business {
  hours?: Array<{
    day_of_week: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }>;
  social?: Array<{
    platform: string;
    url: string;
  }>;
  images?: Array<{
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }>;
}

// Add Google Places API script
import Script from "next/script"

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: typeof google.maps.places.Autocomplete;
        };
      };
    };
  }
}

const steps = [
  {
    id: "basic",
    name: "Basic Information",
    description: "Enter your business name, description, and price range",
    icon: Store,
    fields: ["name", "description", "priceRange"],
  },
  {
    id: "category",
    name: "Category & Attributes",
    description: "Select your business category and related attributes",
    icon: FileText,
    fields: ["categoryId", "subcategoryId", "attributes"],
  },
  {
    id: "contact",
    name: "Contact & Location",
    description: "Add your business address and contact information",
    icon: MapPin,
    fields: ["address", "city", "state", "zip", "phone", "email", "website"],
  },
  {
    id: "hours",
    name: "Hours & Social",
    description: "Set your business hours and social media links",
    icon: Clock,
    fields: ["businessHours", "socialMedia"],
  },
  {
    id: "additional",
    name: "Additional Info",
    description: "Add images and other important details",
    icon: Info,
    fields: ["images", "additionalInfo"],
  },
]

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const SOCIAL_MEDIA_PLATFORMS = ["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube", "TikTok"]

const formSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priceRange: z.number().min(1).max(4, "Price range must be between 1 and 4"),

  // Category & Attributes
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().min(1, "Subcategory is required"),
  attributes: z.array(z.object({
    attributeId: z.string(),
    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  })),

  // Contact & Location
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "Please select an address from the dropdown"),
  state: z.string().min(1, "Please select an address from the dropdown"),
  zip: z.string().min(1, "Please select an address from the dropdown"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .refine(
      (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
      },
      { message: "Please enter a valid email address" }
    ),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  // Hours & Social
  businessHours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })),
  socialMedia: z.array(z.object({
    platform: z.string(),
    url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  })).default([]).optional(),

  // Additional Info
  images: z.array(z.string()),
  additionalInfo: z.string().optional(),
})

// Define props interface for the component
interface AddBusinessPageProps {
  isEditing?: boolean;
  businessData?: ExtendedBusiness | null;
}

export default function AddBusinessPage({ isEditing = false, businessData = null }: AddBusinessPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState<ClientCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ClientCategory | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [scriptLoaded, setScriptLoaded] = useState(false)

  const [addressComponents, setAddressComponents] = useState({
    street_address: "",
    city: "",
    state: "",
    zip: ""
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priceRange: 1,
      categoryId: "",
      subcategoryId: "",
      attributes: [],
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      website: "",
      businessHours: DAYS_OF_WEEK.map(day => ({
        day,
        open: "09:00",
        close: "17:00",
        closed: false,
      })),
      socialMedia: SOCIAL_MEDIA_PLATFORMS.map(platform => ({
        platform,
        url: "",
      })),
      images: [],
      additionalInfo: "",
    },
  })

  // Set page title based on mode
  const pageTitle = isEditing ? "Edit Business" : "Add Business";
  const submitButtonText = isEditing ? "Update Business" : "Submit Business";

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const { success, data, error } = await getActiveCategories();
        
        if (!success || error || !data) {
          console.error("Error fetching categories:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load categories. Please try again."
          });
          return;
        }
        
        // Transform the data to match the Category type expected by the form
        const transformedCategories = data.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          slug: category.slug,
          icon: category.icon,
          active: category.active,
          createdAt: new Date(category.created_at),
          updatedAt: new Date(category.updated_at),
          subcategories: category.subcategories?.map(sub => ({
            id: sub.id,
            name: sub.name,
            description: sub.description || "",
            active: sub.active
          })) || [],
          attributes: (category.attributes || []).map((attr) => ({
            id: attr.id,
            name: attr.name,
            type: attr.type as "text" | "number" | "boolean" | "select" | "multiselect",
            options: attr.options || [],
            required: attr.required || false,
            description: attr.description || ""
          }))
        }));
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  // Handle category selection
  useEffect(() => {
    const categoryId = form.watch("categoryId");
    if (categoryId) {
      // Find the category in the already loaded categories
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setSelectedCategory(category);
        
        // Reset subcategory when category changes
        form.setValue("subcategoryId", "");
        
        // Initialize attributes with default values
        const initialAttributes = category.attributes.map(attr => ({
          attributeId: attr.id,
          value: attr.type === "boolean" ? false :
                 attr.type === "multiselect" ? [] :
                 attr.type === "select" ? "" :
                 attr.type === "number" ? 0 :
                 ""
        }));
        
        form.setValue("attributes", initialAttributes);
      }
    } else {
      setSelectedCategory(null);
      form.setValue("subcategoryId", "");
      form.setValue("attributes", []);
    }
  }, [form.watch("categoryId"), categories, form]);

  // Update the useEffect for Google Places
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && currentStep === 2 && scriptLoaded) {
      const addressInput = document.getElementById('address-input') as HTMLInputElement
      if (addressInput) {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
          componentRestrictions: { country: "ca" },
          fields: ['address_components', 'formatted_address', 'geometry'],
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.address_components) {
            toast({
              variant: "destructive",
              title: "Invalid Address",
              description: "Please select an address from the dropdown suggestions."
            })
            return
          }

          // Extract address components
          const streetNumber = place.address_components.find(component => 
            component.types.includes('street_number'))?.long_name || ''
          const route = place.address_components.find(component => 
            component.types.includes('route'))?.long_name || ''
          const city = place.address_components.find(component => 
            component.types.includes('locality'))?.long_name || ''
          const state = place.address_components.find(component => 
            component.types.includes('administrative_area_level_1'))?.short_name || ''
          const zip = place.address_components.find(component => 
            component.types.includes('postal_code'))?.long_name || ''

          if (!city || !state || !zip) {
            toast({
              variant: "destructive",
              title: "Incomplete Address",
              description: "Please select a complete address with city, state, and postal code."
            })
            return
          }

          // Update address components state
          const newAddressComponents = {
            street_address: `${streetNumber} ${route}`.trim(),
            city,
            state,
            zip
          }
          setAddressComponents(newAddressComponents)

          // Update form values
          form.setValue('address', place.formatted_address || '')
          form.setValue('city', city)
          form.setValue('state', state)
          form.setValue('zip', zip)
          form.trigger(['address', 'city', 'state', 'zip'])
        })
      }
    }
  }, [currentStep, form, scriptLoaded])

  // Initialize form with business data if editing
  useEffect(() => {
    if (isEditing && businessData) {
      // Set form values from business data
      form.reset({
        name: businessData.name,
        description: businessData.description,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        zip: businessData.zip,
        phone: businessData.phone,
        email: businessData.email,
        website: businessData.website || "",
        categoryId: businessData.category_id,
        subcategoryId: businessData.subcategory_id || "",
        priceRange: businessData.price_range,
        additionalInfo: businessData.additional_info || "",
        businessHours: businessData.hours?.map(hour => ({
          day: hour.day_of_week,
          open: hour.open_time,
          close: hour.close_time,
          closed: hour.is_closed
        })) || DAYS_OF_WEEK.map(day => ({
          day,
          open: "09:00",
          close: "17:00",
          closed: false
        })),
        socialMedia: businessData.social?.map(social => ({
          platform: social.platform,
          url: social.url
        })) || [
          { platform: "facebook", url: "" },
          { platform: "instagram", url: "" },
          { platform: "twitter", url: "" }
        ],
        attributes: businessData.attributes?.map(attr => ({
          attributeId: attr.attribute_id,
          value: attr.value
        })) || [],
        images: businessData.images?.map(img => img.url) || []
      });

      // Set selected category to load subcategories and attributes
      if (businessData.category_id) {
        const category = categories.find(cat => cat.id === businessData.category_id);
        if (category) {
          setSelectedCategory(category);
        }
      }
    }
  }, [isEditing, businessData, form, categories]);

  // Function to validate current step fields
  const validateCurrentStep = async () => {
    const currentFields = steps[currentStep].fields
    
    // Trigger validation for current step fields to show inline errors
    const isStepValid = await form.trigger(currentFields as Array<keyof z.infer<typeof formSchema>>)
    
    if (currentStep === 1 && selectedCategory) {
      const attributeValues = form.getValues("attributes")
      const hasRequiredAttributes = selectedCategory.attributes
        .filter(attr => attr.required)
        .every(attr => {
          const attrValue = attributeValues.find(a => a.attributeId === attr.id)?.value
          if (typeof attrValue === 'boolean') return true // Don't validate boolean values as false is valid
          return attrValue !== undefined && attrValue !== "" && 
                 !(Array.isArray(attrValue) && attrValue.length === 0)
        })

      if (!hasRequiredAttributes) {
        // Find required attributes that are missing values
        selectedCategory.attributes
          .filter(attr => attr.required)
          .forEach(attr => {
            const attrValue = attributeValues.find(a => a.attributeId === attr.id)?.value
            if (
              attrValue === undefined || 
              attrValue === "" || 
              (Array.isArray(attrValue) && attrValue.length === 0)
            ) {
              // Set custom error on the attributes field to show inline
              form.setError("attributes", {
                type: "manual",
                message: `Required attribute "${attr.name}" must be filled in`
              })
            }
          })
        
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required attributes"
        })
        return false
      }
    }

    return isStepValid
  }

  // Helper function to update attribute value
  const updateAttributeValue = (attributeId: string, value: string | number | boolean | string[]) => {
    const currentAttributes = form.getValues("attributes")
    const attributeIndex = currentAttributes.findIndex(attr => attr.attributeId === attributeId)
    
    if (attributeIndex > -1) {
      const newAttributes = [...currentAttributes]
      newAttributes[attributeIndex] = { attributeId, value }
      form.setValue("attributes", newAttributes)
    } else {
      form.setValue("attributes", [...currentAttributes, { attributeId, value }])
    }
    
    // Clear error on attributes field if value is valid now
    const isValueValid = value !== undefined && value !== "" && 
                        !(Array.isArray(value) && value.length === 0)
    
    if (isValueValid && form.formState.errors.attributes) {
      form.clearErrors("attributes")
    }
  }

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      // For final step, validate entire form and show inline errors
      const isValid = await form.trigger()
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check all required fields."
        })
        setSubmitting(false)
        return
      }

      // Get form values
      const formValues = form.getValues()
      console.log("Submitting form values:", formValues)
      
      // Filter out empty social media URLs
      const filteredSocialMedia = formValues.socialMedia
        ? formValues.socialMedia.filter(item => item.url && item.url.trim() !== "")
        : []
      
      // Create the final form data
      const finalFormData = {
        ...formValues,
        socialMedia: filteredSocialMedia
      }
      
      let result;
      if (isEditing && businessData) {
        result = await updateBusiness(businessData.id, finalFormData);
      } else {
        result = await addBusiness(finalFormData);
      }
      
      if (result.success) {
        toast({
          title: "Success!",
          description: isEditing 
            ? "Your business has been updated successfully."
            : "Your business has been added successfully."
        })
        // Redirect to manage businesses page
        router.push("/owner/business-profiles/manage")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to save business."
        })
      }
    } catch (error) {
      console.error("Form error:", error)
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: `${err.path.join('.')}: ${err.message}`
          })
        })
        return
      }
      console.error("Form submission failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again."
      })
    } finally {
      setSubmitting(false)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      // Clear errors from current step before going back
      form.clearErrors()
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      // Validate current step before proceeding
      const isValid = await validateCurrentStep()
      if (isValid) {
        // Clear any errors before moving to next step
        form.clearErrors()
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      } else {
        // Focus on the first field with an error
        const currentFields = steps[currentStep].fields
        const errors = form.formState.errors
        
        for (const field of currentFields) {
          if (errors[field as keyof typeof errors]) {
            const element = document.querySelector(`[name="${field}"]`)
            if (element) {
              (element as HTMLElement).focus()
              break
            }
          }
        }
      }
    }
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/owner/business-profiles/manage">My Businesses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    {/* Banner with instructions */}
    <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border-l-4 border-primary shadow-sm">
      <div className="flex gap-3 items-center">
        <Store className="h-5 w-5 text-primary shrink-0" />
        <div>
          {
            isEditing ? (
              <>
                <h2 className="text-lg font-medium">Edit your business profile</h2>
                <p className="text-muted-foreground text-sm">Update your business information to ensure it's accurate and up-to-date.</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-medium">Create your business profile</h2>
                <p className="text-muted-foreground text-sm">Fill out all sections to showcase your business to potential customers.</p>
              </>
            )
          }
        </div>
      </div>
    </div>

      <Card className="shadow-md border-muted/40">
        <CardHeader className="bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{pageTitle}</CardTitle>
          </div>
          <CardDescription className="text-base">
            {isEditing 
              ? "Update your business information below"
              : "Fill out the form below to add your business to our directory"}
          </CardDescription>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Step navigation tabs */}
                <div className="hidden md:block relative">
                  <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center gap-2">
                        <div 
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200",
                            currentStep === index
                              ? "border-primary bg-primary text-primary-foreground"
                              : currentStep > index
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-muted-foreground/20 text-muted-foreground"
                          )}
                        >
                          {React.createElement(step.icon, { 
                            className: "h-5 w-5",
                            "aria-hidden": "true" 
                          })}
                        </div>
                        <div className="text-center">
                          <p 
                            className={cn(
                              "text-sm font-medium",
                              currentStep >= index ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step.name}
                          </p>
                          <p className="text-xs text-muted-foreground hidden lg:block">
                            {step.description}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={cn(
                              "absolute h-0.5 w-[calc(100%-120px)] left-[60px] hidden md:block",
                              "top-[88px] -z-10",
                              currentStep > index ? "bg-primary" : "bg-muted-foreground/20"
                            )}
                            style={{ 
                              left: `calc(50% + 60px)`, 
                              width: `calc((100% / ${steps.length - 1}) - 120px)`,
                              transform: `translateX(calc(-50% + ${index * (100 / (steps.length - 1))}%))`
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile step indicator */}
                <div className="flex items-center md:hidden">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="flex-shrink-0">
                      {React.createElement(steps[currentStep].icon, { 
                        className: "h-6 w-6 text-primary",
                        "aria-hidden": "true" 
                      })}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">{steps[currentStep].name}</h3>
                      <p className="text-xs text-muted-foreground">{steps[currentStep].description}</p>
                    </div>
                  </div>
                </div>

                {/* Form content box with slight styling */}
                <div className="bg-card p-6 rounded-lg border border-border/60 shadow-sm">
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Form Step {currentStep + 1}</AlertTitle>
                    <AlertDescription>
                      {steps[currentStep].description}
                    </AlertDescription>
                  </Alert>

                  {/* Form content - existing form fields remain unchanged */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 mb-1.5">
                              <FormLabel className="text-base">Business Name</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-80">
                                    <p>Enter the official name of your business as it should appear in the directory.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Store className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="Enter your business name" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 mb-1.5">
                              <FormLabel className="text-base">Description</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-80">
                                    <p>A compelling description helps customers understand what makes your business unique. Include your main products, services, and value proposition.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Textarea
                                  placeholder="Describe your business..."
                                  className="min-h-[120px] pl-10 pt-2"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="mt-2">
                              Provide a detailed description of your business and services (min. 10 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priceRange"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 mb-1.5">
                              <FormLabel className="text-base">Price Range</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-80">
                                    <p>Indicate the typical price range for your products or services.</p>
                                    <ul className="mt-2 ml-4 list-disc">
                                      <li>$ - Budget friendly</li>
                                      <li>$$ - Moderate pricing</li>
                                      <li>$$$ - High-end</li>
                                      <li>$$$$ - Premium/Luxury</li>
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                  <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Select price range" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">$ - Budget friendly</SelectItem>
                                    <SelectItem value="2">$$ - Moderate pricing</SelectItem>
                                    <SelectItem value="3">$$$ - High-end</SelectItem>
                                    <SelectItem value="4">$$$$ - Premium/Luxury</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormDescription className="mt-2">
                              Select a price range that best represents your business
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {selectedCategory && (
                        <>
                          <FormField
                            control={form.control}
                            name="subcategoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subcategory</FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedCategory.subcategories.map((subcategory) => (
                                        <SelectItem key={subcategory.id} value={subcategory.id}>
                                          {subcategory.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {selectedCategory.attributes.map((attribute) => (
                            <FormItem key={attribute.id}>
                              <FormLabel>{attribute.name}</FormLabel>
                              <FormControl>
                                <>
                                {attribute.type === "text" && (
                                  <Input
                                    type="text"
                                    placeholder={`Enter ${attribute.name.toLowerCase()}`}
                                    value={form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value as string || ""}
                                    onChange={(e) => {
                                      updateAttributeValue(attribute.id, e.target.value)
                                      form.trigger("attributes")
                                    }}
                                  />
                                )}
                                {attribute.type === "number" && (
                                  <Input
                                    type="number"
                                    placeholder={`Enter ${attribute.name.toLowerCase()}`}
                                    value={form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value as number || ""}
                                    onChange={(e) => {
                                      updateAttributeValue(attribute.id, e.target.value ? parseFloat(e.target.value) : 0)
                                      form.trigger("attributes")
                                    }}
                                  />
                                )}
                                {attribute.type === "boolean" && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value as boolean || false}
                                      onCheckedChange={(checked) => {
                                        updateAttributeValue(attribute.id, checked || false)
                                        form.trigger("attributes")
                                      }}
                                    />
                                    <label className="text-sm text-muted-foreground">Yes</label>
                                  </div>
                                )}
                                {(attribute.type === "select" || attribute.type === "multiselect") && attribute.options && (
                                  <div className="space-y-2">
                                    {attribute.options.map((option) => (
                                      <div key={option} className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={
                                            attribute.type === "select"
                                              ? form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value === option
                                              : (form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value as string[] || []).includes(option)
                                          }
                                          onCheckedChange={(checked) => {
                                            if (attribute.type === "select") {
                                              updateAttributeValue(attribute.id, checked ? option : "")
                                            } else {
                                              const currentValues = (form.getValues("attributes").find(attr => attr.attributeId === attribute.id)?.value as string[]) || []
                                              const newValues = checked
                                                ? [...currentValues, option]
                                                : currentValues.filter((v) => v !== option)
                                              updateAttributeValue(attribute.id, newValues)
                                            }
                                            form.trigger("attributes")
                                          }}
                                        />
                                        <label className="text-sm text-muted-foreground">{option}</label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                </> 
                              </FormControl>
                              {attribute.required && (
                                <FormDescription className="text-destructive">
                                  This field is required
                                </FormDescription>
                              )}
                              {attribute.description && (
                                <FormDescription>
                                  {attribute.description}
                                </FormDescription>
                              )}
                              {/* Show validation errors */}
                              {attribute.required && form.formState.errors.attributes && (
                                <FormMessage>
                                  {form.formState.errors.attributes.message}
                                </FormMessage>
                              )}
                            </FormItem>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Script
                        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCwxqsBze-6BFAf9jfR_8US5jU6ELEhSoE&libraries=places`}
                        strategy="lazyOnload"
                        async
                        onLoad={() => setScriptLoaded(true)}
                        onError={(e) => {
                          console.error("Error loading Google Maps script:", e)
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to load address autocomplete. Please try entering your address manually."
                          })
                        }}
                      />
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Address</FormLabel>
                              <FormControl>
                                <Input 
                                  id="address-input"
                                  placeholder="Start typing your business address..." 
                                  {...field}
                                  className="w-full"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    // Clear city, state, zip when user starts typing new address
                                    if (e.target.value !== field.value) {
                                      form.setValue('city', '');
                                      form.setValue('state', '');
                                      form.setValue('zip', '');
                                      setAddressComponents({
                                        street_address: '',
                                        city: '',
                                        state: '',
                                        zip: ''
                                      });
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Start typing and select your address from the dropdown. You must select an address to proceed.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Hidden fields for city, state, and zip */}
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem className="hidden">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Display extracted address components */}
                        {addressComponents.street_address && (
                          <div className="text-sm space-y-1">
                            <p><strong>Street:</strong> {addressComponents.street_address}</p>
                            <p><strong>City:</strong> {addressComponents.city}</p>
                            <p><strong>State:</strong> {addressComponents.state}</p>
                            <p><strong>ZIP:</strong> {addressComponents.zip}</p>
                          </div>
                        )}

                        {/* Rest of the contact form fields */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Enter business phone" {...field} />
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
                                <Input type="email" placeholder="Enter business email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="url" 
                                  placeholder="Enter business website (optional)" 
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormDescription>Enter your business website URL if you have one</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Business Hours</FormLabel>
                        <div className="space-y-4 mt-2">
                          {DAYS_OF_WEEK.map((day, index) => (
                            <FormField
                              key={day}
                              control={form.control}
                              name={`businessHours.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-4">
                                    <div className="w-24">
                                      <FormLabel>{day}</FormLabel>
                                    </div>
                                    <FormControl>
                                      <div className="flex items-center gap-4">
                                        <Checkbox
                                          checked={field.value.closed}
                                          onCheckedChange={(checked) => {
                                            field.onChange({
                                              ...field.value,
                                              closed: checked,
                                            })
                                          }}
                                        />
                                        <label>Closed</label>
                                        {!field.value.closed && (
                                          <>
                                            <Input
                                              type="time"
                                              value={field.value.open}
                                              onChange={(e) => {
                                                field.onChange({
                                                  ...field.value,
                                                  open: e.target.value,
                                                })
                                              }}
                                              className="w-32"
                                            />
                                            <span>to</span>
                                            <Input
                                              type="time"
                                              value={field.value.close}
                                              onChange={(e) => {
                                                field.onChange({
                                                  ...field.value,
                                                  close: e.target.value,
                                                })
                                              }}
                                              className="w-32"
                                            />
                                          </>
                                        )}
                                      </div>
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <FormLabel>Social Media (Optional)</FormLabel>
                        <FormDescription className="mt-1 mb-3">
                          Add your business social media profiles (all fields are optional)
                        </FormDescription>
                        <div className="space-y-4">
                          {SOCIAL_MEDIA_PLATFORMS.map((platform, index) => (
                            <div key={platform} className="flex items-center gap-4">
                              <div className="w-24">
                                <FormLabel className="text-muted-foreground">{platform}</FormLabel>
                              </div>
                              <Input
                                type="url"
                                placeholder={`Enter ${platform} URL (optional)`}
                                value={form.getValues(`socialMedia.${index}.url`) || ""}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  form.setValue(`socialMedia.${index}`, {
                                    platform,
                                    url: value
                                  });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Images</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    const files = e.target.files
                                    if (files) {
                                      // Limit to 5 images total
                                      const remainingSlots = 5 - field.value.length;
                                      if (remainingSlots <= 0) {
                                        toast({
                                          variant: "destructive",
                                          title: "Maximum images reached",
                                          description: "You can upload a maximum of 5 images."
                                        });
                                        return;
                                      }
                                      
                                      const fileArray = Array.from(files).slice(0, remainingSlots);
                                      
                                      // Show loading state
                                      setSubmitting(true);
                                      
                                      // Convert files to data URLs with compression
                                      const filePromises = fileArray.map(file => {
                                        return new Promise<string>((resolve, reject) => {
                                          // Check file size (max 5MB)
                                          if (file.size > 5 * 1024 * 1024) {
                                            toast({
                                              variant: "destructive",
                                              title: "File too large",
                                              description: `${file.name} exceeds the 5MB limit.`
                                            });
                                            reject(new Error("File too large"));
                                            return;
                                          }
                                          
                                          const reader = new FileReader();
                                          reader.onload = (e) => {
                                            if (e.target?.result) {
                                              // Create an image for compression
                                              const img = new Image();
                                              img.onload = () => {
                                                // Create canvas for compression
                                                const canvas = document.createElement('canvas');
                                                let width = img.width;
                                                let height = img.height;
                                                
                                                // Resize if too large (max dimension 1200px)
                                                const MAX_DIMENSION = 1200;
                                                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                                                  if (width > height) {
                                                    height = Math.round(height * (MAX_DIMENSION / width));
                                                    width = MAX_DIMENSION;
                                                  } else {
                                                    width = Math.round(width * (MAX_DIMENSION / height));
                                                    height = MAX_DIMENSION;
                                                  }
                                                }
                                                
                                                canvas.width = width;
                                                canvas.height = height;
                                                
                                                // Draw and compress
                                                const ctx = canvas.getContext('2d');
                                                ctx?.drawImage(img, 0, 0, width, height);
                                                
                                                // Convert to JPEG with quality 0.8
                                                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                                resolve(compressedDataUrl);
                                              };
                                              img.onerror = () => {
                                                reject(new Error("Failed to load image for compression"));
                                              };
                                              img.src = e.target.result as string;
                                            } else {
                                              reject(new Error("Failed to read file"));
                                            }
                                          };
                                          reader.onerror = () => reject(reader.error);
                                          reader.readAsDataURL(file);
                                        });
                                      });
                                      
                                      // When all files are converted to data URLs
                                      Promise.all(filePromises)
                                        .then(dataUrls => {
                                          field.onChange([...field.value, ...dataUrls]);
                                          setSubmitting(false);
                                        })
                                        .catch(error => {
                                          console.error("Error processing images:", error);
                                          setSubmitting(false);
                                        });
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload images of your business (max 5 images)
                            </FormDescription>
                            <div className="grid grid-cols-5 gap-4 mt-4">
                              {field.value.map((url, index) => (
                                <div key={index} className="relative aspect-square">
                                  <img
                                    src={url}
                                    alt={`Business image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1"
                                    onClick={() => {
                                      field.onChange(field.value.filter((_, i) => i !== index))
                                    }}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any additional information about your business..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include any other relevant information about your business
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-3">
                      {currentStep < steps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="gap-2"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={onSubmit}
                          disabled={submitting}
                          className="gap-2"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              {submitButtonText}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

