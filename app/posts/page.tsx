"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { CategoryBadge } from "@/components/category-badge"
import BusinessCard from "@/components/business-card"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { getActiveCategories, getBusinessesByCategory } from "@/lib/data"
import type { Category, Business, Attribute } from "@/lib/types"

export default function PostsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [categories] = useState<Category[]>(getActiveCategories())
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    searchParams.get("category")
      ? categories.find((c) => c.slug === searchParams.get("category")) || categories[0]
      : categories[0],
  )
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState([1])
  const [sortBy, setSortBy] = useState("rating")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const itemsPerPage = 12

  useEffect(() => {
    if (selectedCategory) {
      setBusinesses(getBusinessesByCategory(selectedCategory.id))
      // Reset filters when category changes
      setSelectedSubcategories([])
      setSelectedFilters({})
      setPriceRange([1])
    }
  }, [selectedCategory])

  const filterBusinessesBySearch = (businesses: Business[]) => {
    if (!searchQuery) return businesses
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Filter and sort businesses
  const filteredBusinesses = filterBusinessesBySearch(
    businesses.filter((business) => {
      // Subcategory filter
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(business.subcategoryId)) return false

      // Price range filter
      if (business.priceRange > priceRange[0]) return false

      // Category-specific filters
      return Object.entries(selectedFilters).every(([filterKey, filterValues]) => {
        if (filterValues.length === 0) return true
        const businessAttribute = business.attributes.find((attr) => attr.attributeId === filterKey)
        if (!businessAttribute) return false
        if (Array.isArray(businessAttribute.value)) {
          return filterValues.some((value) => businessAttribute.value.includes(value))
        }
        return filterValues.includes(String(businessAttribute.value))
      })
    }),
  )

  // Sort businesses
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.priceRange - b.priceRange
      case "price-high":
        return b.priceRange - a.priceRange
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBusinesses = sortedBusinesses.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (attributeId: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId]?.includes(value)
        ? prev[attributeId].filter((v) => v !== value)
        : [...(prev[attributeId] || []), value],
    }))
    setCurrentPage(1)
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId) ? prev.filter((s) => s !== subcategoryId) : [...prev, subcategoryId],
    )
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    setSelectedSubcategories([])
    setSelectedFilters({})
    setPriceRange([1])
    setCurrentPage(1)
    router.push(`/posts?category=${category.slug}`)
  }

  const renderAttributeFilter = (attribute: Attribute) => {
    switch (attribute.type) {
      case "select":
      case "multiselect":
        return (
          <div key={attribute.name} className="space-y-2">
            <h3 className="font-semibold mb-2 capitalize">{attribute.name}</h3>
            {attribute.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${attribute.name}-${option}`}
                  checked={selectedFilters[attribute.name]?.includes(option)}
                  onCheckedChange={() => handleFilterChange(attribute.name, option)}
                />
                <Label htmlFor={`${attribute.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "boolean":
        return (
          <div key={attribute.name} className="space-y-2">
            <h3 className="font-semibold mb-2 capitalize">{attribute.name}</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={attribute.name}
                checked={selectedFilters[attribute.name]?.includes("true")}
                onCheckedChange={(checked) => handleFilterChange(attribute.name, checked ? "true" : "false")}
              />
              <Label htmlFor={attribute.name}>{attribute.name}</Label>
            </div>
          </div>
        )
      // Add cases for other attribute types if needed
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      {/* Filters Sidebar */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Category</h3>
          <Select
            value={selectedCategory?.id}
            onValueChange={(value) => {
              const category = categories.find((c) => c.id === value)
              if (category) {
                handleCategoryChange(category)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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

        <div>
          <h3 className="font-semibold mb-4">Sort By</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating (High to Low)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Price Range</h3>
          <Slider value={priceRange} onValueChange={setPriceRange} max={3} step={1} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>$</span>
            <span>$$</span>
            <span>$$$</span>
          </div>
        </div>

        {selectedCategory && (
          <div>
            <h3 className="font-semibold mb-4">Subcategories</h3>
            <div className="space-y-2">
              {selectedCategory.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subcategory.id}
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onCheckedChange={() => handleSubcategoryChange(subcategory.id)}
                  />
                  <Label htmlFor={subcategory.id}>{subcategory.name}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Category-Specific Filters */}
        {selectedCategory?.attributes.map(renderAttributeFilter)}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Posts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Category Badges */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((category) => (
              <CategoryBadge
                key={category.id}
                name={category.name}
                count={category.subcategories.length}
                className={
                  selectedCategory?.id === category.id
                    ? "bg-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }
                href={`/posts?category=${category.slug}`}
                onClick={() => handleCategoryChange(category)}
              />
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBusinesses.map((business) => (
            <BusinessCard 
              key={business.id} 
              business={business}
              href={`/posts/${business.id}`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 2,
              )
              .map((pageNumber, index, array) => (
                <React.Fragment key={pageNumber}>
                  {index > 0 && array[index - 1] !== pageNumber - 1 && <span className="px-2">...</span>}
                  <Button
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                </React.Fragment>
              ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

