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
            fullName: profile.full_name || "",
            phoneNumber: profile.phone_number || "",
            address: profile.address || "",
            avatarUrl: profile.avatar_url || "",
          })
          
          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url)
          }
        } else {
          // Set form values from user metadata if available
          form.reset({
            fullName: user.user_metadata?.name || "",
            phoneNumber: "",
            address: "",
            avatarUrl: user.user_metadata?.avatar_url || "",
          })
          
          if (user.user_metadata?.avatar_url) {
            setAvatarPreview(user.user_metadata.avatar_url)
          }
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
    <div className="container max-w-3xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and how it appears across Business Hub.
          </p>
        </div>
        
        <Separator />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  This will be displayed on your profile and across the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || ""} alt={form.getValues().fullName} />
                    <AvatarFallback className="text-2xl">
                      {form.getValues().fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Input
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
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will only be used for important notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your address" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Your address will be used for location-based services.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}

