import { Metadata } from "next";
import { getFeaturedBusinesses } from "@/app/owner/business-profiles/actions/core";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Business Profiles | BusinessHub",
  description: "Discover and explore businesses in your area",
};

export default async function BusinessProfilesPage() {
  const { data: featuredBusinesses } = await getFeaturedBusinesses(6);

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Discover Local Businesses</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find and connect with the best businesses in your area
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search businesses..." 
              className="w-full pl-10 py-2 pr-4 rounded-md border border-input bg-background"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Location" 
              className="w-40 pl-10 py-2 pr-4 rounded-md border border-input bg-background"
            />
          </div>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <Button variant="ghost" asChild>
            <Link href="/services">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Restaurants", "Retail", "Services", "Health", "Entertainment", "Professional"].map((category) => (
            <Link 
              key={category} 
              href={`/services/${category.toLowerCase()}`}
              className="bg-muted hover:bg-muted/80 transition-colors rounded-lg p-4 text-center"
            >
              <div className="font-medium">{category}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Businesses</h2>
          <Button variant="ghost" asChild>
            <Link href="/business-profiles/featured">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBusinesses?.map((business) => (
            <Card key={business.id} className="overflow-hidden">
              <div className="h-48 bg-muted relative">
                {business.image ? (
                  <img 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge>Featured</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{business.name}</CardTitle>
                <CardDescription>{business.category_id}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="line-clamp-2">{business.description}</p>
              </CardContent>
              
              <CardFooter>
                <Button asChild>
                  <Link href={`/business-profiles/${business.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Own a Business?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          List your business on BusinessHub to reach more customers and grow your online presence.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/owner/business-profiles/create">
            Add Your Business
          </Link>
        </Button>
      </section>
    </div>
  );
} 