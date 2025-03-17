"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NannyCardProps {
  nanny: {
    id: string
    name: string
    image: string
    location: string
    experience: string
    rating: number
    specialties: string[]
    availability: string
    hourlyRate: string
    description: string
    languages: string[]
    reviews: number
  }
  isGridLayout: boolean
  isLiked: boolean
  onLike: (id: string) => void
}

export default function NannyCard({ nanny, isGridLayout, isLiked, onLike }: NannyCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${!isGridLayout ? 'flex flex-row' : ''}`}>
      <CardHeader className={`relative pb-0 ${!isGridLayout ? 'w-1/3 pr-0' : ''}`}>
        <div className={`relative ${isGridLayout ? 'h-48 -mx-6 -mt-6 mb-4' : 'h-full'} overflow-hidden`}>
          <Image 
            src={nanny.image} 
            alt={nanny.name}
            fill
            className={`object-cover ${!isGridLayout ? 'rounded-l-lg' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {isGridLayout && (
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{nanny.name}</CardTitle>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => onLike(nanny.id)}
              >
                <Heart 
                  className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {nanny.location}
            </CardDescription>
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
                onClick={() => onLike(nanny.id)}
              >
                <Heart 
                  className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
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
          {/* Rating section hidden as requested */}
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{nanny.rating}</span>
            </div>
            <span className="text-muted-foreground">({nanny.reviews} reviews)</span>
            <Badge variant="secondary" className="ml-auto">
              {nanny.hourlyRate}/hr
            </Badge>
          </div> */}
          <div className="flex justify-end mb-3">
            <Badge variant="secondary">
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
          <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm">
            <Link href={`/nannies/${nanny.id}`}>View Profile</Link>
          </Button>
          <Button variant="secondary" className="flex-1 font-medium shadow-sm">
            Contact
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
} 