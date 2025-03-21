import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  ArrowLeft,
  Users,
  Utensils, 
  Wrench, 
  Car, 
  Dumbbell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";
import { getBusinessById, getBusinessServicesByBusinessId, getBusinessSpecialsByBusinessId } from "@/app/owner/business-profiles/actions";
import ServicesSection from './services-section';
import SpecialsSection from './specials-section';
import MenuSection from "./menu-section";
import ReviewsSection from "./reviews-section";
import { getBusinessMenuDataForProfile } from "./menu-actions";
// import { SearchWrapper } from "@/components/search-wrapper";

interface BusinessProfilePageProps {
  params: {
    id: string;
  };
}

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
  const { id } = await params;

  if (!id) {
    return {
      title: "Business Not Found | BusinessHub",
      description: "The business you are looking for could not be found.",
    };
  }

  const { data: business } = await getBusinessById(id);
  
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

// Add mock data for different business types
const mockServiceBusinessMenus = {
  "plumber": {
    icon: <Wrench className="h-5 w-5" />,
    title: "Services Offered",
    categories: [
      {
        name: "Residential Services",
        items: [
          { name: "Leak Repair", description: "Fix leaking pipes, faucets, and fixtures", price: "$85/hour" },
          { name: "Drain Cleaning", description: "Clear clogged drains and pipes", price: "$95" },
          { name: "Water Heater Installation", description: "Install new water heater systems", price: "From $350" },
        ]
      },
      {
        name: "Commercial Services",
        items: [
          { name: "Plumbing Maintenance", description: "Regular maintenance for commercial properties", price: "Custom quote" },
          { name: "Emergency Repairs", description: "24/7 emergency plumbing services", price: "$150/hour" },
          { name: "System Inspections", description: "Comprehensive plumbing system inspections", price: "$200" },
        ]
      },
      {
        name: "Specialized Services",
        items: [
          { name: "Bathroom Remodeling", description: "Complete bathroom plumbing for remodels", price: "From $1,500" },
          { name: "Sewer Line Services", description: "Repair or replace sewer lines", price: "From $800" },
          { name: "Water Treatment", description: "Water softener and filtration installation", price: "From $450" },
        ]
      }
    ]
  },
  "vehicle": {
    icon: <Car className="h-5 w-5" />,
    title: "Service Packages",
    categories: [
      {
        name: "Maintenance",
        items: [
          { name: "Oil Change", description: "Full synthetic oil and filter change", price: "$49.99" },
          { name: "Tire Rotation", description: "Rotate and balance all four tires", price: "$35" },
          { name: "Multi-Point Inspection", description: "Comprehensive vehicle health check", price: "$29.99" },
        ]
      },
      {
        name: "Repairs",
        items: [
          { name: "Brake Service", description: "Pad replacement and rotor inspection", price: "From $180" },
          { name: "Engine Diagnostics", description: "Computer diagnostic scan and analysis", price: "$89.99" },
          { name: "Suspension Work", description: "Strut and shock replacement", price: "From $350" },
        ]
      },
      {
        name: "Packages",
        items: [
          { name: "Spring Tune-Up", description: "Prepare your vehicle for warmer weather", price: "$149.99" },
          { name: "Winter Prep", description: "Cold weather preparation package", price: "$179.99" },
          { name: "Road Trip Ready", description: "Complete inspection before long trips", price: "$129.99" },
        ]
      }
    ]
  },
  "gym": {
    icon: <Dumbbell className="h-5 w-5" />,
    title: "Membership Options",
    categories: [
      {
        name: "Memberships",
        items: [
          { name: "Basic", description: "Access to gym floor and cardio equipment", price: "$29.99/month" },
          { name: "Premium", description: "Full access including classes and amenities", price: "$49.99/month" },
          { name: "Family Plan", description: "Coverage for up to 4 family members", price: "$89.99/month" },
        ]
      },
      {
        name: "Personal Training",
        items: [
          { name: "Single Session", description: "One-on-one training session", price: "$65" },
          { name: "5-Pack", description: "Five personal training sessions", price: "$300" },
          { name: "Monthly Program", description: "Weekly sessions and custom plan", price: "$240/month" },
        ]
      },
      {
        name: "Specialty Services",
        items: [
          { name: "Nutrition Consultation", description: "Personalized nutrition planning", price: "$75" },
          { name: "Body Composition Analysis", description: "Detailed body metrics assessment", price: "$45" },
          { name: "Group Training", description: "Small group specialized training", price: "$25/session" },
        ]
      }
    ]
  },
  "professional": {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Professional Services",
    categories: [
      {
        name: "Consultations",
        items: [
          { name: "Initial Consultation", description: "First-time client assessment", price: "$150" },
          { name: "Strategy Session", description: "Focused problem-solving meeting", price: "$200/hour" },
          { name: "Project Evaluation", description: "Comprehensive project review", price: "From $500" },
        ]
      },
      {
        name: "Ongoing Services",
        items: [
          { name: "Monthly Retainer", description: "Ongoing professional support", price: "From $1,000/month" },
          { name: "Project-Based Work", description: "Defined scope project completion", price: "Custom quote" },
          { name: "Hourly Services", description: "As-needed professional assistance", price: "$175/hour" },
        ]
      },
      {
        name: "Specialized Offerings",
        items: [
          { name: "Training Workshop", description: "Group training on specific topics", price: "From $750" },
          { name: "Document Preparation", description: "Professional document creation", price: "From $350" },
          { name: "Expert Testimony", description: "Professional testimony services", price: "$300/hour" },
        ]
      }
    ]
  }
};

export default async function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  // Properly await the params object
  const { id } = await params;
  
  if (!id) {
    return {
      title: "Business Not Found | BusinessHub",
      description: "The business you are looking for could not be found.",
    };
  }

  const { data: business, error } = await getBusinessById(id);
  
  if (error || !business) {
    notFound();
  }
  
  // Fetch business services and specials
  const { data: servicesData } = await getBusinessServicesByBusinessId(id);
  const { data: specialsData } = await getBusinessSpecialsByBusinessId(id);
  
  // Fetch business menu data
  const { data: menuData } = await getBusinessMenuDataForProfile(id);
  
  // Check if current user is the owner of this business
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Ensure isOwner is always a boolean
  const isOwner = Boolean(user && business.user_id === user.id);
  
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

  // Determine business type for menu display
  const getBusinessTypeMenu = () => {
    if (!business.category) return null;
    
    const category = business.category.name.toLowerCase();
    
    if (category.includes("restaurant") || category.includes("food") || category.includes("cafe")) {
      return {
        icon: <Utensils className="h-5 w-5" />,
        title: "Menu",
        categories: mockMenuCategories
      };
    } else if (category.includes("plumb")) {
      return mockServiceBusinessMenus.plumber;
    } else if (category.includes("auto") || category.includes("car") || category.includes("vehicle")) {
      return mockServiceBusinessMenus.vehicle;
    } else if (category.includes("gym") || category.includes("fitness")) {
      return mockServiceBusinessMenus.gym;
    } else if (category.includes("consult") || category.includes("legal") || category.includes("account")) {
      return mockServiceBusinessMenus.professional;
    }
    
    // Default to a generic service menu
    return {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Services & Pricing",
      categories: [
        {
          name: "Popular Services",
          items: mockServices.map(service => ({
            name: service.name,
            description: service.description,
            price: service.price
          }))
        }
      ]
    };
  };
  
  const businessTypeMenu = getBusinessTypeMenu();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="container py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/business-profiles">Business Profiles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{business.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Search component */}
        {/* <div className="mt-4 mb-2">
          <SearchWrapper 
            placeholder="Find similar businesses..."
            popularSearches={["Restaurants", "Plumbers", "Electricians", "Dentists", "Gyms"]}
            searchType="business"
            redirectPath="/search"
          />
        </div> */}
      </div>

      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {business.images && business.images.length > 0 ? (
          <Image 
            src={business.images.find((img: BusinessImage) => img.is_primary)?.url || business.images[0].url} 
            alt={business.images.find((img: BusinessImage) => img.is_primary)?.alt_text || business.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-end">
          <div className="container p-6">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  {business.category?.name || "Uncategorized"}
                </Badge>
                {business.subcategory && (
                  <Badge variant="secondary" className="backdrop-blur-sm">
                    {business.subcategory.name}
                  </Badge>
                )}
                <Badge 
                  variant={business.is_active ? "default" : "destructive"} 
                  className={`backdrop-blur-sm ${business.is_active ? "bg-green-600 hover:bg-green-700" : "bg-red-600/90 hover:bg-red-700/90"}`}
                >
                  {business.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{business.name}</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">{business.description.substring(0, 150)}...</p>
              <div className="flex items-center gap-3 text-white/90">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${star <= business.rating ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`} 
                    />
                  ))}
                </div>
                <span className="font-medium">{business.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{"$".repeat(business.price_range)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to My Business Button */}
        <Button variant="secondary" size="sm" asChild className="absolute top-4 right-4 bg-background/90 text-foreground hover:bg-background backdrop-blur-sm">
          <Link href="/owner/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Business
          </Link>
        </Button>
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
              <Card className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-6">
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

            {/* Our Services Section */}
            <ServicesSection 
              businessId={business.id} 
              isOwner={isOwner} 
              businessName={business.name}
              initialServicesData={servicesData}
            />

            {/* Featured Specials Section */}
            <SpecialsSection 
              businessId={business.id} 
              isOwner={isOwner} 
              businessName={business.name}
              initialSpecialsData={specialsData}
            />

            {/* Dynamic Menu/Services Section based on business type */}
            {menuData ? (
              <MenuSection 
                businessId={id}
                isOwner={isOwner}
                initialMenuData={menuData}
              />
            ) : businessTypeMenu && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  {businessTypeMenu.icon}
                  <span className="ml-2">{businessTypeMenu.title}</span>
                </h2>
                <Card className="shadow-md overflow-hidden">
                  <Tabs defaultValue={businessTypeMenu.categories[0].name.toLowerCase()}>
                    <TabsList className="h-12 w-full justify-start overflow-hidden p-0 bg-muted/50 rounded-t-lg rounded-b-none border-b">
                      {businessTypeMenu.categories.map((category) => (
                        <TabsTrigger 
                          key={category.name} 
                          value={category.name.toLowerCase()}
                          // className="py-4 px-6 h-12 data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                          className="py-4 px-6 h-12 data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {businessTypeMenu.categories.map((category) => (
                      <TabsContent key={category.name} value={category.name.toLowerCase()} className="p-4">
                        <div className="space-y-4">
                          {category.items.map((item, index) => (
                            <Card key={index} className="overflow-hidden border border-muted hover:border-muted-foreground/20 transition-all">
                              <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-lg font-bold text-primary">{item.price}</span>
                                  <Button variant="ghost" size="sm" className="mt-2">Details</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </Card>
              </section>
            )}

            {/* Find Us Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Find Us
              </h2>
              <Card className="overflow-hidden border-0 shadow-md">
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
            <ReviewsSection 
              businessId={business.id} 
              isOwner={isOwner} 
              businessName={business.name}
            />
          </div>

          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Contact Business</Button>
              <Button size="lg" variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/30">Book Appointment</Button>
            </div>

            {/* Contact Information */}
            <Card className="border-0 shadow-md">
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
            <Card className="border-0 shadow-md">
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
            <Card className="border-0 shadow-md">
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
                    <h3 className="text-sm font-medium mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.attributes.map((attr: BusinessAttribute) => {
                        // Format the attribute value based on its type
                        let displayValue = attr.value;
                        if (typeof attr.value === 'boolean') {
                          displayValue = attr.value ? 'Yes' : 'No';
                        } else if (Array.isArray(attr.value)) {
                          displayValue = attr.value.join(', ');
                        }
                        
                        return (
                          <Badge 
                            key={attr.id} 
                            variant="secondary" 
                            className="py-1 px-2 bg-secondary/80 text-secondary-foreground"
                          >
                            {displayValue.toString()}
                          </Badge>
                        );
                      })}
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