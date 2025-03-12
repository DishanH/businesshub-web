import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Star, 
  Calendar, 
  Award,
  BookOpen,
  MessageCircle,
  Heart
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NannyServicePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: NannyServicePageProps): Promise<Metadata> {
  const { id } = params;
  // In a real app, you would fetch the nanny data from an API
  const nanny = NANNIES.find(n => n.id === id);
  
  if (!nanny) {
    return {
      title: "Nanny Not Found | BusinessHub",
      description: "The nanny you are looking for could not be found.",
    };
  }
  
  return {
    title: `${nanny.name} | BusinessHub Nanny Services`,
    description: nanny.description.substring(0, 160),
  };
}

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
    reviews: 24,
    about: "I have been working with children for over 5 years and have a degree in Early Childhood Education. I am passionate about providing quality care that supports children's development and well-being. I specialize in infant and toddler care and have additional training in caring for children with special needs.",
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
    reviews: 18,
    about: "As a former elementary school teacher, I bring my educational background to my role as a nanny. I excel at helping children with homework and creating engaging educational activities. I believe in making learning fun and supporting children's academic and personal growth.",
    certifications: [
      "Bachelor's in Elementary Education",
      "First Aid & CPR Certified",
      "Teaching License",
      "Child Development Associate"
    ],
    schedule: {
      monday: "3:00 PM - 8:00 PM",
      tuesday: "3:00 PM - 8:00 PM",
      wednesday: "3:00 PM - 8:00 PM",
      thursday: "3:00 PM - 8:00 PM",
      friday: "3:00 PM - 8:00 PM"
    },
    reviews_list: [
      {
        id: 1,
        user: "Jennifer Wu",
        rating: 5,
        date: "2024-01-20",
        comment: "Michael has been a tremendous help with my children's homework. His teaching background really shows!"
      },
      {
        id: 2,
        user: "Robert Johnson",
        rating: 4,
        date: "2024-01-15",
        comment: "Great with organizing educational activities. My kids look forward to his visits."
      },
      {
        id: 3,
        user: "Sarah Lee",
        rating: 5,
        date: "2024-01-05",
        comment: "Michael speaks both English and Mandarin with my children, which has been wonderful for their language development."
      }
    ]
  }
];

export default async function NannyServicePage({ params }: NannyServicePageProps) {
  const { id } = params;

  if (!id) {
    return {
      title: "Nanny Not Found | BusinessHub",
      description: "The nanny you are looking for could not be found.",
    };
  }
  // In a real app, you would fetch the nanny data from an API
  const nanny = NANNIES.find(n => n.id === id);
  
  if (!nanny) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gradient-to-r from-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative h-full flex flex-col justify-end pb-12 z-10">
          <Button variant="outline" size="sm" asChild className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
            <Link href="/services/nanny-services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Nanny Services
            </Link>
          </Button>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {nanny.specialties.map((specialty, index) => (
                <Badge key={index} className="bg-background/80 text-foreground backdrop-blur-sm">
                  {specialty}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{nanny.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl drop-shadow-sm">{nanny.description}</p>
            <div className="flex items-center gap-2 text-white/90">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= Math.floor(nanny.rating) ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`} 
                  />
                ))}
              </div>
              <span>{nanny.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{nanny.reviews} reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About {nanny.name}</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="aspect-square relative rounded-lg overflow-hidden">
                        <Image 
                          src={nanny.image} 
                          alt={nanny.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{nanny.about}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-1">
                            {nanny.languages.map((language, index) => (
                              <Badge key={index} variant="outline">
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Experience</h3>
                          <p className="text-muted-foreground">{nanny.experience}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tabs Section */}
            <section>
              <Tabs defaultValue="certifications">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="certifications" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Certifications & Training
                      </CardTitle>
                      <CardDescription>Professional qualifications and specialized training</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {nanny.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <BookOpen className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Availability Schedule
                      </CardTitle>
                      <CardDescription>Regular working hours and availability</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(nanny.schedule).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium capitalize">{day}</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Client Reviews
                      </CardTitle>
                      <CardDescription>Feedback from families who have worked with {nanny.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {nanny.reviews_list.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback>{review.user[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{review.user}</p>
                                  <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= Math.floor(review.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </div>

          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button size="lg" className="w-full">Contact {nanny.name}</Button>
              <Button variant="outline" size="lg" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
            </div>

            {/* Rate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Rate Information
                </CardTitle>
                <CardDescription>Hourly rate and payment details</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Hourly Rate:</span>
                  <span className="text-xl font-bold text-primary">{nanny.hourlyRate}</span>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Rate includes:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Childcare services</li>
                    <li>• Age-appropriate activities</li>
                    <li>• Light meal preparation</li>
                    <li>• Basic housekeeping related to childcare</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment methods:</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct payment, e-transfer, or through our secure platform
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p>{nanny.location}</p>
                    <p className="text-sm text-muted-foreground mt-1">Service area: Within 15 miles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">{nanny.availability}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {nanny.availability === "Full-time" 
                        ? "Available for regular weekday care" 
                        : "Available for after-school and weekend care"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 