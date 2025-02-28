import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon, Heart } from "lucide-react"

interface Business {
  id: string
  name: string
  description: string
  address: string
  rating: number
  image: string
  likes?: number
}

interface BusinessCardProps {
  business: Business
  className?: string
  onLike?: (id: string) => void
  isLiked?: boolean
}

export default function BusinessCard({ business, className, onLike, isLiked }: BusinessCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="p-0">
        <img src={business.image || "/placeholder.svg"} alt={business.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4 flex-grow relative">
        <div className="absolute right-4 top-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onLike?.(business.id)}
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </Button>
        </div>
        <h3 className="text-lg font-semibold mb-2">{business.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{business.address}</p>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(business.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{business.rating.toFixed(1)}</span>
          {business.likes !== undefined && (
            <span className="ml-4 text-sm text-muted-foreground">
              {business.likes} likes
            </span>
          )}
        </div>
        <p className="text-sm line-clamp-3">{business.description}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full">
          <Link href={`/business/${business.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

