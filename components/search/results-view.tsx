"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Grid, List, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BusinessCard from "@/components/business-card"
import BusinessListCard from "@/components/business-list-card"

// Business interface
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

// View layout types
type ViewLayout = "grid" | "list"

export interface ResultsViewProps {
  businesses: Business[]
  filteredBusinessesCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  query: string
  categoryName?: string
  sortOptions?: Array<{value: string, label: string}>
  subcategories?: Array<{id: string, name: string, active: boolean}>
  attributes?: Array<{id: string, name: string, type: string, options?: string[], required: boolean, description?: string}>
}

export function ResultsView({
  businesses,
  filteredBusinessesCount,
  currentPage,
  totalPages,
  itemsPerPage,
  query,
  categoryName,
  sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "rating-asc", label: "Lowest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ],
  subcategories = []
}: ResultsViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categorySlug = searchParams?.get("category") || ""
  const sortBy = searchParams?.get("sort") || "relevance"
  const subcategoryIds = searchParams?.get("subcategories") || ""
  const attributesParam = searchParams?.get("attributes") || ""
  
  // Parse attribute filters from URL
  const attributeFilters = attributesParam ? JSON.parse(attributesParam) : {}
  
  // State for view layout
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid")
  
  return (
    <>
      {/* Applied filters */}
      {(categorySlug || sortBy !== "relevance" || subcategoryIds || attributesParam) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Applied filters:</span>
          
          {categorySlug && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              Category: {categoryName || categorySlug}
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete("category")
                  params.delete("subcategories") // Clear subcategories when category is cleared
                  router.push(`/search?${params.toString()}`)
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {subcategoryIds && subcategoryIds.split(",").map(id => {
            const subcategory = subcategories.find(s => s.id === id)
            if (!subcategory) return null
            
            return (
              <Badge key={id} variant="secondary" className="gap-1 flex items-center">
                {subcategory.name}
                <button 
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    const ids = subcategoryIds.split(",").filter(subId => subId !== id)
                    if (ids.length > 0) {
                      params.set("subcategories", ids.join(","))
                    } else {
                      params.delete("subcategories")
                    }
                    router.push(`/search?${params.toString()}`)
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
          
          {sortBy !== "relevance" && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              Sort: {sortOptions.find(o => o.value === sortBy)?.label || sortBy}
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete("sort")
                  router.push(`/search?${params.toString()}`)
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {attributesParam && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              Attributes: {Object.keys(attributeFilters).map(attr => attributeFilters[attr].join(", "))}
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete("attributes")
                  router.push(`/search?${params.toString()}`)
                }}
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
            onClick={() => {
              const params = new URLSearchParams()
              if (query) params.set("q", query)
              router.push(`/search?${params.toString()}`)
            }}
          >
            Clear All
          </Button>
        </div>
      )}
      
      {/* Result count and view toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredBusinessesCount} results found
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              Showing {Math.min(filteredBusinessesCount, (currentPage - 1) * itemsPerPage + 1)}-
              {Math.min(currentPage * itemsPerPage, filteredBusinessesCount)} of {filteredBusinessesCount}
            </p>
          )}
        </div>
        
        {/* View toggle */}
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
      
      {/* Results grid or no results */}
      {businesses.length > 0 ? (
        <>
          {viewLayout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
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
              {businesses.map((business) => (
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

          {/* Pagination */}
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
    </>
  )
} 