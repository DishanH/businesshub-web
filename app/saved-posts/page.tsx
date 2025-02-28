"use client"

import { useState } from "react"
import { Heart, History, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BusinessCard from "@/components/business-card"

// Mock data - replace with actual data fetching
const LIKED_POSTS = [
  {
    id: "1",
    name: "Best Coffee Shops in Downtown",
    description: "Discover the top-rated coffee spots in the heart of the city. We've curated a list of the most charming and delicious coffee destinations that will satisfy any coffee lover's cravings.",
    address: "Urban Brew Co.",
    rating: 4.5,
    image: "/placeholder.svg",
    date: "2024-02-28",
    likes: 245
  },
  {
    id: "2",
    name: "Top 10 Italian Restaurants",
    description: "Experience authentic Italian cuisine at these amazing restaurants. From traditional pasta dishes to wood-fired pizzas, these establishments offer the best of Italy.",
    address: "Foodie Guide",
    rating: 4.2,
    image: "/placeholder.svg",
    date: "2024-02-26",
    likes: 198
  },
  {
    id: "3",
    name: "Hidden Gems: Local Boutiques",
    description: "Explore unique shopping experiences at these lesser-known but fantastic local boutiques. Support small businesses while discovering one-of-a-kind items.",
    address: "Shop Local",
    rating: 4.8,
    image: "/placeholder.svg",
    date: "2024-02-25",
    likes: 167
  },
  {
    id: "4",
    name: "Fitness Studios Near You",
    description: "Find the perfect workout spot with our comprehensive guide to local fitness studios. From yoga to HIIT, there's something for everyone.",
    address: "Fit Life",
    rating: 4.6,
    image: "/placeholder.svg",
    date: "2024-02-24",
    likes: 142
  },
]

const RECENT_POSTS = [
  {
    id: "1",
    name: "Weekend Food Festival",
    description: "Join us for the biggest food festival of the year featuring local restaurants. Sample dishes from over 50 vendors and enjoy live entertainment throughout the weekend.",
    address: "City Events",
    rating: 4.7,
    image: "/placeholder.svg",
    date: "2024-02-27",
    likes: 189
  },
  {
    id: "2",
    name: "New Tech Hub Opening",
    description: "A state-of-the-art technology center is opening its doors next month. Learn about the facilities and upcoming events for tech enthusiasts.",
    address: "Tech Space",
    rating: 4.4,
    image: "/placeholder.svg",
    date: "2024-02-26",
    likes: 156
  },
  {
    id: "3",
    name: "Artisan Market Showcase",
    description: "Local artisans will be displaying their handcrafted goods at the monthly market. Don't miss this opportunity to support local creators.",
    address: "Craft Community",
    rating: 4.3,
    image: "/placeholder.svg",
    date: "2024-02-25",
    likes: 134
  },
  {
    id: "4",
    name: "Spring Garden Workshop",
    description: "Learn essential gardening tips and tricks from expert horticulturists. Perfect for beginners and experienced gardeners alike.",
    address: "Green Thumb",
    rating: 4.5,
    image: "/placeholder.svg",
    date: "2024-02-24",
    likes: 122
  },
]

// Extract unique categories from posts
const extractCategories = (posts: typeof LIKED_POSTS) => {
  const categories = new Set<string>()
  posts.forEach(post => {
    // Extract categories based on common keywords in title and description
    const text = `${post.name} ${post.description}`.toLowerCase()
    if (text.includes('coffee') || text.includes('cafe')) categories.add('Cafes')
    if (text.includes('restaurant') || text.includes('food')) categories.add('Restaurants')
    if (text.includes('shop') || text.includes('boutique')) categories.add('Shopping')
    if (text.includes('fitness') || text.includes('workout')) categories.add('Fitness')
    if (text.includes('tech') || text.includes('technology')) categories.add('Tech')
    if (text.includes('event') || text.includes('festival')) categories.add('Events')
    if (text.includes('market') || text.includes('artisan')) categories.add('Local Markets')
  })
  return Array.from(categories)
}

export default function SavedPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [likedBusinesses, setLikedBusinesses] = useState<string[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likedBusinesses')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const postsPerPage = 6

  const categories = Array.from(new Set([
    ...extractCategories(LIKED_POSTS),
    ...extractCategories(RECENT_POSTS)
  ])).sort()

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const filterPosts = (posts: typeof LIKED_POSTS) => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategories = selectedCategories.length === 0 || 
        selectedCategories.some(cat => {
          const text = `${post.name} ${post.description}`.toLowerCase()
          return text.includes(cat.toLowerCase())
        })

      return matchesSearch && matchesCategories
    })
  }

  const paginatePosts = (posts: typeof LIKED_POSTS) => {
    const startIndex = (currentPage - 1) * postsPerPage
    return posts.slice(startIndex, startIndex + postsPerPage)
  }

  const handleLike = (id: string) => {
    setLikedBusinesses(prev => {
      const newLikes = prev.includes(id) 
        ? prev.filter(businessId => businessId !== id)
        : [...prev, id]
      
      // Save to localStorage
      localStorage.setItem('likedBusinesses', JSON.stringify(newLikes))
      return newLikes
    })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-foreground">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Saved Businesses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Businesses</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your favorite and recently viewed businesses
            </p>
          </div>
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        <Tabs defaultValue="favorites" className="space-y-4">
          <TabsList>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recently Viewed Businesses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatePosts(filterPosts(LIKED_POSTS)).map((post) => (
                <BusinessCard 
                  key={post.id} 
                  business={post} 
                  onLike={handleLike}
                  isLiked={likedBusinesses.includes(post.id)}
                />
              ))}
            </div>
            {filterPosts(LIKED_POSTS).length > postsPerPage && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(filterPosts(LIKED_POSTS).length / postsPerPage) }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filterPosts(LIKED_POSTS).length / postsPerPage), prev + 1))}
                      className={currentPage === Math.ceil(filterPosts(LIKED_POSTS).length / postsPerPage) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatePosts(filterPosts(RECENT_POSTS)).map((post) => (
                <BusinessCard 
                  key={post.id} 
                  business={post} 
                  onLike={handleLike}
                  isLiked={likedBusinesses.includes(post.id)}
                />
              ))}
            </div>
            {filterPosts(RECENT_POSTS).length > postsPerPage && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(filterPosts(RECENT_POSTS).length / postsPerPage) }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filterPosts(RECENT_POSTS).length / postsPerPage), prev + 1))}
                      className={currentPage === Math.ceil(filterPosts(RECENT_POSTS).length / postsPerPage) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 