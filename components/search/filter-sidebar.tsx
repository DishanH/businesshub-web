"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { useTransition, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

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

interface FilterSidebarProps {
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

export default function FilterSidebar({ 
  categories, 
  currentCategory, 
  sortOptions, 
  sortBy, 
  query,
  subcategories,
  attributes = []
}: FilterSidebarProps) {
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
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Reset
        </Button>
      </div>
      
      <Accordion type="multiple" className="w-full" defaultValue={["sort", "categories"]}>
        {/* Sort options */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-medium">
            Sort By
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
        
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <div className="flex flex-col space-y-2">
                <RadioGroup value={currentCategory} onValueChange={handleCategoryChange}>
                  <div className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value="" id="all-categories" />
                    <Label htmlFor="all-categories">All Categories</Label>
                  </div>
                  
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={category.slug} id={category.slug} />
                      <Label htmlFor={category.slug}>{category.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Subcategories - only show if a category is selected */}
        {currentCategory && subcategories && subcategories.length > 0 && (
          <AccordionItem value="subcategories">
            <AccordionTrigger className="text-sm font-medium">
              Subcategories
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {subcategories
                  .filter(sub => sub.active)
                  .map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={subcategory.id}
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onCheckedChange={(checked) => {
                          handleSubcategoryChange(subcategory.id, checked === true)
                        }}
                      />
                      <Label htmlFor={subcategory.id}>{subcategory.name}</Label>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {/* Attributes - only show if attributes are available */}
        {currentCategory && attributes && attributes.length > 0 && (
          <AccordionItem value="attributes">
            <AccordionTrigger className="text-sm font-medium">
              Product Attributes
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {attributes.map(attribute => (
                  <div key={attribute.id} className="space-y-2">
                    <h4 className="text-sm font-medium">{attribute.name}</h4>
                    {attribute.options && (
                      <div className="space-y-1">
                        {attribute.options.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`attribute-${attribute.id}-${option}`}
                              checked={selectedAttributes[attribute.id]?.includes(option) || false}
                              onCheckedChange={(checked) => {
                                handleAttributeChange(attribute.id, option, !!checked)
                              }}
                            />
                            <Label htmlFor={`attribute-${attribute.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </>
  )
} 