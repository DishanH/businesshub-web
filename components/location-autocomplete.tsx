"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, ChevronDown, Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Location data
const locationData = {
  toronto: {
    name: "Toronto",
    divisions: [
      { id: "downtown", name: "Downtown Toronto" },
      { id: "north-york", name: "North York" },
      { id: "scarborough", name: "Scarborough" },
      { id: "etobicoke", name: "Etobicoke" },
      { id: "york", name: "York" },
      { id: "east-york", name: "East York" },
      { id: "beaches", name: "The Beaches" },
      { id: "liberty-village", name: "Liberty Village" },
      { id: "distillery-district", name: "Distillery District" },
      { id: "kensington-market", name: "Kensington Market" },
      { id: "chinatown", name: "Chinatown" },
      { id: "little-italy", name: "Little Italy" },
      { id: "greektown", name: "Greektown" },
      { id: "yorkville", name: "Yorkville" },
      { id: "high-park", name: "High Park" },
    ]
  },
  mississauga: {
    name: "Mississauga",
    divisions: [
      { id: "port-credit", name: "Port Credit" },
      { id: "streetsville", name: "Streetsville" },
      { id: "meadowvale", name: "Meadowvale" },
      { id: "erin-mills", name: "Erin Mills" },
      { id: "cooksville", name: "Cooksville" },
      { id: "lakeview", name: "Lakeview" },
      { id: "clarkson", name: "Clarkson" },
      { id: "malton", name: "Malton" },
      { id: "heartland", name: "Heartland" },
      { id: "square-one", name: "City Centre (Square One)" },
      { id: "east-credit", name: "East Credit" },
      { id: "creditview", name: "Creditview" },
      { id: "hurontario", name: "Hurontario" },
      { id: "lisgar", name: "Lisgar" },
      { id: "churchill-meadows", name: "Churchill Meadows" },
    ]
  }
}

type LocationCity = "toronto" | "mississauga";

export type LocationOption = {
  id: string;
  name: string;
  city?: string;
  isNearby?: boolean;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  city?: LocationCity;
  className?: string;
}

export function LocationAutocomplete({ 
  value, 
  onChange, 
  city = "toronto",
  className 
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<LocationOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const optionsRef = useRef<(HTMLDivElement | null)[]>([])
  
  // Generate options based on the city
  useEffect(() => {
    const currentCity = locationData[city]
    
    // Create nearby option
    const nearbyOption: LocationOption = {
      id: "nearby",
      name: "Nearby",
      isNearby: true
    }
    
    // Create city option
    const cityOption: LocationOption = {
      id: city,
      name: currentCity.name,
      city: city
    }
    
    // Create subdivision options
    const subdivisionOptions: LocationOption[] = currentCity.divisions.map(division => ({
      id: division.id,
      name: division.name,
      city: city
    }))
    
    setOptions([nearbyOption, cityOption, ...subdivisionOptions])
    setActiveIndex(-1)
  }, [city])
  
  // Reset activeIndex when filtering changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [searchQuery])
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const filtered = filteredOptions;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prevIndex => (prevIndex < filtered.length - 1 ? prevIndex + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : filtered.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelectOption(filtered[activeIndex].name)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }
  
  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && optionsRef.current[activeIndex]) {
      optionsRef.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [activeIndex])
  
  // Filter options based on search query
  const filteredOptions = searchQuery.trim() === "" 
    ? options
    : options.filter(option => 
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
  const handleSelectOption = (optionName: string) => {
    onChange(optionName)
    setOpen(false)
    setSearchQuery("")
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background hover:bg-background/90 text-left font-normal border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50", 
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {value || "Location"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start" 
        sideOffset={2} 
        side="bottom"
      >
        <div className="rounded-lg border-0 overflow-hidden w-full bg-popover">
          <div className="flex items-center border-b px-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No location found.
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option, index) => (
                  <div 
                    key={option.id}
                    onClick={() => handleSelectOption(option.name)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center gap-2 py-2.5 px-2 cursor-pointer hover:bg-primary/10 active:bg-primary/20 rounded-sm my-0.5 ${activeIndex === index ? 'bg-primary/10' : ''}`}
                    role="option"
                    tabIndex={0}
                    ref={el => {
                      // Update the refs array
                      if (optionsRef.current.length <= index) {
                        optionsRef.current = Array(filteredOptions.length).fill(null);
                      }
                      optionsRef.current[index] = el;
                    }}
                  >
                    {option.isNearby ? (
                      <MapPin className="h-4 w-4 text-blue-500" />
                    ) : option.city ? (
                      <span className="h-4 w-4 flex items-center justify-center">🏙️</span>
                    ) : (
                      <span className="h-4 w-4 flex items-center justify-center">📍</span>
                    )}
                    <span className="text-sm">{option.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 