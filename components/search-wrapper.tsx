"use client"

import { HomepageSearch } from "@/components/homepage-search"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Define the custom event for TypeScript
declare global {
  interface DocumentEventMap {
    'locationChanged': CustomEvent<{ location: { id: string, name: string } }>
  }
}

interface SearchWrapperProps {
  initialQuery?: string
  popularSearches?: string[]
  searchType?: string
  placeholder?: string
  redirectPath?: string // Add option to redirect to different paths
}

export function SearchWrapper({ 
  initialQuery = "", 
  popularSearches = [],
  searchType,
  placeholder = "Search businesses, services, or categories...",
  redirectPath = "/search" // Default redirect to search page
}: SearchWrapperProps) {
  const searchParams = useSearchParams()
  const [locationValue, setLocationValue] = useState("")
  
  useEffect(() => {
    // Get location from URL parameter with fallback
    const location = searchParams.get("location")
    if (location) {
      console.log('SearchWrapper: Setting location from URL param:', location)
      setLocationValue(location)
    }
  }, [searchParams])
  
  // Listen for the custom locationChanged event to update locationValue
  useEffect(() => {
    const handleLocationChange = (e: CustomEvent<{ location: { id: string, name: string } }>) => {
      // When location changes from context, update our locationValue
      console.log('SearchWrapper: Location changed event received:', e.detail.location.name)
      setLocationValue(e.detail.location.name)
    }
    
    document.addEventListener('locationChanged', handleLocationChange)
    return () => {
      document.removeEventListener('locationChanged', handleLocationChange)
    }
  }, [])
  
  return (
    <HomepageSearch 
      popularSearches={popularSearches}
      initialQuery={initialQuery}
      searchType={searchType}
      placeholder={placeholder}
      locationValue={locationValue}
      redirectPath={redirectPath}
    />
  )
} 