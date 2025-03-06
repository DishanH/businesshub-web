import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getActiveCategories } from "@/app/actions/categories"
import { getFeaturedBusinesses } from "@/app/actions/businesses"
import { HomepageSearch } from "@/components/homepage-search"
import { CategorySection } from "@/components/category-section"
import BusinessCard from "@/components/business-card"
import { CarouselComponent } from "@/components/carousel"
import { LocationSelector } from "@/components/location-selector"
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
    <div className="flex flex-wrap gap-2 mb-6">
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
        <Skeleton key={i} className="h-64 w-full rounded-lg" />
      ))}
    </div>
  )
}

// Featured businesses section with server component
async function FeaturedBusinessesSection() {
  const result = await getFeaturedBusinesses(4)
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No featured businesses available</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Featured Businesses</h2>
        <Link href="/posts" className="text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {result.data.map((business) => (
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
            href={`/business/${business.id}`}
          />
        ))}
      </div>
    </div>
  )
}

// Categories section with server component
async function CategoriesSection() {
  const result = await getActiveCategories()
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No categories available</p>
      </div>
    )
  }
  
  return <CategorySection categories={result.data} />
}

// Main page component
export default function Home() {
  return (
    <>
      {/* Location selector header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-2 px-4">
          <div className="flex items-center justify-end gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <LocationSelector />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 space-y-8">
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
        
        {/* Categories section */}
        <section className="space-y-4">
          <Suspense fallback={<CategoriesLoading />}>
            <CategoriesSection />
          </Suspense>
        </section>
        
        {/* Featured businesses section */}
        <section className="space-y-4">
          <Suspense fallback={<BusinessesLoading />}>
            <FeaturedBusinessesSection />
          </Suspense>
        </section>
        
        {/* Carousel section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Trending This Week</h2>
          <CarouselComponent />
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
                  &ldquo;This platform has been a game-changer for finding reliable local businesses. I&apos;ve discovered so many great services in my neighborhood!&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA section */}
        <section className="bg-primary text-primary-foreground p-8 rounded-lg text-center space-y-4">
          <h2 className="text-2xl font-bold">Own a Business?</h2>
          <p className="max-w-2xl mx-auto">
            Join our platform and connect with customers in your area. It&apos;s free to get started!
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link href="/add-business">
              <Plus className="mr-2 h-4 w-4" /> Add Your Business
            </Link>
          </Button>
        </section>
      </div>
    </>
  )
} 