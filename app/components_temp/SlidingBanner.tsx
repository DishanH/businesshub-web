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
    image: "/banner-1.jpg", // You'll need to add these images to your public folder
    buttonText: "Explore Now",
    buttonLink: "/categories",
    bgColor: "from-blue-500 to-indigo-700"
  },
  {
    id: 2,
    title: "Support Small Business",
    description: "Help your community thrive by shopping locally",
    image: "/banner-2.jpg",
    buttonText: "Find Nearby",
    buttonLink: "/search",
    bgColor: "from-emerald-500 to-teal-700"
  },
  {
    id: 3,
    title: "Join Our Network",
    description: "List your business and reach more customers",
    image: "/banner-3.jpg",
    buttonText: "Get Started",
    buttonLink: "/add-business",
    bgColor: "from-orange-500 to-red-700"
  }
]

export function SlidingBanner2() {
  // Fallback images if the specified ones don't exist
  const fallbackImages = [
    "https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=1200&h=400&q=80&fit=crop",
    "https://images.unsplash.com/photo-1501446529957-6226bd447c46?w=1200&h=400&q=80&fit=crop",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=400&q=80&fit=crop"
  ]

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
                  onError={(e) => {
                    // Fallback to unsplash image if the specified one doesn't exist
                    e.currentTarget.src = fallbackImages[index % fallbackImages.length]
                  }}
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