import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Nanny Services | BusinessHub",
  description: "Find experienced and caring nannies for your children",
};

// Mock nanny data
const NANNIES = [
  {
    id: "1",
    name: "Sarah Johnson",
    image: "/placeholder.svg",
    location: "Toronto, ON",
    experience: "5+ years",
    rating: 4.9,
    specialties: ["Infant Care", "Toddler Care", "Special Needs"],
    availability: "Full-time",
    hourlyRate: "$25-30",
    description: "Experienced nanny with a degree in Early Childhood Education. Specializes in infant and toddler care with additional training in special needs care.",
    languages: ["English", "French"],
    reviews: 24
  },
  {
    id: "2",
    name: "Michael Chen",
    image: "/placeholder.svg",
    location: "Vancouver, BC",
    experience: "3+ years",
    rating: 4.7,
    specialties: ["After-school Care", "Homework Help", "Activities"],
    availability: "Part-time",
    hourlyRate: "$22-28",
    description: "Former elementary school teacher now working as a nanny. Excellent at helping with homework and organizing educational activities.",
    languages: ["English", "Mandarin"],
    reviews: 18
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    image: "/placeholder.svg",
    location: "Montreal, QC",
    experience: "7+ years",
    rating: 5.0,
    specialties: ["Newborn Care", "Multilingual", "Cooking"],
    availability: "Full-time",
    hourlyRate: "$28-35",
    description: "Experienced nanny with specialized training in newborn care. Fluent in multiple languages and can prepare nutritious meals for children of all ages.",
    languages: ["English", "French", "Spanish"],
    reviews: 32
  },
  {
    id: "4",
    name: "David Wilson",
    image: "/placeholder.svg",
    location: "Calgary, AB",
    experience: "4+ years",
    rating: 4.8,
    specialties: ["Active Play", "Sports", "Outdoor Activities"],
    availability: "Part-time",
    hourlyRate: "$23-27",
    description: "Energetic nanny with a background in physical education. Focuses on active play and outdoor activities to keep children healthy and engaged.",
    languages: ["English"],
    reviews: 15
  },
  {
    id: "5",
    name: "Priya Patel",
    image: "/placeholder.svg",
    location: "Ottawa, ON",
    experience: "6+ years",
    rating: 4.9,
    specialties: ["Arts & Crafts", "Music", "Educational Activities"],
    availability: "Full-time",
    hourlyRate: "$26-32",
    description: "Creative nanny with a passion for arts and music. Designs engaging educational activities that foster creativity and cognitive development.",
    languages: ["English", "Hindi", "Gujarati"],
    reviews: 27
  },
  {
    id: "6",
    name: "James Thompson",
    image: "/placeholder.svg",
    location: "Edmonton, AB",
    experience: "2+ years",
    rating: 4.6,
    specialties: ["School-age Children", "Tutoring", "Technology"],
    availability: "Part-time",
    hourlyRate: "$20-25",
    description: "Tech-savvy nanny who excels at tutoring and helping children navigate the digital world safely and productively.",
    languages: ["English", "French"],
    reviews: 11
  }
];

export default function NannyServicesPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Nanny Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find experienced and caring nannies for your children
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-muted/30 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search nannies by name, skills, or location..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>Search</Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-background">Full-time</Badge>
          <Badge variant="outline" className="bg-background">Part-time</Badge>
          <Badge variant="outline" className="bg-background">Infant Care</Badge>
          <Badge variant="outline" className="bg-background">Special Needs</Badge>
          <Badge variant="outline" className="bg-background">Multilingual</Badge>
          <Badge variant="outline" className="bg-background">$20-25/hr</Badge>
          <Badge variant="outline" className="bg-background">$25-30/hr</Badge>
          <Badge variant="outline" className="bg-background">$30+/hr</Badge>
        </div>
      </section>

      {/* Nannies Listing */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Available Nannies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NANNIES.map((nanny) => (
            <Card key={nanny.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="relative">
                <div className="h-48 bg-muted">
                  <Image 
                    src={nanny.image} 
                    alt={nanny.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Badge className="absolute top-2 right-2 bg-primary">
                  {nanny.hourlyRate}/hr
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{nanny.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {nanny.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{nanny.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({nanny.reviews})</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {nanny.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {nanny.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{nanny.availability}</span>
                  </div>
                  <span>{nanny.experience} experience</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/services/nanny-services/${nanny.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button>
                  Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-muted/30 rounded-lg mt-12">
        <h2 className="text-2xl font-bold mb-4">Are You a Nanny?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join our platform to connect with families looking for quality childcare services.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/owner/services/create">
            Register as a Nanny
          </Link>
        </Button>
      </section>
    </div>
  );
} 