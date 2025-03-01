"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// UI Components
import { ChevronLeft, ChevronRight } from "lucide-react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Data and Types
import { getCategories, getCategoryById } from "@/lib/data"
import type { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

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
    fields: ["address", "phone", "email", "website"],
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

const SOCIAL_MEDIA_PLATFORMS = [
  "Facebook",
  "Instagram",
  "Twitter",
  "LinkedIn",
  "YouTube",
  "TikTok",
]

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
  website: z.string().url("Invalid website URL").optional(),

  // Hours & Social
  businessHours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })),
  socialMedia: z.array(z.object({
    platform: z.string(),
    url: z.string().url("Invalid URL"),
  })).optional(),

  // Additional Info
  images: z.array(z.string()),
  additionalInfo: z.string().optional(),
})

export default function AddBusinessPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const router = useRouter()

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
      phone: "",
      email: "",
      website: "",
      businessHours: DAYS_OF_WEEK.map(day => ({
        day,
        open: "09:00",
        close: "17:00",
        closed: false,
      })),
      socialMedia: [],
      images: [],
      additionalInfo: "",
    },
  })

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  useEffect(() => {
    const categoryId = form.watch("categoryId")
    if (categoryId) {
      const category = getCategoryById(categoryId)
      setSelectedCategory(category || null)
      
      if (category) {
        const initialAttributes = category.attributes.map(attr => ({
          attributeId: attr.name,
          value: attr.type === "boolean" ? false :
                 attr.type === "multiselect" ? [] :
                 ""
        }))
        form.setValue("attributes", initialAttributes)
      }
    }
  }, [form.watch("categoryId"), form])

  // Function to validate current step fields
  const validateCurrentStep = async () => {
    const currentFields = steps[currentStep].fields
    const currentValues = form.getValues()
    
    if (currentStep === 1 && selectedCategory) {
      const attributeValues = form.getValues("attributes")
      const hasRequiredAttributes = selectedCategory.attributes
        .filter(attr => attr.required)
        .every(attr => {
          const attrValue = attributeValues.find(a => a.attributeId === attr.name)?.value
          return attrValue !== undefined && attrValue !== "" && attrValue !== false && 
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentStep < steps.length - 1) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        setCurrentStep(currentStep + 1)
      } else {
        // Trigger validation for current step fields
        const currentFields = steps[currentStep].fields
        await form.trigger(currentFields as Array<keyof z.infer<typeof formSchema>>)
        
        // If we're on the category step, manually validate attributes
        if (currentStep === 1 && selectedCategory) {
          const attributeValues = form.getValues("attributes")
          selectedCategory.attributes
            .filter(attr => attr.required)
            .forEach(attr => {
              const attrValue = attributeValues.find(a => a.attributeId === attr.name)?.value
              if (!attrValue || attrValue === "" || attrValue === false || 
                  (Array.isArray(attrValue) && attrValue.length === 0)) {
                form.setError(`attributes.${attr.name}` as `attributes.${string}`, {
                  type: "required",
                  message: `${attr.name} is required`
                })
              }
            })
        }
      }
    } else {
      // Handle final submission
      const isValid = await validateCurrentStep()
      if (isValid) {
        try {
          // Validate entire form before final submission
          await form.trigger()
          const values = form.getValues()
          console.log("Form submitted:", values)
          // TODO: Submit to API
          router.push("/businesses")
        } catch (error) {
          console.error("Form validation failed:", error)
        }
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/businesses">Businesses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Business</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add Your Business</CardTitle>
          <CardDescription>
            Complete the following steps to add your business to our directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center space-y-2",
                    currentStep >= index ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                      currentStep >= index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm hidden md:block">{step.name}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute top-1/2 h-1 w-full bg-muted-foreground/20 -translate-y-1/2" />
              <div
                className="absolute top-1/2 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <FormItem key={attribute.name}>
                          <FormLabel>{attribute.name}</FormLabel>
                          <FormControl>
                            <>
                            {attribute.type === "text" && (
                              <Input
                                type="text"
                                value={form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value as string || ""}
                                onChange={(e) => updateAttributeValue(attribute.name, e.target.value)}
                              />
                            )}
                            {attribute.type === "number" && (
                              <Input
                                type="number"
                                value={form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value as number || ""}
                                onChange={(e) => updateAttributeValue(attribute.name, parseFloat(e.target.value))}
                              />
                            )}
                            {attribute.type === "boolean" && (
                              <Checkbox
                                checked={form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value as boolean || false}
                                onCheckedChange={(checked) => updateAttributeValue(attribute.name, checked)}
                              />
                            )}
                            {(attribute.type === "select" || attribute.type === "multiselect") && (
                              <div className="space-y-2">
                                {attribute.options?.map((option) => (
                                  <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={
                                        attribute.type === "select"
                                          ? form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value === option
                                          : (form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value as string[] || []).includes(option)
                                      }
                                      onCheckedChange={(checked) => {
                                        if (attribute.type === "select") {
                                          updateAttributeValue(attribute.name, checked ? option : "")
                                        } else {
                                          const currentValues = (form.getValues("attributes").find(attr => attr.attributeId === attribute.name)?.value as string[]) || []
                                          const newValues = checked
                                            ? [...currentValues, option]
                                            : currentValues.filter((v) => v !== option)
                                          updateAttributeValue(attribute.name, newValues)
                                        }
                                      }}
                                    />
                                    <label>{option}</label>
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
                        </FormItem>
                      ))}
                    </>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="Enter business website" {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                    <FormLabel>Social Media</FormLabel>
                    <div className="space-y-4 mt-2">
                      {SOCIAL_MEDIA_PLATFORMS.map((platform, index) => (
                        <FormField
                          key={platform}
                          control={form.control}
                          name={`socialMedia.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-4">
                                <div className="w-24">
                                  <FormLabel>{platform}</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder={`Enter ${platform} URL`}
                                    value={field.value?.url || ""}
                                    onChange={(e) => {
                                      field.onChange({
                                        platform,
                                        url: e.target.value,
                                      })
                                    }}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
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
                                  const urls = Array.from(files).map(file =>
                                    URL.createObjectURL(file)
                                  )
                                  field.onChange([...field.value, ...urls])
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

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={async () => {
                    if (currentStep < steps.length - 1) {
                      const isValid = await validateCurrentStep()
                      if (isValid) {
                        setCurrentStep(currentStep + 1)
                      } else {
                        // Trigger validation for current step fields
                        const currentFields = steps[currentStep].fields
                        await form.trigger(currentFields as Array<keyof z.infer<typeof formSchema>>)
                        
                        // If we're on the category step, manually validate attributes
                        if (currentStep === 1 && selectedCategory) {
                          const attributeValues = form.getValues("attributes")
                          selectedCategory.attributes
                            .filter(attr => attr.required)
                            .forEach(attr => {
                              const attrValue = attributeValues.find(a => a.attributeId === attr.name)?.value
                              if (!attrValue || attrValue === "" || attrValue === false || 
                                  (Array.isArray(attrValue) && attrValue.length === 0)) {
                                form.setError(`attributes.${attr.name}` as `attributes.${string}`, {
                                  type: "required",
                                  message: `${attr.name} is required`
                                })
                              }
                            })
                        }
                      }
                    } else {
                      // Handle final submission
                      const isValid = await validateCurrentStep()
                      if (isValid) {
                        try {
                          // Validate entire form before final submission
                          await form.trigger()
                          const values = form.getValues()
                          console.log("Form submitted:", values)
                          // TODO: Submit to API
                          router.push("/businesses")
                        } catch (error) {
                          console.error("Form validation failed:", error)
                        }
                      }
                    }
                  }}
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Add Business"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

