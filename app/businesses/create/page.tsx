"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"

// UI Components
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
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

// Data and Types
import { getActiveCategories } from "@/app/actions/categories"
import { addBusiness } from "@/app/businesses/create/actions"
import { updateBusiness } from "@/app/businesses/update/actions"
import { ClientCategory } from "@/app/types/categories"
import { cn } from "@/lib/utils"
import type { Business } from "@/app/businesses/actions/types"

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
    fields: ["name", "description", "priceRange"],
  },
  {
    id: "category",
    name: "Category & Attributes",
    fields: ["categoryId", "subcategoryId", "attributes"],
  },
  {
    id: "contact",
    name: "Contact & Location",
    fields: ["address", "city", "state", "zip", "phone", "email", "website"],
  },
  {
    id: "hours",
    name: "Hours & Social",
    fields: ["businessHours", "socialMedia"],
  },
  {
    id: "additional",
    name: "Additional Info",
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
        
        if (!success || error) {
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
    const currentValues = form.getValues()
    
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
        return false
      }
    }

    // Create a subset of the schema for current step
    const currentSchema = z.object(
      Object.fromEntries(
        currentFields.map(field => [
          field,
          formSchema.shape[field as keyof typeof formSchema.shape]
        ])
      )
    )

    try {
      await currentSchema.parseAsync(
        Object.fromEntries(
          currentFields.map(field => [field, currentValues[field as keyof typeof currentValues]])
        )
      )
      return true
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors)
      }
      return false
    }
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
  }

  const onSubmit = async () => {
    try {
      if (currentStep < steps.length - 1) {
        const isValid = await validateCurrentStep()
        if (isValid) {
          setCurrentStep(currentStep + 1)
        } else {
          // Trigger validation for current step fields
          const currentFields = steps[currentStep].fields
          await form.trigger(currentFields as Array<keyof z.infer<typeof formSchema>>)
        }
      } else {
        // Handle final submission
        const isValid = await validateCurrentStep()
        if (isValid) {
          try {
            setSubmitting(true)
            // Validate entire form before final submission
            const isFormValid = await form.trigger()
            if (!isFormValid) {
              toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please check all required fields."
              })
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
            console.log("Submission result:", result)
            
            if (result.success) {
              toast({
                title: "Success!",
                description: isEditing 
                  ? "Your business has been updated successfully."
                  : "Your business has been added successfully."
              })
              router.push("/businesses/manage")
            } else {
              // Handle validation errors if any
              if (result.validationErrors) {
                result.validationErrors.forEach((error) => {
                  if (typeof error.path[0] === 'string') {
                    form.setError(error.path[0] as keyof z.infer<typeof formSchema>, {
                      type: "manual",
                      message: error.message
                    })
                  }
                })
                toast({
                  variant: "destructive",
                  title: "Validation Error",
                  description: "Please check the form for errors."
                })
              } else {
                console.error("Error submitting form:", result.error)
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: result.error || "Failed to add business. Please try again."
                })
              }
            }
          } catch (error: unknown) {
            console.error("Form submission failed:", error)
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to submit form. Please try again."
            })
          } finally {
            setSubmitting(false)
          }
        } else {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please check all required fields in this step."
          })
        }
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
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/businesses/manage">My Businesses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update your business information below"
              : "Fill out the form below to add your business to our directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Step indicator */}
                <div className="flex items-center space-x-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                          currentStep === index
                            ? "border-primary bg-primary text-primary-foreground"
                            : currentStep > index
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-muted-foreground/20 text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 w-10",
                            currentStep > index ? "bg-primary" : "bg-muted-foreground/20"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {currentStep === 0 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business name" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of your business and services
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
                          <FormLabel>Price Range</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select price range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">$</SelectItem>
                                <SelectItem value="2">$$</SelectItem>
                                <SelectItem value="3">$$$</SelectItem>
                                <SelectItem value="4">$$$$</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Select a price range for your business
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

                <div className="flex justify-between mt-8">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <Button 
                    type="button"
                    className="ml-auto"
                    disabled={submitting}
                    onClick={onSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {currentStep === steps.length - 1 ? "Submitting..." : "Next"}
                      </>
                    ) : (
                      <>
                        {currentStep === steps.length - 1 ? submitButtonText : "Next"}
                        {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

