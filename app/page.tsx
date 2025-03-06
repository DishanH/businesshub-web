"use client"

import { useState, useEffect, useRef } from "react"
import { CarouselComponent } from "@/components/carousel"
import BusinessCard from "@/components/business-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryBadge } from "@/components/category-badge"
import { useRouter } from "next/navigation"
import { VerificationSuccess } from "@/components/VerificationSuccess"
import { AdminButton } from "@/components/AdminButton"

interface Business {
  id: string
  name: string
  address: string
  description: string
  rating: number
  image: string
}

interface LocationData {
  [key: string]: Business[]
}

// Mock data for demonstration
const businessesByLocation: LocationData = {
  toronto: [
    {
      id: "1",
      name: "Sweet Delights Bakery",
      address: "123 Main St, Toronto, ON",
      description: "Artisanal cakes and pastries for all occasions.",
      rating: 4.5,
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Quick Fix Plumbing",
      address: "456 Oak Ave, Toronto, ON",
      description: "24/7 emergency plumbing services.",
      rating: 4.2,
      image: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Green Thumb Landscaping",
      address: "789 Pine Rd, Toronto, ON",
      description: "Professional landscaping and garden maintenance.",
      rating: 4.8,
      image: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Tech Wizards",
      address: "101 Byte Ln, Toronto, ON",
      description: "Expert computer repair and IT support.",
      rating: 4.6,
      image: "/placeholder.svg",
    },
    {
      id: "5",
      name: "Tech Wizards",
      address: "101 Byte Ln, Toronto, ON",
      description: "Expert computer repair and IT support.",
      rating: 4.6,
      image: "/placeholder.svg",
    },
    {
      id: "6",
      name: "Tech Wizards",
      address: "101 Byte Ln, Toronto, ON",
      description: "Expert computer repair and IT support.",
      rating: 4.6,
      image: "/placeholder.svg",
    },
    {
      id: "7",
      name: "Sweet Delights Bakery",
      address: "123 Main St, Toronto, ON",
      description: "Artisanal cakes and pastries for all occasions.",
      rating: 4.5,
      image: "/placeholder.svg",
    },
    {
      id: "8",
      name: "Quick Fix Plumbing",
      address: "456 Oak Ave, Toronto, ON",
      description: "24/7 emergency plumbing services.",
      rating: 4.2,
      image: "/placeholder.svg",
    },
  ],
  vancouver: [
    {
      id: "5",
      name: "Pacific Sushi",
      address: "234 Ocean Dr, Vancouver, BC",
      description: "Fresh, authentic sushi and Japanese cuisine.",
      rating: 4.7,
      image: "/placeholder.svg",
    },
    {
      id: "6",
      name: "Mountain View Fitness",
      address: "567 Peak St, Vancouver, BC",
      description: "State-of-the-art gym with personal trainers and group classes.",
      rating: 4.6,
      image: "/placeholder.svg",
    },
    {
      id: "7",
      name: "Coastal Auto Repair",
      address: "789 Harbor Rd, Vancouver, BC",
      description: "Expert auto repair and maintenance services.",
      rating: 4.4,
      image: "/placeholder.svg",
    },
    {
      id: "8",
      name: "West Coast Web Design",
      address: "321 Tech Ave, Vancouver, BC",
      description: "Custom web design and development solutions.",
      rating: 4.8,
      image: "/placeholder.svg",
    },
  ],
}

const topSellersByLocation = {
  toronto: [
    { id: "1", name: "John Doe", shopName: "Sweet Delights Bakery", image: "/placeholder.svg" },
    { id: "2", name: "Jane Smith", shopName: "Quick Fix Plumbing", image: "/placeholder.svg" },
    { id: "3", name: "Bob Johnson", shopName: "Green Thumb Landscaping", image: "/placeholder.svg" },
    { id: "4", name: "Alice Brown", shopName: "Tech Wizards", image: "/placeholder.svg" },
  ],
  vancouver: [
    { id: "5", name: "David Lee", shopName: "Pacific Sushi", image: "/placeholder.svg" },
    { id: "6", name: "Sarah Chen", shopName: "Mountain View Fitness", image: "/placeholder.svg" },
    { id: "7", name: "Mike Wilson", shopName: "Coastal Auto Repair", image: "/placeholder.svg" },
    { id: "8", name: "Emily Taylor", shopName: "West Coast Web Design", image: "/placeholder.svg" },
  ],
}

const newlyAddedBusinesses = [
  {
    id: "new1",
    name: "Fresh Eats Deli",
    address: "789 Elm St, Toronto, ON",
    description: "Gourmet sandwiches and salads made with locally sourced ingredients.",
    rating: 4.7,
    image: "/placeholder.svg",
  },
  {
    id: "new2",
    name: "Zen Yoga Studio",
    address: "456 Oak Ave, Vancouver, BC",
    description: "Peaceful yoga classes for all levels in a serene environment.",
    rating: 4.9,
    image: "/placeholder.svg",
  },
  {
    id: "new3",
    name: "TechFix Solutions",
    address: "123 Maple Rd, Toronto, ON",
    description: "Quick and reliable tech repair services for all your devices.",
    rating: 4.6,
    image: "/placeholder.svg",
  },
  {
    id: "new4",
    name: "Green Clean Services",
    address: "987 Pine St, Vancouver, BC",
    description: "Eco-friendly cleaning services for homes and offices.",
    rating: 4.8,
    image: "/placeholder.svg",
  },
]

const categories = getActiveCategories()

function getActiveCategories() {
  return [
    {
      id: "food",
      name: "Food",
      slug: "food",
      subcategories: ["restaurant", "cafe", "bakery", "grocery"],
    },
    {
      id: "home-services",
      name: "Home Services",
      slug: "home-services",
      subcategories: ["plumbing", "cleaning", "renovation", "repair"],
    },
    {
      id: "health-fitness",
      name: "Health & Fitness",
      slug: "health-fitness",
      subcategories: ["gym", "yoga", "nutrition", "therapy"],
    },
    {
      id: "automotive",
      name: "Automotive",
      slug: "automotive",
      subcategories: ["repair", "dealership", "parts", "rental"],
    },
    {
      id: "technology",
      name: "Technology",
      slug: "technology",
      subcategories: ["computer", "software", "repair", "development"],
    },
    {
      id: "beauty-spa",
      name: "Beauty & Spa",
      slug: "beauty-spa",
      subcategories: ["salon", "massage", "skincare", "nail"],
    },
    {
      id: "education",
      name: "Education",
      slug: "education",
      subcategories: ["school", "tutor", "course", "training"],
    },
    {
      id: "entertainment",
      name: "Entertainment",
      slug: "entertainment",
      subcategories: ["theater", "music", "art", "events"],
    },
  ]
}

export default function Home() {
  const router = useRouter()
  const [location, setLocation] = useState<"toronto" | "vancouver">("toronto")
  const [businesses, setBusinesses] = useState(businessesByLocation[location])
  const [topSellers, setTopSellers] = useState(topSellersByLocation[location])
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [likedBusinesses, setLikedBusinesses] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likedBusinesses')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    setLoading(true)
    // Simulating API call
    setTimeout(() => {
      setBusinesses(businessesByLocation[location])
      setTopSellers(topSellersByLocation[location])
      setLoading(false)
    }, 1000)
  }, [location])

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories
        .filter(
          (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.subcategories.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        .map((category) => category.name)
      setSuggestedCategories(filtered)
    } else {
      setSuggestedCategories([])
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(true)
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev.slice(0, 4)])
    }
  }

  const handleSelectSuggestion = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(false)
    if (!recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev.slice(0, 4)])
    }
    router.push(`/posts?search=${encodeURIComponent(value)}`)
  }

  const handleLike = (id: string) => {
    setLikedBusinesses(prev => {
      const newLikes = prev.includes(id) 
        ? prev.filter(businessId => businessId !== id)
        : [...prev, id]
      localStorage.setItem('likedBusinesses', JSON.stringify(newLikes))
      return newLikes
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VerificationSuccess />
      
      <div className="space-y-12">
        <div className="sticky top-0 z-10 bg-background shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-lg" ref={searchRef}>
                <Input
                  type="search"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(`/posts?search=${encodeURIComponent(searchQuery)}`)
                    }
                  }}
                  className="w-full pr-10"
                  onFocus={() => setShowSuggestions(true)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {showSuggestions && (searchQuery || recentSearches.length > 0) && (
                  <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-10">
                    {searchQuery && suggestedCategories.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-sm font-semibold mb-1">Categories</h3>
                        {suggestedCategories.map((category) => (
                          <div
                            key={category}
                            className="cursor-pointer p-1 hover:bg-gray-100"
                            onClick={() => handleSelectSuggestion(category)}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                    {recentSearches.length > 0 && (
                      <div className="p-2">
                        <h3 className="text-sm font-semibold mb-1">Recent Searches</h3>
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="cursor-pointer p-1 hover:bg-gray-100"
                            onClick={() => handleSelectSuggestion(search)}
                          >
                            {search}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <Select 
                  value={location} 
                  onValueChange={(value: "toronto" | "vancouver") => setLocation(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toronto">Toronto</SelectItem>
                    <SelectItem value="vancouver">Vancouver</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="default" 
                  className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gradient-to-r from-indigo-500/90 via-purple-500 to-pink-500/90 hover:from-indigo-600/90 hover:via-purple-600 hover:to-pink-600/90" 
                  asChild
                >
                  <Link href="/add-business">
                    <Plus className="h-4 w-4 group-hover:animate-pulse" />
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">Add Business</span>
                  </Link>
                </Button>
                {/* <AdminButton /> */}
              </div>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{location}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <section className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-4xl font-bold">Discover Local Businesses</h1>
              <p className="text-lg">
                Connect with the best local businesses in {location}. From artisanal bakeries to expert plumbers, find the
                services you need from trusted professionals in your community.
              </p>
            </div>
            <div className="md:w-1/2">
              <CarouselComponent />
            </div>
          </section>

          <section className="text-center my-12">
            <h2 className="text-2xl font-semibold mb-6">Top Rated Sellers in {location}</h2>
            <div className="flex flex-nowrap justify-center gap-8 overflow-x-auto pb-4">
              {topSellers.map((seller) => (
                <div key={seller.id} className="flex flex-col items-center flex-shrink-0">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={seller.image} alt={seller.name} />
                    <AvatarFallback>
                      {seller.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="mt-2 font-semibold">{seller.name}</span>
                  <span className="text-sm text-muted-foreground">{seller.shopName}</span>
                </div>
              ))}
            </div>
            <section className="my-6 flex flex-col items-center border-y border-border">
              <div className="p-6">
                <div className="">
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category) => (
                      <CategoryBadge
                        key={category.id}
                        name={category.name}
                        count={category.subcategories.length}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        href={`/posts?category=${category.slug}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Featured Businesses in {location}</h2>
              <Link 
                href="/posts?sort=rating" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group"
              >
                <span className="font-medium">More</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : businesses
                    .slice(0, 8)
                    .map((business) => (
                      <BusinessCard 
                        key={business.id} 
                        business={business}
                        onLike={handleLike}
                        isLiked={likedBusinesses.includes(business.id)}
                      />
                    ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Newly Added Businesses</h2>
              <Link 
                href="/posts?sort=date" 
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group"
              >
                <span className="font-medium">More</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : newlyAddedBusinesses
                    .slice(0, 8)
                    .map((business) => (
                      <BusinessCard 
                        key={business.id} 
                        business={business}
                        onLike={handleLike}
                        isLiked={likedBusinesses.includes(business.id)}
                      />
                    ))}
            </div>
          </section>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2024 Local Business Hub. All rights reserved.</p>
          <p>123 Business Street, {location === "toronto" ? "Toronto, ON M5V 2H1" : "Vancouver, BC V6B 1A1"}</p>
          <p>Email: info@localbusinesshub.com | Phone: (123) 456-7890</p>
        </footer>
      </div>
    </div>
  )
}

