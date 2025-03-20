"use client"

import { useRouter } from "next/navigation"
import { MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocation } from "@/components/location-context"

export function HeaderLocationSelector() {
  const router = useRouter()
  const { location, setLocation, locations } = useLocation()
  
  const handleCityChange = (cityId: string) => {
    console.log('HeaderLocationSelector: Changing city to:', cityId)
    const newLocation = locations.find(city => city.id === cityId)
    if (!newLocation) return
    
    // Let the context handle everything
    setLocation(newLocation)
    
    // Refresh the current page to reflect the new location
    router.refresh()
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-2 border-transparent bg-transparent hover:bg-primary/5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium">{location.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {locations.map((city) => (
          <DropdownMenuItem
            key={city.id}
            onClick={() => handleCityChange(city.id)}
            className={`flex items-center gap-2 ${city.id === location.id ? 'bg-primary/10 text-primary' : ''}`}
          >
            {city.id === location.id && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary absolute left-2" />
            )}
            <MapPin className="h-3.5 w-3.5" />
            {city.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 