"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFormProps {
  initialQuery: string
}

export default function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search businesses, services, or categories..."
          className="pl-10 pr-20 py-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-[calc(100%-0.5rem)] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Search className="h-4 w-4 mr-2 hidden sm:inline-flex" />
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">Go</span>
        </Button>
      </div>
    </form>
  )
} 