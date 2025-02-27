"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Star } from "lucide-react"
import { getCategories, getCategoryById } from "@/lib/data"
import type { Category, Attribute, Subcategory } from "@/lib/types"

export default function AddBusinessPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [attributeValues, setAttributeValues] = useState<Record<string, string | boolean | string[]>>({})
  const [priceRange, setPriceRange] = useState<number>(1)

  useEffect(() => {
    setCategories(getCategories())
  }, [])

  useEffect(() => {
    if (categoryId) {
      const category = getCategoryById(categoryId)
      setSelectedCategory(category || null)
      setSubcategoryIds([])
      setAttributeValues({})
    }
  }, [categoryId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement business submission logic
    console.log("Business submitted:", {
      name,
      description,
      categoryId,
      subcategoryIds,
      location,
      address,
      phone,
      website,
      imagePreview,
      attributeValues,
      priceRange,
    })
    // Reset form
    setName("")
    setDescription("")
    setCategoryId("")
    setSubcategoryIds([])
    setLocation("")
    setAddress("")
    setPhone("")
    setWebsite("")
    setImagePreview(null)
    setAttributeValues({})
    setPriceRange(1)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id={attribute.name}
              checked={attributeValues[attribute.name] as boolean}
              onCheckedChange={(checked) => setAttributeValues({ ...attributeValues, [attribute.name]: checked })}
            />
            <Label htmlFor={attribute.name}>{attribute.name}</Label>
          </div>
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

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Add a New Business</h1>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="category">Category & Attributes</TabsTrigger>
            <TabsTrigger value="contact">Contact & Location</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter business description"
                required
              />
            </div>
            <div>
              <Label htmlFor="priceRange">Price Range</Label>
              <Select value={priceRange.toString()} onValueChange={(value) => setPriceRange(Number.parseInt(value))}>
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
            <div>
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" onChange={handleImageUpload} accept="image/*" />
            </div>
          </TabsContent>
          <TabsContent value="category" className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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
          </TabsContent>
          <TabsContent value="contact" className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter business location"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter business address"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter business phone"
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter business website"
              />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <Card className="overflow-hidden">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Business image preview"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{name || "Business Name"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{address || "Business Address"}</p>
                <p className="mb-2">{description || "Business Description"}</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>New</span>
                </div>
                {selectedCategory && (
                  <div className="mt-2">
                    <span className="inline-block bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2">
                      {selectedCategory.name}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="mt-2">
                    <span className="inline-block bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2">
                      {location}
                    </span>
                  </div>
                )}
                <div className="mt-2">
                  <span className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold mr-2">
                    {"$".repeat(priceRange)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <Button type="submit">Submit Business</Button>
        </div>
      </form>
    </div>
  )
}

