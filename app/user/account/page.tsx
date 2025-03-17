"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile, uploadAvatar } from "./actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Define the form schema with Zod
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      avatarUrl: "",
    },
  })

  // Fetch user data and profile on component mount
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/sign-in")
          return
        }
        
        setUser(user)
        
        // Set avatar preview from user metadata
        if (user.user_metadata?.avatar_url) {
          setAvatarPreview(user.user_metadata.avatar_url)
        }
        
        // Fetch user profile data
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()
        
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data. Please try again.",
            variant: "destructive",
          })
        }
        
        if (profile) {
          // Set form values from profile data
          form.reset({
            fullName: profile.full_name || user.user_metadata?.name || "",
            phoneNumber: profile.phone_number || "",
            address: profile.address || "",
            avatarUrl: user.user_metadata?.avatar_url || "",
          })
        } else {
          // Set form values from user metadata if available
          form.reset({
            fullName: user.user_metadata?.name || "",
            phoneNumber: "",
            address: "",
            avatarUrl: user.user_metadata?.avatar_url || "",
          })
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [router, supabase, form])

  // Handle avatar file change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should not exceed 2MB",
          variant: "destructive",
        })
        return
      }
      
      setAvatarFile(file)
      const objectUrl = URL.createObjectURL(file)
      setAvatarPreview(objectUrl)
    }
  }

  // Handle form submission
  async function onSubmit(values: ProfileFormValues) {
    if (!user) return
    
    startTransition(async () => {
      try {
        let avatarUrl = values.avatarUrl
        
        // Upload avatar if a new file was selected
        if (avatarFile) {
          const uploadResult = await uploadAvatar(user.id, avatarFile)
          
          if (!uploadResult.success) {
            toast({
              title: "Error",
              description: uploadResult.error || "Failed to upload image",
              variant: "destructive",
            })
            return
          }
          
          avatarUrl = uploadResult.url
        }
        
        // Update profile with server action
        const result = await updateProfile({
          ...values,
          avatarUrl,
        })
        
        if (result.success) {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          })
          
          // Refresh the page to show updated data
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update profile",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error saving profile:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb Navigation - Full width */}
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/user">User</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Your Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and how it appears across Business Hub.
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg self-start">
              {/* <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={avatarPreview || ""} alt={form.getValues().fullName} />
                <AvatarFallback>
                  {form.getValues().fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar> */}
              <div className="flex flex-col">
                {/* <span className="text-sm font-medium">{user.email}</span> */}
                <span className="text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Full width separator */}
      <Separator className="bg-gradient-to-r from-border via-primary/20 to-border mb-8" />
      
      <div className="mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  This will be displayed on your profile and across the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-28 w-28 border-4 border-background shadow-xl group-hover:border-primary/20 transition-all duration-300">
                      <AvatarImage src={avatarPreview || ""} alt={form.getValues().fullName} />
                      <AvatarFallback className="text-3xl bg-primary/5">
                        {form.getValues().fullName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <label htmlFor="avatar-upload" className="cursor-pointer w-full h-full flex items-center justify-center text-xs font-medium">
                        Change
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended size: 300x300px. Max size: 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="border-border/40 focus-visible:ring-primary/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            {...field} 
                            className="border-border/40 focus-visible:ring-primary/30"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          This will only be used for important notifications.
                        </FormDescription>
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
                      <FormLabel className="text-foreground/80">Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your address" 
                          className="resize-none min-h-[100px] border-border/40 focus-visible:ring-primary/30" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Your address will be used for location-based services.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end py-4 px-6 bg-muted/20 border-t border-border/30">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-primary/20 group-hover:translate-x-0"></span>
                  <span className="relative flex items-center">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Saving..." : "Save Changes"}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}

