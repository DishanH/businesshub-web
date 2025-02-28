"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ArrowLeft, Star, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Import the mock data
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

export default function FavoritesPage() {
  const [likedNannies, setLikedNannies] = useState<string[]>([])

  // In a real application, this would fetch from your backend
  // For now, we'll use localStorage to persist likes
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedNannies')
    if (savedLikes) {
      setLikedNannies(JSON.parse(savedLikes))
    }
  }, [])

  const toggleLike = (id: string) => {
    setLikedNannies(prev => {
      const newLikes = prev.includes(id) 
        ? prev.filter(nId => nId !== id) 
        : [...prev, id]
      
      localStorage.setItem('likedNannies', JSON.stringify(newLikes))
      return newLikes
    })
  }

  // Filter nannies to show only liked ones
  const favoriteNannies = NANNIES.filter(nanny => likedNannies.includes(nanny.id))

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
            <BreadcrumbLink href="/nanny-services" className="hover:text-foreground">
              Nanny Services
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Liked Nannies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/nanny-services">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Nanny Services
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liked Nannies</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your favorite nannies
          </p>
        </div>

        {likedNannies.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Heart className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No Liked Nannies Yet</h3>
                <p className="text-muted-foreground mt-1">
                  Start exploring our nanny services and save your favorites for quick access.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link href="/nanny-services">Browse Nannies</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteNannies.map((nanny) => (
              <Card key={nanny.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="relative pb-0">
                  <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                    <img 
                      src={nanny.image} 
                      alt={nanny.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                            className="h-5 w-5 fill-red-500 text-red-500"
                          />
                        </Button>
                      </div>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {nanny.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-4">
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
                <CardFooter className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link href={`/nanny-services/${nanny.id}`}>View Profile</Link>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Contact
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 