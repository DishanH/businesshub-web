import { ArrowLeft, Quote, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { getTestimonials } from "@/app/actions/testimonials";
import { AuthenticatedTestimonialDialog } from "@/components/authenticated-testimonial-dialog";

export const metadata: Metadata = {
  title: "Testimonials | BusinessHub",
  description: "What our users say about BusinessHub - read testimonials from business owners and customers",
};

// Testimonial type definition
type Testimonial = {
  id: string;
  name: string;
  role: string;
  business: string | null;
  text: string;
  image: string;
  rating: number;
  date: string;
  category: 'business-owner' | 'customer';
  featured: boolean;
};

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border/30 hover:shadow-md transition-all duration-200 h-full flex flex-col relative overflow-hidden">
      {testimonial.featured && (
        <Badge className="absolute top-4 right-4 bg-primary/15 text-primary hover:bg-primary/25 border-0 font-medium">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Featured
        </Badge>
      )}
      <div className="flex items-center gap-4 mb-5">
        <Avatar className="h-12 w-12 border border-primary/10 shadow-sm">
          <AvatarImage src={testimonial.image} />
          <AvatarFallback className="bg-primary/5 text-primary font-medium">{testimonial.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          {testimonial.business && (
            <p className="text-sm text-primary font-medium">{testimonial.business}</p>
          )}
        </div>
      </div>
      
      <div className="mt-1 mb-4 flex">
        {Array(testimonial.rating).fill(0).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
        {Array(5 - testimonial.rating).fill(0).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-muted" />
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </span>
      </div>
      
      <div className="relative flex-grow">
        <Quote className="h-8 w-8 text-primary/10 absolute -top-1 -left-1 opacity-70" />
        <p className="text-muted-foreground relative z-10 pl-3 text-sm leading-relaxed">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </div>
    </div>
  );
}

// Fallback testimonials in case of database issues
const fallbackTestimonials = [
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

type PageProps = {
  searchParams: {
    category?: string;
  };
};

export default async function TestimonialsPage({ searchParams }: PageProps) {
  // Parse search params

  const { category : currentCategory } = await searchParams;

  // Fetch testimonials data from Supabase
  const { success, testimonials } = await getTestimonials(currentCategory);
  
  // Use data from Supabase if successful, otherwise use fallback data
  const testimonialsData: Testimonial[] = success && testimonials ? testimonials : fallbackTestimonials;
  
  // Determine which tab to display as active
  let activeTab = "all";
  if (currentCategory === "business-owner") activeTab = "business-owners";
  if (currentCategory === "customer") activeTab = "customers";
  
  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" className="mr-4 -ml-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <Star className="h-6 w-6 text-primary mr-2 fill-primary" />
          Customer Testimonials
        </h1>
        <p className="text-muted-foreground">
          Discover what business owners and customers have to say about their experience with BusinessHub. 
          Read authentic testimonials from our community members.
        </p>
      </div>
      
      <div className="text-center mb-12">
        <AuthenticatedTestimonialDialog />
      </div>
      
      <Tabs defaultValue={activeTab} className="mb-12">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" asChild>
              <Link href="/testimonials" className="px-3 py-1.5">All Testimonials</Link>
            </TabsTrigger>
            <TabsTrigger value="business-owners" asChild>
              <Link href="/testimonials?category=business-owner" className="px-3 py-1.5">Business Owners</Link>
            </TabsTrigger>
            <TabsTrigger value="customers" asChild>
              <Link href="/testimonials?category=customer" className="px-3 py-1.5">Customers</Link>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.length > 0 ? (
              testimonialsData.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No testimonials found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 