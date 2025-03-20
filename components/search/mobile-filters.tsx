"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { useTransition, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Subcategory {
  id: string
  name: string
  description?: string
  active: boolean
}

interface Attribute {
  id: string
  name: string
  type: string
  options?: string[]
  required: boolean
  description?: string
}

interface MobileFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    attributes?: Attribute[]
  }>
  currentCategory: string
  sortOptions: Array<{
    value: string
    label: string
  }>
  sortBy: string
  query: string
  subcategories?: Subcategory[]
  attributes?: Attribute[]
}

export default function MobileFilters({ 
  categories, 
  currentCategory, 
  sortOptions, 
  sortBy, 
  query,
  subcategories,
  attributes = []
}: MobileFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  
  // Get subcategory filter from URL
  const subcategoryParam = searchParams?.get("subcategories") || ""
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    subcategoryParam ? subcategoryParam.split(",") : []
  )
  
  // Get attribute filter from URL
  const attributeParamStr = searchParams?.get("attributes") || ""
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>(
    attributeParamStr ? JSON.parse(attributeParamStr) : {}
  )
  
  // Update local state when URL changes
  useEffect(() => {
    setSelectedSubcategories(subcategoryParam ? subcategoryParam.split(",") : [])
  }, [subcategoryParam])
  
  useEffect(() => {
    setSelectedAttributes(attributeParamStr ? JSON.parse(attributeParamStr) : {})
  }, [attributeParamStr])

  // Reset all filters
  const resetFilters = () => {
    setSelectedSubcategories([])
    setSelectedAttributes({})
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === currentCategory) return

    // Reset subcategory selection when changing category
    setSelectedSubcategories([])

    startTransition(() => {
      const params = new URLSearchParams()
      if (query) params.set("q", query)
      if (value) params.set("category", value)
      if (sortBy !== "relevance") params.set("sort", sortBy)

      router.push(`/search?${params.toString()}`)
    })
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    if (value === sortBy) return

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value !== "relevance") {
        params.set("sort", value)
      } else {
        params.delete("sort")
      }

      router.push(`/search?${params.toString()}`)
    })
  }

  // Handle subcategory selection
  const handleSubcategoryChange = (id: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedSubcategories, id]
      : selectedSubcategories.filter(subId => subId !== id)
    
    setSelectedSubcategories(newSelection)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (newSelection.length > 0) {
        params.set("subcategories", newSelection.join(","))
      } else {
        params.delete("subcategories")
      }
      
      router.push(`/search?${params.toString()}`)
    })
  }

  // Handle attribute selection
  const handleAttributeChange = (attributeId: string, value: string, checked: boolean) => {
    // Create a copy of the current selected attributes
    const newSelection = { ...selectedAttributes }
    
    // If this attribute doesn't have an array yet, create one
    if (!newSelection[attributeId]) {
      newSelection[attributeId] = []
    }
    
    // Add or remove the value
    if (checked) {
      // Add value if not already in the array
      if (!newSelection[attributeId].includes(value)) {
        newSelection[attributeId] = [...newSelection[attributeId], value]
      }
    } else {
      // Remove value
      newSelection[attributeId] = newSelection[attributeId].filter(v => v !== value)
      
      // Remove attribute entirely if no values selected
      if (newSelection[attributeId].length === 0) {
        delete newSelection[attributeId]
      }
    }
    
    setSelectedAttributes(newSelection)
    
    // Update URL
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (Object.keys(newSelection).length > 0) {
        params.set("attributes", JSON.stringify(newSelection))
      } else {
        params.delete("attributes")
      }
      
      router.push(`/search?${params.toString()}`)
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters & Sort
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters & Sort</SheetTitle>
          <SheetDescription>
            Refine your search results
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Sort options */}
          <div>
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <RadioGroup value={currentCategory} onValueChange={handleCategoryChange}>
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value="" id="mobile-all-categories" />
                  <Label htmlFor="mobile-all-categories">All Categories</Label>
                </div>
                
                {categories.map((category) => (
                  <div key={`mobile-${category.id}`} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={category.slug} id={`mobile-${category.slug}`} />
                    <Label htmlFor={`mobile-${category.slug}`}>{category.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          {/* Subcategories - only show if a category is selected */}
          {currentCategory && subcategories && subcategories.length > 0 && (
            <div>
              <Accordion type="single" collapsible defaultValue="mobile-subcategories">
                <AccordionItem value="mobile-subcategories">
                  <AccordionTrigger className="text-sm font-medium">
                    Subcategories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {subcategories
                        .filter(sub => sub.active)
                        .map((subcategory) => (
                          <div key={`mobile-${subcategory.id}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-${subcategory.id}`}
                              checked={selectedSubcategories.includes(subcategory.id)}
                              onCheckedChange={(checked) => {
                                handleSubcategoryChange(subcategory.id, checked === true)
                              }}
                            />
                            <Label htmlFor={`mobile-${subcategory.id}`}>{subcategory.name}</Label>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          
          {/* Attributes - display when there are attributes available */}
          {attributes && attributes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Product Attributes</h3>
              {attributes.map(attribute => (
                <Accordion key={attribute.id} type="single" collapsible>
                  <AccordionItem value={`mobile-attribute-${attribute.id}`}>
                    <AccordionTrigger className="text-sm">
                      {attribute.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {attribute.options?.map(option => (
                          <div key={`mobile-${attribute.id}-${option}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-${attribute.id}-${option}`}
                              checked={selectedAttributes[attribute.id]?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                handleAttributeChange(attribute.id, option, checked === true)
                              }}
                            />
                            <Label htmlFor={`mobile-${attribute.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
        
        <SheetFooter>
          <Button className="w-full" onClick={resetFilters}>
            Reset Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
} 