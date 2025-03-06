"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { AttributesForm } from "../components/attributes-form"
import { SubcategoriesForm } from "../components/subcategories-form"
import { toast } from "sonner"
import { fetchCategoryById, updateCategory } from "../actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Validation schemas
const subcategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

const attributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  description: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional(),
  subcategories: z.array(subcategorySchema),
  attributes: z.array(attributeSchema),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"basic" | "subcategories" | "attributes">("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      subcategories: [],
      attributes: [],
      active: true,
    },
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const { success, data, error } = await fetchCategoryById(params.id)
        
        if (success && data) {
          // Transform the data to match our form schema
          form.reset({
            name: data.name,
            description: data.description,
            slug: data.slug,
            icon: data.icon,
            subcategories: data.subcategories.map((sub: any) => ({
              id: sub.id,
              name: sub.name,
              description: sub.description,
              active: sub.active
            })) || [],
            attributes: data.attributes.map((attr: any) => ({
              id: attr.id,
              name: attr.name,
              type: attr.type as "text" | "number" | "boolean" | "select" | "multiselect",
              options: attr.options,
              required: attr.required,
              description: attr.description
            })) || [],
            active: data.active,
          })
        } else {
          toast.error(`Failed to load category: ${error}`)
          router.push("/admin/categories")
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
        console.error(error)
        router.push("/admin/categories")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategory()
  }, [params.id, form, router])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const result = await updateCategory(params.id, data)
      
      if (result.success) {
        toast.success("Category updated successfully")
        router.push("/admin/categories")
      } else {
        toast.error(`Failed to update category: ${result.error}`)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>
        
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex border-b mb-4">
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeSection === "basic" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveSection("basic")}
            >
              Basic Information
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeSection === "subcategories" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveSection("subcategories")}
            >
              Subcategories
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium ${
                activeSection === "attributes" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveSection("attributes")}
            >
              Attributes
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {activeSection === "basic" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>Provide a detailed description of the category.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>URL-friendly version of the name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {activeSection === "subcategories" && (
                <SubcategoriesForm form={form} />
              )}
              
              {activeSection === "attributes" && (
                <AttributesForm form={form} />
              )}
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

