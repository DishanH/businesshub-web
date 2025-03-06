"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HomepageSearchProps {
  popularSearches: string[]
}

export function HomepageSearch2({ popularSearches }: HomepageSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for businesses, services, or categories..."
            className="pl-10 pr-20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
          >
            Search
          </Button>
        </div>
      </form>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        {popularSearches.slice(0, 5).map((term) => (
          <Link
            key={term}
            href={`/posts?search=${encodeURIComponent(term)}`}
            className="text-sm text-primary hover:underline"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  )
} 