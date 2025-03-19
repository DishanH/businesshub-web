import Link from "next/link";
import Image from "next/image";
import { StarIcon, MapPin, Phone, Globe, ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  image: string;
  phone?: string;
  website?: string;
  categories?: string[];
}

interface BusinessListCardProps {
  business: Business;
  className?: string;
  href?: string;
}

export default function BusinessListCard({
  business,
  className,
  href,
}: BusinessListCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="flex flex-col md:flex-row">
        {/* Image section - only shown on md and larger screens */}
        <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0">
          <Image
            src={business.image || "/placeholder.svg"}
            alt={business.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 224px"
          />
        </div>

        {/* Content section */}
        <CardContent className="flex-grow p-4 md:p-6">
          <div className="flex flex-col h-full">
            <div className="space-y-2 mb-auto">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{business.name}</h3>
                <div className="flex items-center ml-2">
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
                </div>
              </div>

              {business.categories && business.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {business.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground line-clamp-2 mt-2">
                {business.description}
              </p>

              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>{business.address}</span>
              </div>

              {business.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  <span>{business.phone}</span>
                </div>
              )}

              {business.website && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 mr-1" />
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    {business.website.replace(/^https?:\/\//, "").split("/")[0]}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4">
              {href && (
                <Button variant="secondary" asChild>
                  <Link href={href}>View Details</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
} 