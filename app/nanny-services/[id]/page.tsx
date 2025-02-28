"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, Clock, Heart, Languages, Phone, Mail, Shield, Award, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock data for nannies (this should be moved to a shared location)
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
    reviews: 48,
    about: `I am a certified early childhood educator with over 5 years of experience in childcare. My passion lies in helping children develop and grow in a nurturing environment. I specialize in newborn care and creating engaging developmental activities tailored to each child's needs.

I hold a degree in Early Childhood Education from the University of Toronto and am certified in First Aid and CPR. My approach combines educational activities with fun, ensuring children learn while enjoying their time.`,
    certifications: [
      "Early Childhood Education Degree",
      "First Aid & CPR Certified",
      "Special Needs Care Certification",
      "Infant Care Specialist"
    ],
    schedule: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 6:00 PM"
    },
    reviews_list: [
      {
        id: 1,
        user: "Emily Thompson",
        rating: 5,
        date: "2024-02-15",
        comment: "Sarah has been amazing with our newborn. Her expertise and gentle nature made us feel completely at ease."
      },
      {
        id: 2,
        user: "Michael Chen",
        rating: 4.5,
        date: "2024-02-10",
        comment: "Very professional and great with our toddler. She creates such engaging activities!"
      },
      {
        id: 3,
        user: "Lisa Anderson",
        rating: 5,
        date: "2024-02-01",
        comment: "We couldn't be happier with Sarah. Her experience with special needs children has been invaluable."
      }
    ]
  },
  // ... other nannies
]

export default function NannyDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const nanny = NANNIES.find(n => n.id === params.id)

  if (!nanny) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Nanny not found</h1>
        <Button asChild className="mt-4">
          <Link href="/nanny-services">Back to Nanny Services</Link>
        </Button>
      </div>
    )
  }

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
            <BreadcrumbPage>{nanny.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="relative">
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={nanny.image} alt={nanny.name} />
                  <AvatarFallback>{nanny.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{nanny.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {nanny.location}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{nanny.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({nanny.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about" className="mt-6">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About Me</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{nanny.about}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {nanny.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {nanny.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Languages</h3>
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        {nanny.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Availability: {nanny.availability}</span>
                    </div>
                    <div className="grid gap-2">
                      {Object.entries(nanny.schedule).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center py-2">
                          <span className="capitalize">{day}</span>
                          <span className="text-muted-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-4">
                    {nanny.reviews_list.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{review.user[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-sm">{review.user}</CardTitle>
                                <CardDescription>{review.date}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1">{review.rating}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact & Booking */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book {nanny.name}</CardTitle>
              <CardDescription>Contact to schedule a meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="w-full justify-center text-lg py-2">
                    {nanny.hourlyRate}/hr
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Verified Profile</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 