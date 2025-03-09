"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Constants for filter options
const LOCATIONS = [
  "All Locations",
  "Downtown Toronto",
  "North York",
  "Scarborough",
  "Etobicoke",
]

const AVAILABILITY = [
  "Any Availability",
  "Full-time",
  "Part-time",
  "Flexible",
]

const SPECIALTIES = [
  "Newborns",
  "Toddlers",
  "Special Needs",
  "School Age",
  "Homework Help",
  "Arts & Crafts",
  "Music Education",
  "Multiple Children",
  "Meal Planning",
  "First Aid Certified",
]

const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "Mandarin",
]

const RATE_RANGES = [
  "Any Rate",
  "$20-25/hr",
  "$25-30/hr",
  "$30-35/hr",
  "$35+/hr",
]

export default function NannyFilters() {
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedAvailability, setSelectedAvailability] = useState("Any Availability")
  const [selectedRate, setSelectedRate] = useState("Any Rate")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const clearFilters = () => {
    setSelectedLocation("All Locations")
    setSelectedAvailability("Any Availability")
    setSelectedRate("Any Rate")
    setSelectedSpecialties([])
    setSelectedLanguages([])
  }

  return (
    <>
      {/* Mobile Filters */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                {(selectedSpecialties.length > 0 || selectedLanguages.length > 0 || 
                  selectedLocation !== "All Locations" || selectedAvailability !== "Any Availability" || 
                  selectedRate !== "Any Rate") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY.map(availability => (
                      <SelectItem key={availability} value={availability}>
                        {availability}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rate Range</Label>
                <Select value={selectedRate} onValueChange={setSelectedRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATE_RANGES.map(rate => (
                      <SelectItem key={rate} value={rate}>
                        {rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {SPECIALTIES.map(specialty => (
                    <div key={specialty} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`mobile-${specialty}`}
                        checked={selectedSpecialties.includes(specialty)}
                        onChange={() => toggleSpecialty(specialty)}
                        className="rounded border-input"
                      />
                      <label htmlFor={`mobile-${specialty}`} className="text-sm">
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="space-y-2">
                  {LANGUAGES.map(language => (
                    <div key={language} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`mobile-${language}`}
                        checked={selectedLanguages.includes(language)}
                        onChange={() => toggleLanguage(language)}
                        className="rounded border-input"
                      />
                      <label htmlFor={`mobile-${language}`} className="text-sm">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <Card className="w-64 sticky top-4 hidden md:block h-fit">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters</span>
            {(selectedSpecialties.length > 0 || selectedLanguages.length > 0 || 
              selectedLocation !== "All Locations" || selectedAvailability !== "Any Availability" || 
              selectedRate !== "Any Rate") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Availability</Label>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY.map(availability => (
                  <SelectItem key={availability} value={availability}>
                    {availability}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rate Range</Label>
            <Select value={selectedRate} onValueChange={setSelectedRate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATE_RANGES.map(rate => (
                  <SelectItem key={rate} value={rate}>
                    {rate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {SPECIALTIES.map(specialty => (
                <div key={specialty} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={specialty}
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => toggleSpecialty(specialty)}
                    className="rounded border-input"
                  />
                  <label htmlFor={specialty} className="text-sm">
                    {specialty}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Languages</Label>
            <div className="space-y-2">
              {LANGUAGES.map(language => (
                <div key={language} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={language}
                    checked={selectedLanguages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                    className="rounded border-input"
                  />
                  <label htmlFor={language} className="text-sm">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {(selectedSpecialties.length > 0 || selectedLanguages.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedSpecialties.map(specialty => (
            <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
              {specialty}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleSpecialty(specialty)}
              />
            </Badge>
          ))}
          {selectedLanguages.map(language => (
            <Badge key={language} variant="secondary" className="flex items-center gap-1">
              {language}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleLanguage(language)}
              />
            </Badge>
          ))}
        </div>
      )}
    </>
  )
} 