import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  image: string;
  likes?: number;
}

interface BusinessCardProps {
  business: Business;
  className?: string;
  onLike?: (id: string) => void;
  isLiked?: boolean;
  href?: string;
}

export default function BusinessCard({
  business,
  className,
  onLike,
  isLiked,
  href,
}: BusinessCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-52 overflow-hidden">
          <Image
            src={business.image || "/placeholder.svg"}
            alt={business.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {onLike && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm z-10"
              onClick={(e) => {
                e.preventDefault();
                onLike(business.id);
              }}
            >
              <Heart
                className={cn("h-5 w-5 transition-colors", 
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow space-y-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">{business.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{business.address}</p>
        </div>
        
        <div className="flex items-center">
          <div className="flex mr-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={cn("w-4 h-4", 
                  index < Math.floor(business.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {business.rating.toFixed(1)}
          </span>
          {business.likes !== undefined && (
            <span className="ml-4 text-sm text-muted-foreground flex items-center">
              <Heart className="w-3.5 h-3.5 mr-1 text-muted-foreground" /> {business.likes}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {business.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <Link
          href={href || `/business/${business.id}`}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-between group py-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
