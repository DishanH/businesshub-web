import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  ArrowRight,
  Grid,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveCategories } from "@/app/(public)/categories/actions";
import {
  getFeaturedBusinesses,
  getNewlyAddedBusinesses,
} from "@/app/(public)/business-profiles/actions";
import { HomepageSearch } from "@/components/homepage-search";
import { CategorySection } from "@/components/category-section";
import { SlidingBanner } from "@/components/sliding-banner";
import {
  FeaturedBusinessesClient,
  NewlyAddedBusinessesClient,
} from "@/components/featured-businesses";
import { PopularCategories } from "@/components/popular-categories";

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
];

// Loading component for categories
function CategoriesLoading() {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  );
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
  );
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
  );
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

// View All Button component
function ViewAllButton({ href }: { href: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-sm font-medium text-primary hover:text-primary/80 hover:bg-transparent px-2 py-1"
    >
      <Link href={href} className="flex items-center gap-1">
        View All <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

// Section heading component for consistent styling
function SectionHeading({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-medium tracking-tight text-foreground/90">{title}</h2>
      </div>
      <ViewAllButton href={href} />
    </div>
  );
}

// Featured businesses section with server component
async function FeaturedBusinessesSection() {
  // We're not using locationId for now since the function might not fully support it
  // const locationId = await getSelectedLocation()

  // Call the function but be prepared for it not being fully implemented
  const result = await getFeaturedBusinesses();

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
    },
  ];

  // Use mock data if the real function returns an error
  const businesses: BusinessData[] = (
    result.success && "data" in result && Array.isArray(result.data)
      ? result.data
      : mockData
  ) as BusinessData[];

  if (businesses.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No featured businesses available in this location</p>
      </div>
    );
  }

  const processedBusinesses = businesses.map((business) => ({
    id: business.id,
    name: business.name,
    description: business.description,
    address: `${business.address}, ${business.city}, ${business.state} ${business.zip}`,
    rating: business.rating,
    image: business.image || "/placeholder.svg",
  }));

  return (
    <div className="space-y-4">
      <SectionHeading
        icon={<Sparkles className="h-5 w-5 text-primary" />}
        title="Featured Businesses"
        href="/business-profiles/featured"
      />
      <FeaturedBusinessesClient businesses={processedBusinesses} />
    </div>
  );
}

// Newly added businesses section with server component
async function NewlyAddedBusinessesSection() {
  // We're not using locationId for now since the function doesn't support it yet
  // const locationId = await getSelectedLocation()

  // Call the function but be prepared for it not being fully implemented
  const result = await getNewlyAddedBusinesses();

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
    },
    {
      id: "7",
      name: "New Business 5",
      description: "Description for New Business 5",
      address: "404 Birch St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N10",
      rating: 4.3,
      image: "/placeholder.svg",
    },
    {
      id: "8",
      name: "New Business 6",
      description: "Description for New Business 6",
      address: "505 Maple St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N11",
      rating: 4.1,
      image: "/placeholder.svg",
    },
    {
      id: "9",
      name: "New Business 7",
      description: "Description for New Business 7",
      address: "606 Cedar St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N12",
      rating: 4.4,
      image: "/placeholder.svg",
    },
    {
      id: "10",
      name: "New Business 8",
      description: "Description for New Business 8",
      address: "707 Birch St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N13",
      rating: 4.2,
      image: "/placeholder.svg",
    },
    {
      id: "11",
      name: "New Business 9",
      description: "Description for New Business 9",
      address: "808 Maple St",
      city: "Toronto",
      state: "ON",
      zip: "M5V 2N14",
      rating: 4.3,
      image: "/placeholder.svg",
    },
  ];

  // Use mock data if the real function returns an error
  const businesses: BusinessData[] = (
    result.success && "data" in result && Array.isArray(result.data)
      ? result.data
      : mockData
  ) as BusinessData[];

  if (businesses.length === 0) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p>No new businesses available in this location</p>
      </div>
    );
  }

  const processedBusinesses = businesses.slice(0, 8).map((business) => ({
    id: business.id,
    name: business.name,
    description: business.description,
    address: `${business.address}, ${business.city}, ${business.state} ${business.zip}`,
    rating: business.rating,
    image: business.image || "/placeholder.svg",
  }));

  return (
    <div className="space-y-4">
      <SectionHeading
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
        title="Newly Added"
        href="/business-profiles/new"
      />
      <NewlyAddedBusinessesClient businesses={processedBusinesses} />
    </div>
  );
}

// Categories section with server component
async function CategoriesSection() {
  const result = await getActiveCategories();

  // Mock data for development since the real function might not be fully implemented yet
  const mockCategories = [
    {
      id: "1",
      name: "Restaurants",
      slug: "restaurants",
      icon: "utensils",
      description: "Find local restaurants and eateries",
      active: true,
    },
    {
      id: "2",
      name: "Retail",
      slug: "retail",
      icon: "shopping-bag",
      description: "Discover retail shops in your area",
      active: true,
    },
    {
      id: "3",
      name: "Services",
      slug: "services",
      icon: "tool",
      description: "Professional services for your needs",
      active: true,
    },
    {
      id: "4",
      name: "Health & Wellness",
      slug: "health-wellness",
      icon: "heart",
      description: "Health and wellness businesses",
      active: true,
    },
    {
      id: "5",
      name: "Technology",
      slug: "technology",
      icon: "laptop",
      description: "Technology and IT services",
      active: true,
    },
  ];

  // Use mock data if the API call fails
  if (!result.success || !result.data || result.data.length === 0) {
    console.log("Using mock category data for development");
    return <CategorySection categories={mockCategories} />;
  }

  return <CategorySection categories={result.data} />;
}

// Main page component
export default function Home() {
  // For Next.js server component - no client-side hooks allowed
  return (
    <>
      {/* Hero section with full-width sliding banner */}
      <div className="w-full">
        <SlidingBanner />
      </div>

      <div className="container mx-auto px-4">
        {/* Search section with glass morphism effect */}
        <section className="relative -mt-16 z-10 mb-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-border/10">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Find Local Businesses
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-center">
                Discover and connect with the best local businesses in your
                area. From restaurants to home services, find what you need.
              </p>

              {/* Search component */}
              <div className="mt-8">
                <HomepageSearch popularSearches={popularSearches} />
              </div>
            </div>
          </div>
        </section>

        {/* Popular categories */}
        <section className="mb-12">
          <PopularCategories useEmoji={true} />
        </section>

        {/* Featured businesses section with card glow effect */}
        <section className="mb-16">
          <Suspense fallback={<BusinessesLoading />}>
            <FeaturedBusinessesSection />
          </Suspense>
        </section>

        {/* Call to action section - moved up for better visibility */}
        <section className="mb-16 relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-primary/5 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="absolute inset-0 bg-opacity-20 mix-blend-overlay">
              <svg
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="pattern"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="1.5"
                      fill="rgba(255,255,255,0.1)"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
            <div className="relative z-10 md:flex justify-between items-center">
              <div className="mb-6 md:mb-0 md:max-w-lg">
                <h2 className="text-3xl font-bold text-white mb-3">
                  Own a Business?
                </h2>
                <p className="text-white/80 text-lg">
                  Join thousands of business owners who are growing their
                  customer base through BusinessHub. Register today and boost
                  your online presence!
                </p>
              </div>
              <Button
                size="lg"
                variant="default"
                className="font-medium bg-gradient-to-r from-indigo-500/90 via-purple-500 to-pink-500/90 hover:from-indigo-600/90 hover:via-purple-600 hover:to-pink-600/90"
                asChild
              >
                <Link href="/owner/business-profiles/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your Business
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newly added businesses section */}
        <section className="mb-16">
          <Suspense fallback={<MoreBusinessesLoading />}>
            <NewlyAddedBusinessesSection />
          </Suspense>
        </section>

        {/* All categories section - smaller and more compact at the bottom */}
        <section className="mb-16">
          <SectionHeading
            icon={<Grid className="h-5 w-5 text-primary" />}
            title="Browse All Categories"
            href="/categories"
          />
          <div className="bg-muted/20 py-6 px-6 rounded-lg">
            <Suspense fallback={<CategoriesLoading />}>
              <CategoriesSection />
            </Suspense>
          </div>
        </section>

        {/* Testimonials section with improved cards */}
        <section className="mb-16">
          <SectionHeading
            icon={<Star className="h-5 w-5 text-primary" />}
            title="What Our Users Say"
            href="/testimonials"
          />
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Restaurant Owner",
                  text: "BusinessHub completely transformed how I connect with customers. After joining, I saw a 40% increase in new customer visits within just 3 months!",
                  image: "/placeholder.svg",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Customer",
                  text: "I use BusinessHub every time I need a local service. The reviews are honest, and I&apos;ve discovered so many amazing businesses I wouldn&apos;t have found otherwise.",
                  image: "/placeholder.svg",
                  rating: 5,
                },
                {
                  name: "Jessica Williams",
                  role: "Salon Owner",
                  text: "As a small business owner, visibility is everything. BusinessHub made it easy to showcase my services and helped me establish a strong online presence.",
                  image: "/placeholder.svg",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border/40 hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <div className="flex mt-1">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-primary text-primary"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="text-muted-foreground relative z-10 pl-2 text-sm italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
                asChild
              >
                <Link href="/testimonials">View All Testimonials</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
