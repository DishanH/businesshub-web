import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon, Heart } from "lucide-react";

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
    <Card className={`overflow-hidden flex flex-col h-full ${className}`}>
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={business.image || "/placeholder.svg"}
            alt={business.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {/* <div className="absolute right-4 top-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={() => onLike?.(business.id)}
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
            />
          </Button>
        </div> */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{business.name}</h3>
            {onLike && (
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => onLike(business.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{business.address}</p>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(business.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {business.rating.toFixed(1)}
            </span>
            {business.likes !== undefined && (
              <span className="ml-4 text-sm text-muted-foreground">
                {business.likes} likes
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {business.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link
          href={href || `/business/${business.id}`}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-between group"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}
