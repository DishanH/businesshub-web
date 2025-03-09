import { Metadata } from "next";
import { getBusinessById } from "@/app/owner/business-profiles/actions/core";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ArrowLeft, 
  Star, 
  Menu, 
  Utensils, 
  ShoppingBag,
  Users,
  MessageCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BusinessProfilePageProps {
  params: {
    id: string;
  };
}

// Define types for business data
interface BusinessImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

interface BusinessSocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface BusinessAttribute {
  id: string;
  attribute_id: string;
  value: string | number | boolean | string[];
}

export async function generateMetadata({ params }: BusinessProfilePageProps): Promise<Metadata> {
  const { data: business } = await getBusinessById(params.id);
  
  if (!business) {
    return {
      title: "Business Not Found | BusinessHub",
      description: "The business you are looking for could not be found.",
    };
  }
  
  return {
    title: `${business.name} | BusinessHub`,
    description: business.description,
  };
}

// Mock data for sections that might not be in the database yet
const mockSpecials = [
  {
    id: 1,
    name: "Summer Special",
    description: "Limited time offer: 20% off all services",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "New Customer Discount",
    description: "First-time customers receive a complimentary consultation",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Loyalty Program",
    description: "Join our loyalty program and earn points with every visit",
    image: "/placeholder.svg",
  },
];

const mockServices = [
  {
    id: 1,
    name: "Standard Service",
    description: "Our most popular service package",
    price: "$99",
  },
  {
    id: 2,
    name: "Premium Service",
    description: "Enhanced service with additional features",
    price: "$149",
  },
  {
    id: 3,
    name: "Deluxe Package",
    description: "Our comprehensive all-inclusive service",
    price: "$199",
  },
  {
    id: 4,
    name: "Quick Consultation",
    description: "Brief consultation to address your needs",
    price: "$49",
  },
];

const mockMenuCategories = [
  {
    name: "Starters",
    items: [
      { name: "Garlic Bread", description: "Freshly baked bread with garlic butter", price: "$5.99" },
      { name: "Mozzarella Sticks", description: "Served with marinara sauce", price: "$7.99" },
      { name: "Chicken Wings", description: "Choice of buffalo, BBQ, or honey garlic", price: "$10.99" },
    ]
  },
  {
    name: "Main Courses",
    items: [
      { name: "Classic Burger", description: "Beef patty with lettuce, tomato, and cheese", price: "$12.99" },
      { name: "Grilled Salmon", description: "Served with seasonal vegetables", price: "$18.99" },
      { name: "Pasta Primavera", description: "Fresh vegetables in a cream sauce", price: "$14.99" },
    ]
  },
  {
    name: "Desserts",
    items: [
      { name: "Chocolate Cake", description: "Rich chocolate cake with ganache", price: "$6.99" },
      { name: "Cheesecake", description: "New York style with berry compote", price: "$7.99" },
      { name: "Ice Cream", description: "Three scoops of your choice", price: "$5.99" },
    ]
  }
];

const mockReviews = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg",
    rating: 5,
    date: "2023-05-15",
    content: "Excellent service! The staff was very friendly and professional. I'll definitely be coming back."
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder.svg",
    rating: 4,
    date: "2023-04-22",
    content: "Great experience overall. The quality was top-notch, though prices are a bit on the higher side."
  },
  {
    id: 3,
    author: "Michael Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    date: "2023-03-10",
    content: "I've been a regular customer for years and have never been disappointed. Highly recommended!"
  },
];

export default async function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const { data: business, error } = await getBusinessById(params.id);
  
  if (error || !business) {
    notFound();
  }
  
  // Format business hours for display
  const formatBusinessHours = () => {
    if (!business.hours || business.hours.length === 0) {
      return <p className="text-muted-foreground">No business hours available</p>;
    }
    
    // Sort days of week
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const sortedHours = [...business.hours].sort((a, b) => 
      daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week)
    );
    
    return (
      <div className="space-y-2">
        {sortedHours.map((hour) => (
          <div key={hour.day_of_week} className="flex justify-between">
            <span className="font-medium">{hour.day_of_week}</span>
            <span>
              {hour.is_closed ? (
                <span className="text-muted-foreground">Closed</span>
              ) : (
                `${hour.open_time} - ${hour.close_time}`
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-gradient-to-r from-primary/90 to-primary/70 overflow-hidden">
        {business.images && business.images.length > 0 && (
          <Image 
            src={business.images.find((img: BusinessImage) => img.is_primary)?.url || business.images[0].url} 
            alt={business.images.find((img: BusinessImage) => img.is_primary)?.alt_text || business.name}
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative h-full flex flex-col justify-end pb-12 z-10">
          <Button variant="outline" size="sm" asChild className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
            <Link href="/business-profiles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Business Profiles
            </Link>
          </Button>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                {business.category?.name || "Uncategorized"}
              </Badge>
              {business.subcategory && (
                <Badge variant="outline" className="bg-background/80 text-foreground backdrop-blur-sm">
                  {business.subcategory.name}
                </Badge>
              )}
              <Badge variant={business.is_active ? "default" : "outline"} className="bg-background/80 backdrop-blur-sm">
                {business.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{business.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl drop-shadow-sm">{business.description.substring(0, 120)}...</p>
            <div className="flex items-center gap-2 text-white/90">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= business.rating ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`} 
                  />
                ))}
              </div>
              <span>{business.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{"$".repeat(business.price_range)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                About {business.name}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{business.description}</p>
                  {business.additional_info && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                      <p className="text-muted-foreground leading-relaxed">{business.additional_info}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Featured Specials Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Featured Specials
              </h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {mockSpecials.map((special) => (
                    <CarouselItem key={special.id} className="md:basis-1/2 lg:basis-1/2">
                      <Card className="h-full">
                        <div className="h-40 relative overflow-hidden rounded-t-lg">
                          <Image
                            src={special.image}
                            alt={special.name}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{special.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{special.description}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="relative mr-2 translate-y-0" />
                  <CarouselNext className="relative ml-2 translate-y-0" />
                </div>
              </Carousel>
            </section>

            {/* Services Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Utensils className="mr-2 h-5 w-5" />
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-between items-center">
                      <span className="text-xl font-bold text-primary">{service.price}</span>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Menu Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Menu className="mr-2 h-5 w-5" />
                Menu
              </h2>
              <Tabs defaultValue={mockMenuCategories[0].name.toLowerCase()}>
                <TabsList className="mb-4 w-full justify-start overflow-auto">
                  {mockMenuCategories.map((category) => (
                    <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {mockMenuCategories.map((category) => (
                  <TabsContent key={category.name} value={category.name.toLowerCase()}>
                    <div className="space-y-4">
                      {category.items.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <span className="text-lg font-bold text-primary">{item.price}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            {/* Find Us Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Find Us
              </h2>
              <Card className="overflow-hidden">
                <div className="h-[400px] w-full">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCwxqsBze-6BFAf9jfR_8US5jU6ELEhSoE&q=${encodeURIComponent(
                      `${business.address}, ${business.city}, ${business.state} ${business.zip}`
                    )}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p>{business.address}</p>
                      <p>{business.city}, {business.state} {business.zip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Customer Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{review.author}</h3>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">View All Reviews</Button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button size="lg" className="w-full">Contact Business</Button>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with {business.name}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <p>{business.phone}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <p>{business.email}</p>
                </div>
                
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {business.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                {business.social && business.social.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <h3 className="text-sm font-medium mb-2">Social Media</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.social.map((social: BusinessSocialMedia) => (
                        <Button 
                          key={social.id} 
                          variant="outline" 
                          size="sm" 
                          className="h-9 w-9 p-0" 
                          asChild
                        >
                          <a 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={social.platform}
                          >
                            {/* Use platform name as fallback */}
                            {social.platform.charAt(0).toUpperCase()}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {formatBusinessHours()}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Category</h3>
                  <p className="text-muted-foreground">{business.category?.name || "Uncategorized"}</p>
                </div>
                
                {business.subcategory && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Subcategory</h3>
                    <p className="text-muted-foreground">{business.subcategory.name}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Price Range</h3>
                  <p className="text-muted-foreground">{"$".repeat(business.price_range)}</p>
                </div>

                {business.attributes && business.attributes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Features</h3>
                    <div className="flex flex-wrap gap-1">
                      {business.attributes.map((attr: BusinessAttribute) => (
                        <Badge key={attr.id} variant="outline">
                          {attr.attribute_id}: {attr.value.toString()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 