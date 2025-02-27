"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getBusinessPostById, updateBusinessPost, getCategories, getCategoryById } from "@/lib/data"
import type { BusinessPost, Category, Attribute } from "@/lib/types"

export default function EditBusinessPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BusinessPost | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchedPost = getBusinessPostById(params.id)
    if (fetchedPost) {
      setPost(fetchedPost)
      setCategories(getCategories())
      setSelectedCategory(getCategoryById(fetchedPost.categoryId))
    } else {
      router.push("/admin/business-posts")
    }
  }, [params.id, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (post) {
      updateBusinessPost(post.id, post)
      router.push("/admin/business-posts")
    }
  }

  const handleCancel = () => {
    router.push("/admin/business-posts")
  }

  const renderAttributeInput = (attribute: Attribute) => {
    const value = post?.attributes.find((attr) => attr.attributeId === attribute.name)?.value

    switch (attribute.type) {
      case "text":
      case "number":
        return (
          <Input
            type={attribute.type}
            value={value as string}
            onChange={(e) => handleAttributeChange(attribute.name, e.target.value)}
            required={attribute.required}
          />
        )
      case "boolean":
        return (
          <Checkbox
            checked={value as boolean}
            onCheckedChange={(checked) => handleAttributeChange(attribute.name, checked)}
          />
        )
      case "select":
      case "multiselect":
        return (
          <div className="space-y-2">
            {attribute.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${attribute.name}-${option}`}
                  checked={attribute.type === "select" ? value === option : (value as string[])?.includes(option)}
                  onCheckedChange={(checked) => {
                    if (attribute.type === "select") {
                      handleAttributeChange(attribute.name, checked ? option : "")
                    } else {
                      const currentValues = (value as string[]) || []
                      const newValues = checked ? [...currentValues, option] : currentValues.filter((v) => v !== option)
                      handleAttributeChange(attribute.name, newValues)
                    }
                  }}
                />
                <Label htmlFor={`${attribute.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const handleAttributeChange = (attributeId: string, value: string | boolean | string[]) => {
    if (post) {
      const updatedAttributes = post.attributes.map((attr) =>
        attr.attributeId === attributeId ? { ...attr, value } : attr,
      )
      setPost({ ...post, attributes: updatedAttributes })
    }
  }

  if (!post) {
    return <div>Loading...</div>
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
            <BreadcrumbLink href="/admin/business-posts">Business Posts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Edit Business Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={post.businessName}
            onChange={(e) => setPost({ ...post, businessName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={post.categoryId}
            onValueChange={(value) => {
              setPost({ ...post, categoryId: value })
              setSelectedCategory(getCategoryById(value))
            }}
          >
            <SelectTrigger id="category">
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
        </div>
        {selectedCategory && (
          <div>
            <Label>Subcategories</Label>
            <div className="space-y-2">
              {selectedCategory.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${subcategory.id}`}
                    checked={post.subcategoryIds.includes(subcategory.id)}
                    onCheckedChange={(checked) => {
                      const updatedSubcategoryIds = checked
                        ? [...post.subcategoryIds, subcategory.id]
                        : post.subcategoryIds.filter((id) => id !== subcategory.id)
                      setPost({ ...post, subcategoryIds: updatedSubcategoryIds })
                    }}
                  />
                  <Label htmlFor={`subcategory-${subcategory.id}`}>{subcategory.name}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedCategory &&
          selectedCategory.attributes.map((attribute) => (
            <div key={attribute.name}>
              <Label htmlFor={attribute.name}>{attribute.name}</Label>
              {renderAttributeInput(attribute)}
            </div>
          ))}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={post.address}
            onChange={(e) => setPost({ ...post, address: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={post.phone} onChange={(e) => setPost({ ...post, phone: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={post.email}
            onChange={(e) => setPost({ ...post, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" value={post.website} onChange={(e) => setPost({ ...post, website: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="priceRange">Price Range</Label>
          <Select
            value={post.priceRange.toString()}
            onValueChange={(value) => setPost({ ...post, priceRange: Number.parseInt(value) })}
          >
            <SelectTrigger id="priceRange">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">$</SelectItem>
              <SelectItem value="2">$$</SelectItem>
              <SelectItem value="3">$$$</SelectItem>
              <SelectItem value="4">$$$$</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={post.active}
            onCheckedChange={(checked) => setPost({ ...post, active: checked as boolean })}
          />
          <Label htmlFor="active">Active</Label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Update Post</Button>
        </div>
      </form>
    </div>
  )
}

