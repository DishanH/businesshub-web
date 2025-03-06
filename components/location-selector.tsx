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
import { useEffect } from "react"
import Cookies from "js-cookie"

export function LocationSelector() {
  const { location, setLocation, locations } = useLocation()

  // Set cookie when location changes
  useEffect(() => {
    Cookies.set("selectedLocation", location.id, { expires: 365 })
  }, [location])

  const handleLocationChange = (value: string) => {
    const newLocation = locations.find(loc => loc.id === value)
    if (newLocation) {
      setLocation(newLocation)
      // Set cookie
      Cookies.set("selectedLocation", newLocation.id, { expires: 365 })
      // Refresh the page to apply the location filter
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <MapPin className="h-4 w-4 text-primary" />
      <Select value={location.id} onValueChange={handleLocationChange}>
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