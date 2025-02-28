"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const steps = [
  {
    id: "personal",
    name: "Personal Information",
    fields: ["firstName", "lastName", "email", "phone", "address", "photo"],
  },
  {
    id: "qualifications",
    name: "Qualifications & Experience",
    fields: ["experience", "education", "certifications", "languages"],
  },
  {
    id: "services",
    name: "Services & Availability",
    fields: ["specialties", "availability", "ageGroups", "hourlyRate"],
  },
  {
    id: "profile",
    name: "Profile Details",
    fields: ["bio", "additionalInfo"],
  },
]

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  photo: z.string().optional(),

  // Qualifications & Experience
  experience: z.string().min(1, "Years of experience is required"),
  education: z.string().min(2, "Education details are required"),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).min(1, "At least one language is required"),

  // Services & Availability
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  availability: z.array(z.string()).min(1, "Select at least one availability option"),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),

  // Profile Details
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  additionalInfo: z.string().optional(),
})

const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
]

const SPECIALTIES = [
  "Newborn Care",
  "Toddler Care",
  "Special Needs",
  "Educational Activities",
  "Meal Planning",
  "Homework Help",
  "Arts & Crafts",
  "Music Education",
  "First Aid Certified",
  "CPR Certified",
]

const AGE_GROUPS = [
  "Newborn (0-12 months)",
  "Toddler (1-3 years)",
  "Preschool (3-5 years)",
  "School Age (5-12 years)",
  "Teenagers (12+ years)",
]

const AVAILABILITY = [
  "Full-time",
  "Part-time",
  "Weekends",
  "Evenings",
  "Early Mornings",
  "Overnight",
  "Flexible",
]

export default function CreateProfilePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      photo: "",
      experience: "",
      education: "",
      certifications: [],
      languages: [],
      specialties: [],
      availability: [],
      ageGroups: [],
      hourlyRate: "",
      bio: "",
      additionalInfo: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Handle final submission
      console.log(values)
      // TODO: Submit to API
      router.push("/nanny-services")
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
            <BreadcrumbLink href="/nanny-services">Nanny Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Nanny Profile</CardTitle>
          <CardDescription>
            Complete the following steps to create your professional nanny profile
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
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
                            <Input type="tel" placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  // Handle file upload
                                  field.onChange(URL.createObjectURL(file))
                                }
                              }}
                            />
                            {field.value && (
                              <img
                                src={field.value}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a professional photo of yourself
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
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter years of experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your educational background"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List your relevant certifications"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any childcare-related certifications, first aid, CPR, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((language) => (
                              <div key={language} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(language)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), language]
                                      : field.value?.filter((l) => l !== language) || []
                                    field.onChange(updatedValue)
                                  }}
                                />
                                <label className="text-sm">{language}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialties</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {SPECIALTIES.map((specialty) => (
                              <div key={specialty} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(specialty)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), specialty]
                                      : field.value?.filter((s) => s !== specialty) || []
                                    field.onChange(updatedValue)
                                  }}
                                />
                                <label className="text-sm">{specialty}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ageGroups"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Groups</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {AGE_GROUPS.map((ageGroup) => (
                              <div key={ageGroup} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(ageGroup)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), ageGroup]
                                      : field.value?.filter((a) => a !== ageGroup) || []
                                    field.onChange(updatedValue)
                                  }}
                                />
                                <label className="text-sm">{ageGroup}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABILITY.map((time) => (
                              <div key={time} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value?.includes(time)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), time]
                                      : field.value?.filter((t) => t !== time) || []
                                    field.onChange(updatedValue)
                                  }}
                                />
                                <label className="text-sm">{time}</label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter your hourly rate" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your desired hourly rate in dollars
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a brief description about yourself..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell families about yourself, your experience, and why you love being a nanny
                        </FormDescription>
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
                            placeholder="Any additional information you'd like to share..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any other relevant information or special circumstances
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
                <Button type="submit">
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Create Profile"
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