import { Suspense } from "react"
import Link from "next/link"
// import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getActiveCategories } from "@/app/(public)/categories/actions"
import { getFeaturedBusinesses, getNewlyAddedBusinesses } from "@/app/(public)/business-profiles/actions"
import { HomepageSearch } from "@/components/homepage-search"
import { CategorySection } from "@/components/category-section"
import BusinessCard from "@/components/business-card"
import { SlidingBanner } from "@/components/sliding-banner"

// Popular searches for the search component
const popularSearches = [
  "Restaurants",
  "Plumbers",
  "Electricians",
  "Dentists",
  "Gyms",
  "Hair Salons",
  "Coffee Shops",
  "Auto Repair",
]

// Loading component for categories
function CategoriesLoading() {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  )
}

// Loading component for businesses
function BusinessesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading component for more businesses (8 items)
function MoreBusinessesLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Define a type for the business data
interface BusinessData {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  rating: number;
  image?: string;
}

// Get the selected location from cookies
// NOTE: This function is temporarily commented out but will be needed when the API is fully implemented
// async function getSelectedLocation() {
//   const cookieStore = await cookies()
//   return cookieStore.get("selectedLocation")?.value || "toronto"
// }

// View All Button component
function ViewAllButton({ href }: { href: string }) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href={href}>
        View All <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}

// Featured businesses section with server component
async function FeaturedBusinessesSection() {
  // We're not using locationId for now since the function might not fully support it
  // const locationId = await getSelectedLocation()
  
  // Call the function but be prepared for it not being fully implemented
  const result = await getFeaturedBusinesses()
  
  // Mock data for development since the real function might not be implemented yet
  const mockData: BusinessData[] = [
    {
      id: "1",
      name: "Featured Business 1",
      description: "Description for Featured Business 1",
      address: "123 Main St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N4",
      rating: 4.5,
      image: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Featured Business 2",
      description: "Description for Featured Business 2",
      address: "456 Elm St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N5",
      rating: 4.2,
      image: "/placeholder.svg"
    },
    {
      id: "7",
      name: "Featured Business 3",
      description: "Description for Featured Business 3",
      address: "789 Oak St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N6",
      rating: 4.8,
      image: "/placeholder.svg"
    },
    {
      id: "8",
      name: "Featured Business 4",
      description: "Description for Featured Business 4",
      address: "101 Pine St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N7",
      rating: 4.7,
      image: "/placeholder.svg"
    }
  ]
  
  // Use mock data if the real function returns an error
  const businesses: BusinessData[] = (result.success && 'data' in result && Array.isArray(result.data) ? result.data : mockData) as BusinessData[]
  
  if (businesses.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No featured businesses available in this location</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Featured Businesses</h2>
        <ViewAllButton href="/business-profiles/featured" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {businesses.map((business: BusinessData) => (
          <BusinessCard
            key={business.id}
            business={{
              id: business.id,
              name: business.name,
              description: business.description,
              address: `${business.address}, ${business.city}, ${business.state} ${business.zip}`,
              rating: business.rating,
              image: business.image || "/placeholder.svg",
            }}
            href={`/business-profiles/${business.id}`}
          />
        ))}
      </div>
    </div>
  )
}

// Newly added businesses section with server component
async function NewlyAddedBusinessesSection() {
  // We're not using locationId for now since the function doesn't support it yet
  // const locationId = await getSelectedLocation()
  
  // Call the function but be prepared for it not being fully implemented
  const result = await getNewlyAddedBusinesses()
  
  // Mock data for development since the real function might not be implemented yet
  const mockData: BusinessData[] = [
    {
      id: "3",
      name: "New Business 1",
      description: "Description for New Business 1",
      address: "789 Oak St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N6",
      rating: 4.0,
      image: "/placeholder.svg"
    },
    {
      id: "4",
      name: "New Business 2",
      description: "Description for New Business 2",
      address: "101 Pine St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N7",
      rating: 3.8,
      image: "/placeholder.svg"
    },
    {
      id: "5",
      name: "New Business 3",
      description: "Description for New Business 3",
      address: "202 Maple St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N8",
      rating: 4.2,
      image: "/placeholder.svg"
    },
    {
      id: "6",
      name: "New Business 4",
      description: "Description for New Business 4",
      address: "303 Cedar St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N9",
      rating: 4.5,
      image: "/placeholder.svg"
    }
  ]
  
  // Use mock data if the real function returns an error
  const businesses: BusinessData[] = (result.success && 'data' in result && Array.isArray(result.data) ? result.data : mockData) as BusinessData[]
  
  if (businesses.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No new businesses available in this location</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Newly Added</h2>
        <ViewAllButton href="/business-profiles/new" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {businesses.map((business: BusinessData) => (
          <BusinessCard
            key={business.id}
            business={{
              id: business.id,
              name: business.name,
              description: business.description,
              address: `${business.address}, ${business.city}, ${business.state} ${business.zip}`,
              rating: business.rating,
              image: business.image || "/placeholder.svg",
            }}
            href={`/business-profiles/${business.id}`}
          />
        ))}
      </div>
    </div>
  )
}

// Categories section with server component
async function CategoriesSection() {
  const result = await getActiveCategories()
  
  // Mock data for development since the real function might not be fully implemented yet
  const mockCategories = [
    {
      id: "1",
      name: "Restaurants",
      slug: "restaurants",
      icon: "utensils",
      description: "Find local restaurants and eateries",
      active: true
    },
    {
      id: "2",
      name: "Retail",
      slug: "retail",
      icon: "shopping-bag",
      description: "Discover retail shops in your area",
      active: true
    },
    {
      id: "3",
      name: "Services",
      slug: "services",
      icon: "tool",
      description: "Professional services for your needs",
      active: true
    },
    {
      id: "4",
      name: "Health & Wellness",
      slug: "health-wellness",
      icon: "heart",
      description: "Health and wellness businesses",
      active: true
    },
    {
      id: "5",
      name: "Technology",
      slug: "technology",
      icon: "laptop",
      description: "Technology and IT services",
      active: true
    }
  ]
  
  // Use mock data if the API call fails
  if (!result.success || !result.data || result.data.length === 0) {
    console.log("Using mock category data for development")
    return <CategorySection categories={mockCategories} />
  }
  
  return <CategorySection categories={result.data} />
}

// Main page component
export default function Home() {
  return (
    <>
      <div className="container mx-auto py-8 px-4 space-y-12">
        {/* Hero section with sliding banner */}
        <section className="space-y-4">
          <SlidingBanner />
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold">Find Local Businesses</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
              Discover and connect with the best local businesses in your area. From restaurants to home services, find what you need.
            </p>
            
            {/* Search component */}
            <div className="mt-6">
              <HomepageSearch popularSearches={popularSearches} />
            </div>
          </div>
        </section>
        
        {/* Featured businesses section */}
        <section className="space-y-4">
          <Suspense fallback={<BusinessesLoading />}>
            <FeaturedBusinessesSection />
          </Suspense>
        </section>
        
        {/* Newly added businesses section */}
        <section className="space-y-4">
          <Suspense fallback={<MoreBusinessesLoading />}>
            <NewlyAddedBusinessesSection />
          </Suspense>
        </section>
        
        {/* Categories section - moved down and made less prominent */}
        <section className="space-y-4 bg-muted/30 py-8 px-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <ViewAllButton href="/categories" />
          </div>
          <Suspense fallback={<CategoriesLoading />}>
            <CategoriesSection />
          </Suspense>
        </section>
        
        {/* Testimonials section */}
        <section className="space-y-6 py-8">
          <h2 className="text-2xl font-bold text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">User {i}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &quot;BusinessHub made it so easy to find exactly what I was looking for. The reviews were helpful and I found a great local business!&quot;
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Call to action section */}
        <section className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Own a Business?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            List your business on BusinessHub to reach more customers and grow your online presence.
          </p>
          <Button asChild>
            <Link href="/owner/business-profiles/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Your Business
            </Link>
          </Button>
        </section>
      </div>
    </>
  )
} 