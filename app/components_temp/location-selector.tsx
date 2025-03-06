import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// List of available locations
const locations = [
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

export function LocationSelector2() {
  const [location, setLocation] = useState("toronto")

  const handleLocationChange = (value: string) => {
    setLocation(value)
    // You can add additional logic here, like updating the URL or fetching new data
  }

  return (
    <Select value={location} onValueChange={handleLocationChange}>
      <SelectTrigger className="w-[180px] bg-transparent border-0 hover:bg-white/10 transition-colors">
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
  )
} 