"use client"

import { useState } from "react"
import { Heart, History } from "lucide-react"
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

export default function SavedPostsPage() {
  const [likedPosts] = useState(LIKED_POSTS)
  const [recentPosts] = useState(RECENT_POSTS)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3 // Mock total pages

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-foreground">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Saved Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Posts</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your liked posts and recent activity
          </p>
        </div>

        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Liked Posts
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {likedPosts.map((post) => (
                <BusinessCard key={post.id} business={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BusinessCard key={post.id} business={post} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
} 