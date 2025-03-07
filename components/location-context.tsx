"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import Cookies from "js-cookie"

// Define the location type
export interface Location {
  id: string
  name: string
}

// Available locations
export const availableLocations: Location[] = [
  { id: "toronto", name: "Toronto" },
  { id: "mississauga", name: "Mississauga" },
  { id: "hamilton", name: "Hamilton" },
  { id: "vaughan", name: "Vaughan" },
  { id: "markham", name: "Markham" },
  { id: "richmond-hill", name: "Richmond Hill" },
  { id: "oakville", name: "Oakville" },
  { id: "burlington", name: "Burlington" },
  { id: "oshawa", name: "Oshawa" },
  { id: "brampton", name: "Brampton" }
]

// Define the context type
interface LocationContextType {
  location: Location
  setLocation: (location: Location) => void
  locations: Location[]
}

// Create the context with a default value
const LocationContext = createContext<LocationContextType>({
  location: availableLocations[0],
  setLocation: () => {},
  locations: availableLocations
})

// Provider component
export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(availableLocations[0])
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load the saved location from cookies on mount
  useEffect(() => {
    const savedLocationId = Cookies.get("selectedLocation")
    if (savedLocationId) {
      const savedLocation = availableLocations.find(loc => loc.id === savedLocationId)
      if (savedLocation) {
        setLocationState(savedLocation)
      }
    }
    setIsInitialized(true)
  }, [])
  
  // Function to set location and save to cookies
  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation)
    // Only set cookie if it's a different value to avoid unnecessary writes
    const currentLocationId = Cookies.get("selectedLocation")
    if (currentLocationId !== newLocation.id) {
      Cookies.set("selectedLocation", newLocation.id, { 
        expires: 365,
        path: '/',
        sameSite: 'strict'
      })
    }
  }
  
  // Don't render children until we've checked for the cookie
  if (!isInitialized) {
    return null
  }
  
  return (
    <LocationContext.Provider value={{ location, setLocation, locations: availableLocations }}>
      {children}
    </LocationContext.Provider>
  )
}

// Hook to use the location context
export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
} 