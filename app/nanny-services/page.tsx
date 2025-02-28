"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, Clock, Heart, Search, Filter, X, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Separator } from "@/components/ui/separator"

// Mock data for nannies
const NANNIES = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "/placeholder.svg",
    location: "Downtown Toronto",
    experience: "5 years",
    rating: 4.8,
    specialties: ["Newborns", "Toddlers", "Special Needs"],
    availability: "Full-time",
    hourlyRate: "$25-30",
    description: "Certified early childhood educator with extensive experience in newborn care and developmental activities.",
    languages: ["English", "French"],
    reviews: 48
  },
  {
    id: "2",
    name: "Maria Garcia",
    image: "/placeholder.svg",
    location: "North York",
    experience: "8 years",
    rating: 4.9,
    specialties: ["School Age", "Homework Help", "Arts & Crafts"],
    availability: "Part-time",
    hourlyRate: "$28-35",
    description: "Former elementary teacher specializing in educational activities and homework assistance.",
    languages: ["English", "Spanish"],
    reviews: 62
  },
  {
    id: "3",
    name: "Emily Chen",
    image: "/placeholder.svg",
    location: "Scarborough",
    experience: "3 years",
    rating: 4.7,
    specialties: ["Infants", "Music Education", "First Aid Certified"],
    availability: "Flexible",
    hourlyRate: "$23-28",
    description: "Trained in infant care and early childhood music education. CPR and First Aid certified.",
    languages: ["English", "Mandarin"],
    reviews: 31
  },
  {
    id: "4",
    name: "Jessica Williams",
    image: "/placeholder.svg",
    location: "Etobicoke",
    experience: "6 years",
    rating: 4.9,
    specialties: ["Multiple Children", "Meal Planning", "Educational Activities"],
    availability: "Full-time",
    hourlyRate: "$26-32",
    description: "Experienced with caring for multiple children and creating engaging educational activities.",
    languages: ["English"],
    reviews: 55
  }
]

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

export default function NannyServicesPage() {
  const [likedNannies, setLikedNannies] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedAvailability, setSelectedAvailability] = useState("Any Availability")
  const [selectedRate, setSelectedRate] = useState("Any Rate")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isGridLayout, setIsGridLayout] = useState(false)
  
  const ITEMS_PER_PAGE = 6
  const totalPages = Math.ceil(NANNIES.length / ITEMS_PER_PAGE)
  
  const paginatedNannies = NANNIES.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleLike = (id: string) => {
    setLikedNannies(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    )
  }

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
    setSearchQuery("")
    setSelectedLocation("All Locations")
    setSelectedAvailability("Any Availability")
    setSelectedRate("Any Rate")
    setSelectedSpecialties([])
    setSelectedLanguages([])
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-foreground">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nanny Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nanny Services</h1>
          <p className="text-muted-foreground mt-2">
            Find experienced and caring nannies in your area
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Desktop Filters */}
          <Card className="w-full md:w-64 sticky top-4 hidden md:block">
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

          {/* Mobile Filters */}
          <div className="md:hidden w-full flex gap-2">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search nannies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search and Layout Toggle */}
            <div className="hidden md:flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search nannies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6"
                />
              </div>
              <div className="flex items-center gap-2 border rounded-md p-1">
                <Button
                  variant={isGridLayout ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridLayout(true)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={!isGridLayout ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setIsGridLayout(false)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedSpecialties.length > 0 || selectedLanguages.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Nanny Cards */}
            <div className={isGridLayout 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
              : "flex flex-col gap-4"
            }>
              {paginatedNannies.map((nanny) => (
                <Card key={nanny.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${!isGridLayout ? 'flex flex-row' : ''}`}>
                  <CardHeader className={`relative pb-0 ${!isGridLayout ? 'w-1/3 pr-0' : ''}`}>
                    <div className={`relative ${isGridLayout ? 'h-48 -mx-6 -mt-6 mb-4' : 'h-full'} overflow-hidden`}>
                      <img 
                        src={nanny.image} 
                        alt={nanny.name}
                        className={`w-full h-full object-cover ${!isGridLayout ? 'rounded-l-lg' : ''}`}
                      />
                    </div>
                    {isGridLayout && (
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={nanny.image} alt={nanny.name} />
                          <AvatarFallback>{nanny.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{nanny.name}</CardTitle>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 rounded-full"
                              onClick={() => toggleLike(nanny.id)}
                            >
                              <Heart 
                                className={`h-5 w-5 ${likedNannies.includes(nanny.id) ? 'fill-red-500 text-red-500' : ''}`} 
                              />
                            </Button>
                          </div>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {nanny.location}
                          </CardDescription>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <div className={`flex flex-col ${!isGridLayout ? 'w-2/3 p-6' : ''}`}>
                    {!isGridLayout && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{nanny.name}</h3>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => toggleLike(nanny.id)}
                          >
                            <Heart 
                              className={`h-5 w-5 ${likedNannies.includes(nanny.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                        <p className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {nanny.location}
                        </p>
                      </div>
                    )}
                    <CardContent className={`${isGridLayout ? 'mt-4' : 'mt-4'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{nanny.rating}</span>
                        </div>
                        <span className="text-muted-foreground">({nanny.reviews} reviews)</span>
                        <Badge variant="secondary" className="ml-auto">
                          {nanny.hourlyRate}/hr
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {nanny.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {nanny.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {nanny.availability}
                        </div>
                        <span>•</span>
                        <div>{nanny.experience} experience</div>
                      </div>
                    </CardContent>
                    <CardFooter className={`flex gap-4 ${!isGridLayout ? 'px-0 pb-0' : ''}`}>
                      <Button asChild className="flex-1">
                        <Link href={`/nanny-services/${nanny.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Contact
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 