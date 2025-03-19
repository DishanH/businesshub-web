import { Metadata } from "next";
import { getFeaturedBusinesses } from "../../business-profiles/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Featured Businesses | BusinessHub",
  description: "Discover our featured businesses with special offers and premium services",
};

export default async function FeaturedBusinessesPage() {
  // Get all featured businesses (larger amount)
  const { data: featuredBusinesses } = await getFeaturedBusinesses(24);

  return (
    <div className="container py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/business-profiles">Businesses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Featured</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Featured Businesses
          </h1>
          <p className="text-muted-foreground">
            Discover our top-rated businesses with special offers and premium services
          </p>
        </div>
      </div>
      
      {/* Featured Businesses Grid */}
      <section>
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
        
        {/* Show when no featured businesses are available */}
        {(!featuredBusinesses || featuredBusinesses.length === 0) && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No featured businesses yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for our featured business listings
            </p>
            <Button asChild>
              <Link href="/business-profiles">View All Businesses</Link>
            </Button>
          </div>
        )}
      </section>
      
      {/* CTA section */}
      <section className="mt-12 text-center py-12 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Interested in featuring your business?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Get more visibility and reach more customers by featuring your business on BusinessHub.
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