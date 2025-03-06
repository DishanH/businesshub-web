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

// Define the schema first
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState("basic")
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      icon: "",
      subcategories: [],
      attributes: [],
      active: true,
    },
  })

  useEffect(() => {
    async function loadCategory() {
      try {
        setIsLoading(true)
        const response = await fetchCategoryById(params.id)
        
        if (!response.success) {
          toast.error(`Failed to load category: ${response.error || 'Unknown error'}`)
          router.push("/admin/categories")
          return
        }
        
        if (!response.data) {
          toast.error('Category not found')
          router.push("/admin/categories")
          return
        }
        
        const data = response.data
        
        form.reset({
          name: data.name || "",
          description: data.description || "",
          slug: data.slug || "",
          icon: data.icon || "",
          subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
          attributes: Array.isArray(data.attributes) ? data.attributes : [],
          active: Boolean(data.active),
        })
      } catch (error) {
        console.error('Error loading category:', error)
        toast.error("An unexpected error occurred while loading the category")
        router.push("/admin/categories")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCategory()
  }, [params.id, router, form])

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
        <div className="flex justify-center items-center h-64">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <FormDescription>Brief description of the category.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Activate or deactivate this category
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="accent-primary h-5 w-5"
                          />
                        </FormControl>
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

