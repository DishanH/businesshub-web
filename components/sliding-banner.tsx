"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

// Banner slide data
const bannerSlides = [
  {
    id: 1,
    title: "Discover Local Businesses",
    description: "Find the best services and shops in your neighborhood",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&q=80&fit=crop",
    buttonText: "Explore Now",
    buttonLink: "/categories",
    bgColor: "from-blue-500 to-indigo-700"
  },
  {
    id: 2,
    title: "Support Small Business",
    description: "Help your community thrive by shopping locally",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=400&q=80&fit=crop",
    buttonText: "Find Nearby",
    buttonLink: "/search",
    bgColor: "from-emerald-500 to-teal-700"
  },
  {
    id: 3,
    title: "Join Our Network",
    description: "List your business and reach more customers",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=400&q=80&fit=crop",
    buttonText: "Get Started",
    buttonLink: "/add-business",
    bgColor: "from-orange-500 to-red-700"
  }
]

export function SlidingBanner() {
  // For autoplay functionality
  const [api, setApi] = useState<CarouselApi>()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!api) return

    // Start autoplay
    intervalRef.current = setInterval(() => {
      api.scrollNext()
    }, 5000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [api])

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      setApi={setApi}
      className="w-full"
    >
      <CarouselContent>
        {bannerSlides.map((slide, index) => (
          <CarouselItem key={slide.id}>
            <div className={`relative w-full h-[400px] overflow-hidden rounded-xl bg-gradient-to-r ${slide.bgColor}`}>
              {/* Image with overlay */}
              <div className="absolute inset-0 z-0 opacity-40">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12 lg:p-16 text-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6 max-w-xl">
                  {slide.description}
                </p>
                <div>
                  <Button asChild size="lg" variant="secondary" className="font-medium">
                    <Link href={slide.buttonLink}>
                      {slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        <CarouselPrevious className="static" />
        <CarouselNext className="static" />
      </div>
    </Carousel>
  )
} 