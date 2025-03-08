import { Metadata } from "next";
import { getBusinessById } from "../actions/core";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, Edit } from "lucide-react";

interface BusinessPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
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

export default async function BusinessPage({ params }: BusinessPageProps) {
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
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/businesses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Businesses
          </Link>
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{business.category?.name || "Uncategorized"}</Badge>
              <Badge variant={business.is_active ? "default" : "outline"}>
                {business.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <Button asChild variant="outline">
            <Link href={`/businesses/edit/${business.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Business
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {business.images && business.images.length > 0 ? (
              <Image 
                src={business.images.find(img => img.is_primary)?.url || business.images[0].url} 
                alt={business.images.find(img => img.is_primary)?.alt_text || business.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{business.description}</p>
              </div>
              
              {business.additional_info && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                  <p>{business.additional_info}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="mt-4 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p>{business.category?.name || "Uncategorized"}</p>
                  </div>
                  
                  {business.subcategory && (
                    <div>
                      <h3 className="font-medium">Subcategory</h3>
                      <p>{business.subcategory.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium">Price Range</h3>
                    <p>{"$".repeat(business.price_range)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attributes" className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Business Attributes</h2>
              
              {business.attributes && business.attributes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.attributes.map((attr) => (
                    <div key={attr.id} className="border rounded-md p-3">
                      <h3 className="font-medium">{attr.attribute_id}</h3>
                      <p>{attr.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No attributes available</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with {business.name}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p>{business.address}</p>
                  <p>{business.city}, {business.state} {business.zip}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <p>{business.phone}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <p>{business.email}</p>
              </div>
              
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
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
            </CardContent>
          </Card>
          
          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {formatBusinessHours()}
            </CardContent>
          </Card>
          
          {/* Social Media */}
          {business.social && business.social.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {business.social.map((social) => (
                  <a 
                    key={social.id}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <span className="capitalize">{social.platform}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 