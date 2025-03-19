"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Search, SlidersHorizontal, X, Grid, List } from "lucide-react"

import { searchBusinesses } from "../business-profiles/actions"
import { getActiveCategories } from "../categories/actions"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BusinessCard from "@/components/business-card"
import BusinessListCard from "@/components/business-list-card"

// Interfaces
interface Business {
  id: string
  name: string
  description: string
  address?: string
  city?: string
  state?: string
  rating: number
  image?: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  subcategories?: Array<{
    id: string
    name: string
    active: boolean
  }>
}

// Sort options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
]

// View layouts
type ViewLayout = "grid" | "list"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get("q") || ""
  const categorySlug = searchParams?.get("category") || ""
  const sortBy = searchParams?.get("sort") || "relevance"
  const page = Number(searchParams?.get("page") || "1")
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, startTransition] = useTransition()
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid")
  
  // Pagination settings
  const itemsPerPage = 9
  const totalItems = businesses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentPage = Math.min(Math.max(1, page), totalPages || 1)
  
  // Fetch businesses based on search params
  const fetchResults = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch businesses
      const result = await searchBusinesses(query)
      if (result.success && result.data) {
        setBusinesses(result.data as Business[])
      } else {
        setBusinesses([])
      }
      
      // Fetch categories for filters
      const categoriesResult = await getActiveCategories()
      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data as Category[])
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setIsLoading(false)
    }
  }, [query])
  
  // Load initial data
  useEffect(() => {
    fetchResults()
  }, [fetchResults])
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", searchQuery)
    params.delete("page") // Reset to first page on new search
    
    router.push(`/search?${params.toString()}`)
  }
  
  // Update URL with filters
  const updateFilters = useCallback(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      // Update sort parameter
      if (sortBy !== "relevance") {
        params.set("sort", sortBy)
      } else {
        params.delete("sort")
      }
      
      // Update category parameter
      if (selectedCategory) {
        params.set("category", selectedCategory)
      } else {
        params.delete("category")
      }
      
      // Reset to first page when changing filters
      params.delete("page")
      
      router.push(`/search?${params.toString()}`)
    })
  }, [router, searchParams, selectedCategory, sortBy])
  
  // Apply filters when they change
  useEffect(() => {
    if (query) {
      updateFilters()
    }
  }, [selectedCategory, sortBy, updateFilters, query])
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedSubcategories([])
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }
  
  // Get the selected category object
  const currentCategory = categories.find(cat => cat.slug === selectedCategory)
  
  // Sort businesses based on selected sort option
  const sortedBusinesses = [...businesses].sort((a, b) => {
    switch (sortBy) {
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0)
      case "rating-asc":
        return (a.rating || 0) - (b.rating || 0)
      // Future implementation: newest and oldest
      default:
        return 0
    }
  })
  
  // Filter businesses by category if selected
  const filteredBusinesses = currentCategory 
    ? sortedBusinesses
    : sortedBusinesses

  // Calculate paginated results
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Search Results</span>
      </div>
      
      {/* Title section - styled like the nannies page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {query ? `Search Results for "${query}"` : "Search Businesses"}
          </h1>
          <p className="text-muted-foreground">
            Find businesses, services, and categories across our platform
          </p>
        </div>
      </div>
      
      {/* Search box - moved closer to other elements */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search businesses, services, or categories..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
      
      {/* Filter and results section - matches nannies page layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar - styled like nannies page */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6 hidden lg:block">
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
              {/* Sort options in an accordion */}
              <AccordionItem value="sort">
                <AccordionTrigger className="text-sm font-medium">
                  Sort By
                </AccordionTrigger>
                <AccordionContent>
                  <Select value={sortBy} onValueChange={(value) => sortBy !== value && startTransition(() => router.push(`/search?q=${query}&sort=${value}`))}>
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
                      <RadioGroup value={selectedCategory || ""} onValueChange={setSelectedCategory}>
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
              {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
                <AccordionItem value="subcategories">
                  <AccordionTrigger className="text-sm font-medium">
                    {currentCategory.name} Subcategories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {currentCategory.subcategories
                        .filter(sub => sub.active)
                        .map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={subcategory.id}
                              checked={selectedSubcategories.includes(subcategory.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSubcategories(prev => [...prev, subcategory.id])
                                } else {
                                  setSelectedSubcategories(prev => 
                                    prev.filter(id => id !== subcategory.id)
                                  )
                                }
                              }}
                            />
                            <Label htmlFor={subcategory.id}>{subcategory.name}</Label>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
        
        {/* Mobile filter button and sheet - more compact */}
        <div className="lg:hidden mb-4 w-full">
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
                  <Select value={sortBy} onValueChange={(value) => sortBy !== value && startTransition(() => router.push(`/search?q=${query}&sort=${value}`))}>
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
                    <RadioGroup value={selectedCategory || ""} onValueChange={setSelectedCategory}>
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
                {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
                  <div>
                    <Accordion type="single" collapsible defaultValue="mobile-subcategories">
                      <AccordionItem value="mobile-subcategories">
                        <AccordionTrigger className="text-sm font-medium">
                          {currentCategory.name} Subcategories
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {currentCategory.subcategories
                              .filter(sub => sub.active)
                              .map((subcategory) => (
                                <div key={`mobile-${subcategory.id}`} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`mobile-${subcategory.id}`}
                                    checked={selectedSubcategories.includes(subcategory.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedSubcategories(prev => [...prev, subcategory.id])
                                      } else {
                                        setSelectedSubcategories(prev => 
                                          prev.filter(id => id !== subcategory.id)
                                        )
                                      }
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
              </div>
              
              <SheetFooter>
                <Button className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Search results - taking more space */}
        <div className="flex-1">
          {/* Applied filters */}
          {(selectedCategory || sortBy !== "relevance") && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Applied filters:</span>
              
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1 flex items-center">
                  Category: {categories.find(c => c.slug === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory("")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {sortBy !== "relevance" && (
                <Badge variant="secondary" className="gap-1 flex items-center">
                  Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                  <button 
                    onClick={() => router.push(`/search?q=${query}`)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            </div>
          )}
          
          {/* Result count and view toggle (match nannies style) */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  `${filteredBusinesses.length} results found`
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Showing {Math.min(filteredBusinesses.length, (currentPage - 1) * itemsPerPage + 1)}-
                  {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)} of {filteredBusinesses.length}
                </p>
              )}
            </div>
            
            {/* View toggle - using nannies style */}
            <div className="flex items-center gap-2 border rounded-md p-1">
              <Button
                variant={viewLayout === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewLayout("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewLayout === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewLayout("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Results grid or loading skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedBusinesses.length > 0 ? (
            <>
              {viewLayout === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={{
                        id: business.id,
                        name: business.name,
                        description: business.description,
                        address: business.city && business.state ? 
                          `${business.city}, ${business.state}` : 
                          business.address || "Location not specified",
                        rating: business.rating || 0,
                        image: business.image || "/placeholder.svg",
                      }}
                      href={`/business-profiles/${business.id}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedBusinesses.map((business) => (
                    <BusinessListCard
                      key={business.id}
                      business={{
                        id: business.id,
                        name: business.name,
                        description: business.description,
                        address: business.city && business.state ? 
                          `${business.city}, ${business.state}` : 
                          business.address || "Location not specified",
                        rating: business.rating || 0,
                        image: business.image || "/placeholder.svg",
                      }}
                      href={`/business-profiles/${business.id}`}
                    />
                  ))}
                </div>
              )}

              {/* Pagination - match nannies style */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (currentPage > 1) {
                          const params = new URLSearchParams(searchParams.toString())
                          params.set("page", (currentPage - 1).toString())
                          router.push(`/search?${params.toString()}`)
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Display pages around current page
                        let pageNum = i + 1
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageNum = currentPage - 3 + i + 1
                          }
                          if (currentPage > totalPages - 3) {
                            pageNum = totalPages - 4 + i
                          }
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => {
                              const params = new URLSearchParams(searchParams.toString())
                              params.set("page", pageNum.toString())
                              router.push(`/search?${params.toString()}`)
                            }}
                            className="w-8"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          const params = new URLSearchParams(searchParams.toString())
                          params.set("page", (currentPage + 1).toString())
                          router.push(`/search?${params.toString()}`)
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn&apos;t find any matches for &quot;{query}&quot;.
              </p>
              <p className="text-sm text-muted-foreground mb-6">Try:</p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                <li>• Checking your spelling</li>
                <li>• Using more general keywords</li>
                <li>• Removing filters</li>
              </ul>
              <Button asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 