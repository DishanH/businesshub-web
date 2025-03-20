"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCookies } from "next-client-cookies"

type City = {
  id: string
  name: string
}

const cities: City[] = [
  { id: "toronto", name: "Toronto" },
  { id: "mississauga", name: "Mississauga" }
]

export function HeaderLocationSelector() {
  const cookies = useCookies()
  const router = useRouter()
  
  // Get city from cookie or default to Toronto
  const [activeCity, setActiveCity] = useState<City>(
    () => {
      const savedCityId = cookies.get("selectedLocation") || "toronto"
      return cities.find(city => city.id === savedCityId) || cities[0]
    }
  )
  
  const handleCityChange = (city: City) => {
    setActiveCity(city)
    cookies.set("selectedLocation", city.id, { path: "/" })
    
    // Refresh the current page to reflect the new location
    router.refresh()
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-2 border-transparent bg-transparent hover:bg-primary/5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-medium">{activeCity.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {cities.map((city) => (
          <DropdownMenuItem
            key={city.id}
            onClick={() => handleCityChange(city)}
            className={`flex items-center gap-2 ${city.id === activeCity.id ? 'bg-primary/10 text-primary' : ''}`}
          >
            {city.id === activeCity.id && (
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