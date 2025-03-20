"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LocationAutocomplete } from "@/components/location-autocomplete"

interface HomepageSearchProps {
  popularSearches?: string[]
  defaultCity?: "toronto" | "mississauga"
}

export function HomepageSearch({ popularSearches = [], defaultCity = "toronto" }: HomepageSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set("q", searchTerm.trim())
      if (location.trim()) {
        searchParams.set("location", location.trim())
      }
      router.push(`/search?${searchParams.toString()}`)
    }
  }
  
  const handlePopularSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="flex items-center bg-background rounded-full border border-border/50 shadow-sm hover:shadow transition-all duration-200 p-2 pr-2">
          {/* Search query input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="pl-10 border-0 shadow-none h-10 focus-visible:ring-0 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Vertical divider */}
          <div className="h-8 w-px bg-border/50 mx-2"></div>
          
          {/* Location selector */}
          <div className="w-[225px] hidden md:block">
            <LocationAutocomplete 
              value={location}
              onChange={setLocation}
              city={defaultCity}
              className="border-0 shadow-none h-10 focus-visible:ring-0 bg-transparent"
            />
          </div>
          
          {/* Submit button */}
          <Button 
            type="submit" 
            size="sm"
            className="rounded-full h-9 w-9 bg-primary hover:bg-primary/90 flex items-center justify-center"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mobile location selector (only visible on small screens) */}
        <div className="mt-3 md:hidden">
          <LocationAutocomplete 
            value={location}
            onChange={setLocation}
            city={defaultCity}
            className="h-10 rounded-lg"
          />
        </div>
      </form>
      
      {popularSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-1 font-medium">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term} 
                className="px-3 py-1.5 bg-background dark:bg-gray-800/50 hover:bg-primary/10 rounded-full text-sm border border-border/60 transition-colors flex items-center gap-1.5"
                onClick={() => handlePopularSearch(term)}
              >
                {term === "Restaurants" && <span>🍽️</span>}
                {term === "Plumbers" && <span>🔧</span>}
                {term === "Electricians" && <span>⚡</span>}
                {term === "Dentists" && <span>🦷</span>}
                {term === "Gyms" && <span>💪</span>}
                {term === "Hair Salons" && <span>💇</span>}
                {term === "Coffee Shops" && <span>☕</span>}
                {term === "Auto Repair" && <span>🚗</span>}
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 