"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HomepageSearchProps {
  popularSearches?: string[]
}

export function HomepageSearch({ popularSearches = [] }: HomepageSearchProps) {
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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="What are you looking for?"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-40">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Location"
            className="pl-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      
      {popularSearches.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular:</span>
            {popularSearches.map((term) => (
              <span
                key={term} 
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handlePopularSearch(term)}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 