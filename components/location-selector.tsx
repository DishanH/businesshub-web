"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { useLocation } from "@/components/location-context"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export function LocationSelector() {
  const { location, setLocation, locations } = useLocation()
  const [selectedValue, setSelectedValue] = useState(location.id)

  // Update the selected value when location changes from context
  useEffect(() => {
    setSelectedValue(location.id)
  }, [location])

  const handleLocationChange = (value: string) => {
    const newLocation = locations.find(loc => loc.id === value)
    if (newLocation) {
      // Update the selected value immediately for the dropdown
      setSelectedValue(value)
      
      // Update the context and save to cookies
      setLocation(newLocation)
      
      // Set cookie with proper options
      Cookies.set("selectedLocation", value, { 
        expires: 365, 
        path: '/',
        sameSite: 'strict'
      })
      
      // Refresh the page to apply the location filter
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <MapPin className="h-4 w-4 text-primary" />
      <Select value={selectedValue} onValueChange={handleLocationChange}>
        <SelectTrigger className="w-[140px] bg-transparent border-0 hover:bg-white/10 transition-colors">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 