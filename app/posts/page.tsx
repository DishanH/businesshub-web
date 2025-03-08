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
import { Category } from "@/app/actions/categories"
import type { Business } from "@/app/businesses/actions/types"

import { getActiveCategories, getBusinessesByCategory } from "@/lib/data"
import type { Attribute } from "@/lib/types"

// Mock data for businesses
const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Sweet Delights Bakery",
    description: "Artisanal cakes and pastries for all occasions.",
    address: "123 Main St",
    city: "Toronto",
    state: "ON",
    zip: "M5V 2H1",
    phone: "416-555-1234",
    email: "info@sweetdelights.com",
    category_id: "food-dining",
    subcategory_id: "bakery",
    price_range: 2,
    rating: 4.5,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Tech Solutions Inc.",
    description: "IT support and computer repair services.",
    address: "456 Queen St",
    city: "Toronto",
    state: "ON",
    zip: "M5V 2H2",
    phone: "416-555-5678",
    email: "support@techsolutions.com",
    category_id: "technology",
    subcategory_id: "repair",
    price_range: 3,
    rating: 4.2,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Green Thumb Landscaping",
    description: "Professional landscaping and garden maintenance.",
    address: "789 King St",
    city: "Toronto",
    state: "ON",
    zip: "M5V 2H3",
    phone: "416-555-9012",
    email: "info@greenthumb.com",
    category_id: "home-services",
    subcategory_id: "landscaping",
    price_range: 3,
    rating: 4.8,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Bright Smile Dental",
    description: "Family dentistry with a gentle touch.",
    address: "101 Yonge St",
    city: "Toronto",
    state: "ON",
    zip: "M5V 2H4",
    phone: "416-555-3456",
    email: "appointments@brightsmile.com",
    category_id: "healthcare",
    subcategory_id: "dental",
    price_range: 4,
    rating: 4.7,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-04T00:00:00Z",
    updated_at: "2023-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Pacific Fitness",
    description: "State-of-the-art gym with personal trainers.",
    address: "202 Robson St",
    city: "Vancouver",
    state: "BC",
    zip: "V6B 1A1",
    phone: "604-555-7890",
    email: "info@pacificfitness.com",
    category_id: "health-wellness",
    subcategory_id: "gym",
    price_range: 3,
    rating: 4.6,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-01-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Coastal Cleaning",
    description: "Eco-friendly residential and commercial cleaning.",
    address: "303 Granville St",
    city: "Vancouver",
    state: "BC",
    zip: "V6B 1A2",
    phone: "604-555-2345",
    email: "service@coastalcleaning.com",
    category_id: "home-services",
    subcategory_id: "cleaning",
    price_range: 2,
    rating: 4.3,
    image: "/placeholder.svg",
    active: true,
    created_at: "2023-01-06T00:00:00Z",
    updated_at: "2023-01-06T00:00:00Z",
  },
]

export default function PostsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState([1])
  const [sortBy, setSortBy] = useState("rating")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12

  // Fetch categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success && data.data) {
          setCategories(data.data)
          
          // Set selected category from URL params
          const categorySlug = searchParams.get("category")
          if (categorySlug) {
            const category = data.data.find((c: Category) => c.slug === categorySlug)
            if (category) {
              setSelectedCategory(category)
            } else {
              setSelectedCategory(data.data[0])
            }
          } else if (data.data.length > 0) {
            setSelectedCategory(data.data[0])
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [searchParams])

  // Fetch businesses when category changes
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!selectedCategory) return
      
      try {
        setIsLoading(true)
        // In a real app, you would fetch from the API
        // For now, we'll filter the mock data
        const filtered = mockBusinesses.filter(
          (b) => b.category_id === selectedCategory.id
        )
        setBusinesses(filtered)
      } catch (error) {
        console.error("Error fetching businesses:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBusinesses()
  }, [selectedCategory])

  const filterBusinessesBySearch = (businesses: Business[]) => {
    if (!searchQuery) return businesses
    
    const query = searchQuery.toLowerCase()
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query)
    )
  }

  const filterBusinessesBySubcategory = (businesses: Business[]) => {
    if (selectedSubcategories.length === 0) return businesses
    
    return businesses.filter((business) =>
      selectedSubcategories.includes(business.subcategory_id || "")
    )
  }

  const filterBusinessesByPrice = (businesses: Business[]) => {
    return businesses.filter(
      (business) => business.price_range <= priceRange[0]
    )
  }

  const filterBusinessesByAttributes = (businesses: Business[]) => {
    if (Object.keys(selectedFilters).length === 0) return businesses
    
    return businesses.filter((business) => {
      // This is a simplified version - in a real app, you would check the business attributes
      return true
    })
  }

  const sortBusinesses = (businesses: Business[]) => {
    return [...businesses].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "price_low") {
        return a.price_range - b.price_range
      } else if (sortBy === "price_high") {
        return b.price_range - a.price_range
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }

  const handleFilterChange = (attributeId: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (!newFilters[attributeId]) {
        newFilters[attributeId] = []
      }
      
      if (newFilters[attributeId].includes(value)) {
        newFilters[attributeId] = newFilters[attributeId].filter((v) => v !== value)
      } else {
        newFilters[attributeId].push(value)
      }
      
      return newFilters
    })
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    )
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    setSelectedSubcategories([])
    setSelectedFilters({})
    setPriceRange([1])
    router.push(`/posts?category=${category.slug}`, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const filteredBusinesses = sortBusinesses(
    filterBusinessesByAttributes(
      filterBusinessesByPrice(
        filterBusinessesBySubcategory(
          filterBusinessesBySearch(businesses)
        )
      )
    )
  )

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage)
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Businesses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with filters */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                ))
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      selectedCategory?.id === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {selectedCategory && (
            <>
              <div>
                <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
                <div className="space-y-2">
                  {selectedCategory.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subcategory-${subcategory.id}`}
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onCheckedChange={() => handleSubcategoryChange(subcategory.id)}
                      />
                      <Label htmlFor={`subcategory-${subcategory.id}`}>{subcategory.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <Slider
                  defaultValue={[1]}
                  max={4}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between">
                  <span>$</span>
                  <span>$$</span>
                  <span>$$$</span>
                  <span>$$$$</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Sort By</h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    <SelectItem value="price_low">Price (Low to High)</SelectItem>
                    <SelectItem value="price_high">Price (High to Low)</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory.attributes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Additional Filters</h2>
                  <div className="space-y-4">
                    {selectedCategory.attributes.map((attribute) => {
                      if (attribute.type === "boolean") {
                        return (
                          <div key={attribute.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`attribute-${attribute.id}`}
                              checked={
                                selectedFilters[attribute.id]?.includes("true") || false
                              }
                              onCheckedChange={(checked) =>
                                handleFilterChange(attribute.id, "true")
                              }
                            />
                            <Label htmlFor={`attribute-${attribute.id}`}>{attribute.name}</Label>
                          </div>
                        )
                      } else if (
                        attribute.type === "select" ||
                        attribute.type === "multiselect"
                      ) {
                        return (
                          <div key={attribute.id} className="space-y-2">
                            <Label>{attribute.name}</Label>
                            <div className="space-y-1">
                              {attribute.options?.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`attribute-${attribute.id}-${option}`}
                                    checked={
                                      selectedFilters[attribute.id]?.includes(option) || false
                                    }
                                    onCheckedChange={() =>
                                      handleFilterChange(attribute.id, option)
                                    }
                                  />
                                  <Label htmlFor={`attribute-${attribute.id}-${option}`}>
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Main content */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">
              {selectedCategory ? selectedCategory.name : "All Businesses"}
            </h1>
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 w-full"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              >
                Search
              </Button>
            </form>
          </div>

          {selectedSubcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSubcategories.map((id) => {
                const subcategory = selectedCategory?.subcategories.find(
                  (s) => s.id === id
                )
                return (
                  subcategory && (
                    <div
                      key={id}
                      className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                    >
                      {subcategory.name}
                      <button
                        onClick={() => handleSubcategoryChange(id)}
                        className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                )
              })}
              <button
                onClick={() => setSelectedSubcategories([])}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No businesses found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onLike={() => {}}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
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

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNumber = i + 1
                        // Show current page, first, last, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="icon"
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </Button>
                          )
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={pageNumber}>...</span>
                        }
                        return null
                      })}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

