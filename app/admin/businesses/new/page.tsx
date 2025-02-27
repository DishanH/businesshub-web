"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getCategories, getCategoryById, createBusiness } from "@/lib/data"
import type { Category, Attribute, Subcategory, Business } from "@/lib/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminAddBusinessPage() {
  const router = useRouter()
  const [business, setBusiness] = useState<Omit<Business, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    priceRange: 1,
    attributes: [],
    images: [],
    active: true,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([])
  const [attributeValues, setAttributeValues] = useState<Record<string, string | boolean | string[]>>({})

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  useEffect(() => {
    if (business.categoryId) {
      const category = getCategoryById(business.categoryId)
      setSelectedCategory(category || null)
      setSubcategoryIds([])
      setAttributeValues({})
    }
  }, [business.categoryId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBusiness = {
      ...business,
      subcategoryId: subcategoryIds.join(","),
      attributes: Object.entries(attributeValues).map(([key, value]) => ({ attributeId: key, value })),
    }
    createBusiness(newBusiness)
    router.push("/admin/businesses")
  }

  const renderAttributeInput = (attribute: Attribute) => {
    switch (attribute.type) {
      case "text":
      case "number":
        return (
          <Input
            type={attribute.type}
            value={attributeValues[attribute.name] as string}
            onChange={(e) => setAttributeValues({ ...attributeValues, [attribute.name]: e.target.value })}
            required={attribute.required}
          />
        )
      case "boolean":
        return (
          <Checkbox
            checked={attributeValues[attribute.name] as boolean}
            onCheckedChange={(checked) => setAttributeValues({ ...attributeValues, [attribute.name]: checked })}
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
                  checked={
                    attribute.type === "select"
                      ? attributeValues[attribute.name] === option
                      : (attributeValues[attribute.name] as string[])?.includes(option)
                  }
                  onCheckedChange={(checked) => {
                    if (attribute.type === "select") {
                      setAttributeValues({ ...attributeValues, [attribute.name]: checked ? option : "" })
                    } else {
                      const currentValues = (attributeValues[attribute.name] as string[]) || []
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((value) => value !== option)
                      setAttributeValues({ ...attributeValues, [attribute.name]: newValues })
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

  const BusinessPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle>{business.name || "Business Name"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{business.description || "Business Description"}</p>
        <p className="text-sm">
          <strong>Category:</strong> {selectedCategory?.name || "Not selected"}
        </p>
        <p className="text-sm">
          <strong>Subcategories:</strong>{" "}
          {subcategoryIds.map((id) => selectedCategory?.subcategories.find((s) => s.id === id)?.name).join(", ") ||
            "None selected"}
        </p>
        <p className="text-sm">
          <strong>Address:</strong> {business.address || "Not provided"}
        </p>
        <p className="text-sm">
          <strong>Phone:</strong> {business.phone || "Not provided"}
        </p>
        <p className="text-sm">
          <strong>Email:</strong> {business.email || "Not provided"}
        </p>
        <p className="text-sm">
          <strong>Website:</strong> {business.website || "Not provided"}
        </p>
        <p className="text-sm">
          <strong>Price Range:</strong> {"$".repeat(business.priceRange)}
        </p>
        <p className="text-sm">
          <strong>Status:</strong> {business.active ? "Active" : "Inactive"}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/businesses">Businesses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Business</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Add New Business</h1>

      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={business.name}
                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                placeholder="Enter business name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={business.description}
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                placeholder="Enter business description"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={business.categoryId}
                onValueChange={(value) => setBusiness({ ...business, categoryId: value })}
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
                  {selectedCategory.subcategories.map((subcategory: Subcategory) => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subcategory-${subcategory.id}`}
                        checked={subcategoryIds.includes(subcategory.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSubcategoryIds([...subcategoryIds, subcategory.id])
                          } else {
                            setSubcategoryIds(subcategoryIds.filter((id) => id !== subcategory.id))
                          }
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
                value={business.address}
                onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                placeholder="Enter business address"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={business.phone}
                onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                placeholder="Enter business phone"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={business.email}
                onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                placeholder="Enter business email"
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={business.website}
                onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                placeholder="Enter business website"
              />
            </div>
            <div>
              <Label htmlFor="priceRange">Price Range</Label>
              <Select
                value={business.priceRange.toString()}
                onValueChange={(value) => setBusiness({ ...business, priceRange: Number.parseInt(value) })}
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
                checked={business.active}
                onCheckedChange={(checked) => setBusiness({ ...business, active: checked as boolean })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <Button type="submit">Create Business</Button>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <BusinessPreview />
        </TabsContent>
      </Tabs>
    </div>
  )
}

