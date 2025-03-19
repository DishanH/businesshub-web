import { Metadata } from "next";
import { getFeaturedBusinesses, getNewlyAddedBusinesses } from "@/app/(public)/business-profiles/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin, Star, TrendingUp, Award, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Business Profiles | BusinessHub",
  description: "Discover and explore businesses in your area",
};

export default async function BusinessProfilesPage() {
  const { data: featuredBusinesses } = await getFeaturedBusinesses(6);
  const { data: newBusinesses } = await getNewlyAddedBusinesses(3);

  return (
    <div className="min-h-screen">
      {/* Hero Section - aligned with homepage style */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-muted overflow-hidden rounded-lg">
        <div className="container py-12 md:py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Discover Local Businesses
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the best services, shops and professionals in your area all in one place
            </p>
            
            {/* Search Bar - matching homepage style */}
            <div className="mt-6 max-w-2xl mx-auto">
              <form className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="What are you looking for?"
                    className="pl-10"
                  />
                </div>
                <div className="relative w-full md:w-40">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Location"
                    className="pl-10"
                  />
                </div>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span>Popular:</span>
                {["Restaurants", "Plumbers", "Electricians", "Hair Salons"].map((term) => (
                  <Link 
                    key={term} 
                    href={`/search?q=${term}`}
                    className="hover:text-primary transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-12">
        {/* Featured Businesses Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Featured Businesses</h2>
            <div className="flex-1 border-t border-border/40 ml-3"></div>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/business-profiles/featured">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses?.map((business, i) => (
              <Card 
                key={business.id} 
                className={cn(
                  "group overflow-hidden transition-all duration-200 hover:shadow-md",
                  i === 0 ? "md:col-span-2 lg:col-span-1 md:row-span-1" : ""
                )}
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <p className="text-muted-foreground">{business.name[0]}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge>Featured</Badge>
                  </div>
                  {business.rating && (
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm text-sm px-2 py-1 rounded-md">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{business.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {business.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    {business.category_id}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {business.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/business-profiles/${business.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Newly Added Businesses Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Newly Added</h2>
            <div className="flex-1 border-t border-border/40 ml-3"></div>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/business-profiles/new">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(newBusinesses || featuredBusinesses?.slice(0, 3))?.map((business) => (
              <Card 
                key={`new-${business.id}`} 
                className="group overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <p className="text-muted-foreground">{business.name[0]}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {business.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    {business.category_id}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="line-clamp-2 text-muted-foreground text-sm">
                    {business.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/business-profiles/${business.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Section with improved styling */}
        <section className="pt-4 pb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-full bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Explore by Category</h2>
            <div className="flex-1 border-t border-border/40 ml-3"></div>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/categories">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Restaurants", icon: "🍽️" },
              { name: "Retail", icon: "🛍️" },
              { name: "Services", icon: "🔧" },
              { name: "Health", icon: "🏥" },
              { name: "Entertainment", icon: "🎭" },
              { name: "Professional", icon: "💼" }
            ].map((category) => (
              <Link 
                key={category.name} 
                href={`/categories/${category.name.toLowerCase()}`}
                className="group bg-card p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 transition-colors hover:bg-muted"
              >
                <div className="text-2xl">{category.icon}</div>
                <div className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action - matching the homepage style */}
        <section className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Own a Business?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            List your business on BusinessHub to reach more customers and grow your online presence.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all" asChild>
            <Link href="/owner/business-profiles/create">
              Add Your Business
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
} 