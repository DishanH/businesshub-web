import { Metadata } from "next";
import { getNewlyAddedBusinesses } from "../../business-profiles/actions";
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

// Interface for business data
interface Business {
  id: string;
  name: string;
  description: string;
  category_id: string;
  image?: string;
  subcategory_id?: string;
  price_range?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export const metadata: Metadata = {
  title: "Newly Added Businesses | BusinessHub",
  description: "Discover the latest businesses that have joined our platform",
};

export default async function NewlyAddedBusinessesPage() {
  // Get newly added businesses (larger amount)
  const { data: newBusinesses } = await getNewlyAddedBusinesses(24);

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
              <BreadcrumbPage>Newly Added</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Newly Added Businesses
          </h1>
          <p className="text-muted-foreground">
            Discover the latest businesses that have joined our platform
          </p>
        </div>
      </div>
      
      {/* Newly Added Businesses Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newBusinesses?.map((business: Business) => (
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
                  <Badge variant="secondary">New</Badge>
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
        
        {/* Show when no new businesses are available */}
        {(!newBusinesses || newBusinesses.length === 0) && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No new businesses added yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for newly added business listings
            </p>
            <Button variant="secondary" asChild>
              <Link href="/business-profiles">View All Businesses</Link>
            </Button>
          </div>
        )}
      </section>
      
      {/* CTA section */}
      <section className="mt-12 text-center py-12 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Be one of our newest businesses</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Add your business to BusinessHub today and get discovered by new customers.
        </p>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all" asChild>
          <Link href="/owner/business-profiles/create">
            Add Your Business
          </Link>
        </Button>
      </section>
    </div>
  );
} 