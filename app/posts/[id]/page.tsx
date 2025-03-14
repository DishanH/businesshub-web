"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Phone, Mail, Star, ChevronRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data for demonstration
const businesses = {
  1: {
    id: 1,
    name: "Sweet Delights Bakery",
    tagline: "Artisanal cakes and pastries for all occasions",
    address: "123 Main St, Toronto, ON",
    phone: "(123) 456-7890",
    email: "info@sweetdelightsbakery.com",
    description:
      "At Sweet Delights Bakery, we believe in creating moments of joy through our delicious treats. Our passionate team of bakers combines traditional techniques with innovative flavors to bring you the finest cakes and pastries in Toronto.",
    services: [
      { name: "Custom Cakes", description: "Personalized cakes for weddings, birthdays, and special events" },
      { name: "Pastries", description: "A wide selection of freshly baked croissants, danishes, and more" },
      { name: "Wedding Cakes", description: "Elegant and delicious cakes for your perfect day" },
      { name: "Cupcakes", description: "Bite-sized delights in various flavors" },
    ],
    specials: [
      {
        name: "Summer Berry Blast",
        description: "Limited time offer: Mixed berry tart with vanilla cream",
        image: "/placeholder.svg",
      },
      {
        name: "Chocolate Lover's Dream",
        description: "New: Triple chocolate cake with ganache frosting",
        image: "/placeholder.svg",
      },
      {
        name: "Vegan Delights",
        description: "Try our new range of vegan pastries and cakes",
        image: "/placeholder.svg",
      },
    ],
    menu: [
      {
        category: "Cakes",
        items: [
          { name: "Classic Chocolate Cake", price: "$35" },
          { name: "Red Velvet Cake", price: "$40" },
          { name: "Carrot Cake", price: "$38" },
        ],
      },
      {
        category: "Pastries",
        items: [
          { name: "Croissant", price: "$3" },
          { name: "Danish Pastry", price: "$3.50" },
          { name: "Eclair", price: "$4" },
        ],
      },
    ],
    reviews: [
      { id: 1, author: "John Doe", rating: 5, content: "The best cakes in town! Always fresh and delicious." },
      { id: 2, author: "Jane Smith", rating: 4, content: "Great variety of pastries. The croissants are amazing!" },
      {
        id: 3,
        author: "Mike Johnson",
        rating: 5,
        content: "Ordered a custom cake for my daughter's birthday. It was perfect!",
      },
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  // ... other businesses
}

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("menu")
  const business = businesses[params.id as keyof typeof businesses]

  if (!business) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/posts">Posts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{business.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Top Banner Section */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image src="/placeholder.svg" alt={business.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{business.name}</h1>
            <p className="text-xl md:text-2xl mb-6">{business.tagline}</p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Order Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Contact Information Section */}
        <Card className="mb-8">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span>{business.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <span>{business.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              <span>{business.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Featured Specials Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Specials</h2>
          <Carousel className="w-full max-w-xs md:max-w-2xl lg:max-w-4xl mx-auto">
            <CarouselContent>
              {business.specials.map((special, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <Image
                        src={special.image || "/placeholder.svg"}
                        alt={special.name}
                        width={200}
                        height={200}
                        className="rounded-md mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">{special.name}</h3>
                      <p className="text-center text-muted-foreground">{special.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Our Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.services.map((service, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Menu Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {business.menu.map((category, index) => (
                <TabsTrigger key={index} value={category.category.toLowerCase()}>
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
            {business.menu.map((category, index) => (
              <TabsContent key={index} value={category.category.toLowerCase()}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex}>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary">{item.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Location Map Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Find Us</h2>
          <Card>
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.6893611115!2d-79.38927548451425!3d43.64855797912161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d68bf33a9b%3A0x15edd8c4de1c7581!2sCN%20Tower!5e0!3m2!1sen!2sca!4v1634210187235!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </CardContent>
          </Card>
        </section>

        {/* Read Reviews Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {business.reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${review.id}`} />
                      <AvatarFallback>{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{review.author}</CardTitle>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
} 