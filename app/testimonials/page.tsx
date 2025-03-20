import { ArrowLeft, Quote, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | BusinessHub",
  description: "What our users say about BusinessHub - read testimonials from business owners and customers",
};

// Testimonial data
const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    business: "Seaside Bistro",
    text: "BusinessHub completely transformed how I connect with customers. After joining, I saw a 40% increase in new customer visits within just 3 months! The platform's analytics tools have been invaluable for understanding customer preferences.",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-05-12",
    category: "business-owner",
    featured: true
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Customer",
    text: "I use BusinessHub every time I need a local service. The reviews are honest, and I've discovered so many amazing businesses I wouldn't have found otherwise. The filter options make it easy to find exactly what I'm looking for.",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-06-24",
    category: "customer",
    featured: true
  },
  {
    id: "3",
    name: "Jessica Williams",
    role: "Salon Owner",
    business: "Glamour Studio",
    text: "As a small business owner, visibility is everything. BusinessHub made it easy to showcase my services and helped me establish a strong online presence. Customer bookings have increased by 60% since joining.",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-04-18",
    category: "business-owner",
    featured: true
  },
  {
    id: "4",
    name: "David Miller",
    role: "Fitness Trainer",
    business: "Peak Performance Gym",
    text: "BusinessHub gave my fitness studio the digital presence it needed. The custom profile features let me highlight what makes my training approach unique, and I've connected with clients who specifically mentioned finding me through the platform.",
    image: "/placeholder.svg",
    rating: 4,
    date: "2023-07-05",
    category: "business-owner"
  },
  {
    id: "5",
    name: "Rebecca Torres",
    role: "Customer",
    text: "I relocated to a new city and BusinessHub was my go-to for finding trustworthy local businesses. The detailed profiles and verified reviews gave me confidence in my choices. I've recommended it to everyone I know!",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-08-11",
    category: "customer"
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Bookstore Owner",
    business: "Chapter One Books",
    text: "The targeted advertising options on BusinessHub helped my independent bookstore reach the right audience. We've seen a significant increase in foot traffic from readers who share our passion for literature.",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-03-29",
    category: "business-owner"
  },
  {
    id: "7",
    name: "Emily Parker",
    role: "Customer",
    text: "The event notifications from businesses I follow on BusinessHub keep me in the loop about sales and special events. It's become my social calendar for local happenings, and I love supporting community businesses.",
    image: "/placeholder.svg",
    rating: 4,
    date: "2023-09-15",
    category: "customer"
  },
  {
    id: "8",
    name: "Robert Garcia",
    role: "Cafe Owner",
    business: "Morning Brew",
    text: "The insights BusinessHub provides about customer engagement helped us refine our menu offerings and opening hours. The platform practically paid for itself within the first month!",
    image: "/placeholder.svg",
    rating: 4,
    date: "2023-02-08",
    category: "business-owner"
  },
  {
    id: "9",
    name: "Olivia Thompson",
    role: "Customer",
    text: "I appreciate how easy BusinessHub makes it to leave thoughtful feedback for businesses. As someone who relies heavily on reviews, I feel like I'm contributing to a helpful community of consumers.",
    image: "/placeholder.svg",
    rating: 5,
    date: "2023-10-27",
    category: "customer"
  }
];

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border/40 hover:shadow-md transition-shadow h-full flex flex-col">
      {testimonial.featured && (
        <Badge className="self-start mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-0">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Featured
        </Badge>
      )}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          <AvatarImage src={testimonial.image} />
          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          {testimonial.business && (
            <p className="text-sm text-primary font-medium">{testimonial.business}</p>
          )}
        </div>
      </div>
      <div className="relative flex-grow">
        <Quote className="h-8 w-8 text-primary/10 absolute -top-2 -left-2" />
        <p className="text-muted-foreground relative z-10 pl-2 mb-4">
          {testimonial.text}
        </p>
      </div>
      <div className="flex items-center mt-auto">
        <div className="flex">
          {Array(testimonial.rating).fill(0).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
          {Array(5 - testimonial.rating).fill(0).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-muted" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const businessOwnerTestimonials = testimonials.filter(t => t.category === "business-owner");
  const customerTestimonials = testimonials.filter(t => t.category === "customer");
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Star className="h-6 w-6 text-primary mr-2" />
          Customer Testimonials
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Discover what business owners and customers have to say about their experience with BusinessHub. 
          Read authentic testimonials from our community members.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Testimonials</TabsTrigger>
          <TabsTrigger value="business-owners">Business Owners</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="business-owners" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessOwnerTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-xl font-medium mb-4">Share Your Experience</h2>
        <p className="text-muted-foreground mb-4">
          We&apos;d love to hear about your experience with BusinessHub. Your feedback helps us improve our platform
          and inspires other businesses and customers.
        </p>
        <Button className="font-medium">Submit Your Testimonial</Button>
      </div>
    </div>
  );
} 