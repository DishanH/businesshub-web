"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import React from "react"

interface CarouselComponentProps {
  children?: React.ReactNode
}

export function CarouselComponent({ children }: CarouselComponentProps) {
  return (
    <Carousel className="w-full max-w-5xl">
      <CarouselContent>
        {children
          ? React.Children.map(children, (child, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">{child}</div>
              </CarouselItem>
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Image
                        src={`/placeholder.svg?text=Slide+${index + 1}`}
                        alt={`Slide ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

