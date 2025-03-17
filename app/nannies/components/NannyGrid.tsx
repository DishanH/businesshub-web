"use client"

import { useState, useEffect } from "react"
import { LayoutGrid, List, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import NannyCard from "./NannyCard"

// Mock data for nannies (will be replaced with API data later)
const NANNIES = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "/placeholder.svg",
    location: "Downtown Toronto",
    experience: "5 years",
    rating: 4.8,
    specialties: ["Newborns", "Toddlers", "Special Needs"],
    availability: "Full-time",
    hourlyRate: "$25-30",
    description: "Certified early childhood educator with extensive experience in newborn care and developmental activities.",
    languages: ["English", "French"],
    reviews: 48
  },
  {
    id: "2",
    name: "Maria Garcia",
    image: "/placeholder.svg",
    location: "North York",
    experience: "8 years",
    rating: 4.9,
    specialties: ["School Age", "Homework Help", "Arts & Crafts"],
    availability: "Part-time",
    hourlyRate: "$28-35",
    description: "Former elementary teacher specializing in educational activities and homework assistance.",
    languages: ["English", "Spanish"],
    reviews: 62
  },
  {
    id: "3",
    name: "Emily Chen",
    image: "/placeholder.svg",
    location: "Scarborough",
    experience: "3 years",
    rating: 4.7,
    specialties: ["Infants", "Music Education", "First Aid Certified"],
    availability: "Flexible",
    hourlyRate: "$23-28",
    description: "Trained in infant care and early childhood music education. CPR and First Aid certified.",
    languages: ["English", "Mandarin"],
    reviews: 31
  },
  {
    id: "4",
    name: "Jessica Williams",
    image: "/placeholder.svg",
    location: "Etobicoke",
    experience: "6 years",
    rating: 4.9,
    specialties: ["Multiple Children", "Meal Planning", "Educational Activities"],
    availability: "Full-time",
    hourlyRate: "$26-32",
    description: "Experienced with caring for multiple children and creating engaging educational activities.",
    languages: ["English"],
    reviews: 55
  }
]

export default function NannyGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [likedNannies, setLikedNannies] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isGridLayout, setIsGridLayout] = useState(false)
  
  const ITEMS_PER_PAGE = 6
  
  const filteredNannies = NANNIES.filter(nanny => 
    nanny.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nanny.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nanny.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )
  
  const totalPages = Math.ceil(filteredNannies.length / ITEMS_PER_PAGE)
  const paginatedNannies = filteredNannies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    // Load liked nannies from localStorage on initial render
    const savedLikes = localStorage.getItem('likedNannies')
    if (savedLikes) {
      setLikedNannies(JSON.parse(savedLikes))
    }
  }, [])

  const toggleLike = (id: string) => {
    setLikedNannies(prev => {
      const newLikes = prev.includes(id) 
        ? prev.filter(nId => nId !== id) 
        : [...prev, id]
      
      // Save to localStorage whenever likes change
      localStorage.setItem('likedNannies', JSON.stringify(newLikes))
      return newLikes
    })
  }

  return (
    <div className="flex-1">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search nannies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6"
          />
        </div>
      </div>

      {/* Layout Toggle */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Button
            variant={isGridLayout ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setIsGridLayout(true)}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={!isGridLayout ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setIsGridLayout(false)}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Nanny Cards */}
      <div className={isGridLayout 
        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
        : "flex flex-col gap-4"
      }>
        {paginatedNannies.map((nanny) => (
          <NannyCard
            key={nanny.id}
            nanny={nanny}
            isGridLayout={isGridLayout}
            isLiked={likedNannies.includes(nanny.id)}
            onLike={toggleLike}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
    </div>
  )
} 