import { Suspense } from "react"

import { searchBusinesses } from "../business-profiles/actions"
import { getActiveCategories } from "../categories/actions"
import { Category } from "../categories/actions"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SearchWrapper } from "@/components/search-wrapper"
import FilterSidebar from "@/components/search/filter-sidebar"
import { ResultsView } from "@/components/search/results-view"
import MobileFilters from "@/components/search/mobile-filters"

// Sort options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
]

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
  category_id?: string
  subcategory_id?: string
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    page?: string
    subcategories?: string
    attributes?: string
    location?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || ""
  const categorySlug = searchParams?.category || ""
  const sortBy = searchParams?.sort || "relevance"
  const page = Number(searchParams?.page || "1")
  const location = searchParams?.location || "toronto"
  const subcategoryIds = searchParams?.subcategories 
    ? searchParams.subcategories.split(",") 
    : []
  const attributeFilters = searchParams?.attributes 
    ? JSON.parse(searchParams.attributes as string) 
    : {}
  
  // Pagination settings
  const itemsPerPage = 9
  
  // Fetch businesses and categories in parallel
  const [businessesResult, categoriesResult] = await Promise.all([
    query ? searchBusinesses(query, location) : { success: true, data: [] },
    getActiveCategories()
  ])
  
  // Extract data or set defaults
  const businesses = businessesResult.success ? (businessesResult.data as Business[]) : []
  const categories = categoriesResult.success ? (categoriesResult.data as Category[]) : []
  
  // Get the current category object
  const currentCategory = categories.find(cat => cat.slug === categorySlug)
  
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
  // In a real app, it would be better to filter by category in the database query
  const filteredByCategory = currentCategory 
    ? sortedBusinesses.filter(business => business.category_id === currentCategory.id)
    : sortedBusinesses
    
  // Apply subcategory filter if selected
  // This is a simplified implementation; in a real app, this filtering would be done in the database
  const filteredBySubcategories = subcategoryIds.length > 0 && currentCategory
    ? filteredByCategory.filter(business => 
        // We'd need to check if business.subcategory_id is in the filter list
        subcategoryIds.includes(business.subcategory_id || "")
      )
    : filteredByCategory

  // Apply attribute filtering if selected
  // This is a simplified implementation; in a real app, this filtering would be done in the database
  const attributeKeys = Object.keys(attributeFilters)
  const filteredBusinesses = attributeKeys.length > 0
    ? filteredBySubcategories.filter(() => {
        // For a real implementation, we would filter based on business attributes
        // For demo purposes, we'll just return all businesses
        return true
      })
    : filteredBySubcategories

  // Calculate total pages
  const totalItems = filteredBusinesses.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentPage = Math.min(Math.max(1, page), totalPages || 1)
  
  // Calculate paginated results
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search Results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Title section */}
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
      
      {/* Search form */}
      <div className="mb-8">
        <SearchWrapper 
          initialQuery={query} 
          popularSearches={["Restaurants", "Plumbers", "Electricians", "Dentists", "Gyms", "Hair Salons", "Coffee Shops", "Auto Repair"]}
          placeholder="Search businesses, services, or categories..."
          searchType=""
          redirectPath="/search"
        />
      </div>
      
      {/* Filter and results section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop filter sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6 hidden lg:block">
            <FilterSidebar 
              categories={categories}
              currentCategory={categorySlug}
              sortOptions={sortOptions}
              sortBy={sortBy}
              query={query}
              subcategories={currentCategory?.subcategories}
              attributes={currentCategory?.attributes}
            />
          </div>
        </div>
        
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4 w-full">
          <MobileFilters
            categories={categories}
            currentCategory={categorySlug}
            sortOptions={sortOptions}
            sortBy={sortBy}
            query={query}
            subcategories={currentCategory?.subcategories}
            attributes={currentCategory?.attributes}
          />
        </div>
        
        {/* Search results */}
        <div className="flex-1">
          <Suspense fallback={<p>Loading results...</p>}>
            <ResultsView
              businesses={paginatedBusinesses}
              filteredBusinessesCount={filteredBusinesses.length}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              query={query}
              categoryName={currentCategory?.name}
              sortOptions={sortOptions}
              subcategories={currentCategory?.subcategories}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 