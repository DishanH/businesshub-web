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
      {/* Hero Section with gradient background */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-muted overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block mb-2">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm border-primary/20">
                <span className="text-primary mr-1">✨</span> Connect with top local businesses
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Discover Local Businesses
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the best services, shops and professionals in your area all in one place
            </p>
            
            {/* Modern Search Bar */}
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl -m-1 group-focus-within:bg-primary/10 transition-all duration-300"></div>
                  <div className="relative flex items-center rounded-lg border border-input/50 bg-background/80 backdrop-blur-sm shadow-sm transition-all">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="What are you looking for?"
                      className="border-0 bg-transparent pl-10 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="relative w-full md:w-40 group">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl -m-1 group-focus-within:bg-primary/10 transition-all duration-300"></div>
                  <div className="relative flex items-center rounded-lg border border-input/50 bg-background/80 backdrop-blur-sm shadow-sm">
                    <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="Location"
                      className="border-0 bg-transparent pl-10 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <Button size="lg" className="py-6 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <div className="container py-12 space-y-16">
        {/* Featured Businesses Section with visual improvements */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Featured Businesses</h2>
            <div className="flex-1 border-t border-border/40 ml-4"></div>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary" asChild>
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
                  "group overflow-hidden border-border/40 bg-card hover:bg-card/80 transition-all duration-300",
                  "hover:shadow-md hover:shadow-primary/5 hover:border-primary/20",
                  i === 0 ? "md:col-span-2 lg:col-span-1 md:row-span-1" : ""
                )}
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <p className="text-muted-foreground">{business.name[0]}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 hover:bg-primary text-white">Featured</Badge>
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
                  <Button variant="outline" className="w-full group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors" asChild>
                    <Link href={`/business-profiles/${business.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Newly Added Businesses Section with visual improvements */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Newly Added</h2>
            <div className="flex-1 border-t border-border/40 ml-4"></div>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary" asChild>
              <Link href="/business-profiles/new">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(newBusinesses || featuredBusinesses?.slice(0, 3))?.map((business) => (
              <Card 
                key={`new-${business.id}`} 
                className="group overflow-hidden border-border/40 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20"
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {business.image ? (
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <p className="text-muted-foreground">{business.name[0]}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/30 text-primary">New</Badge>
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
                  <Button variant="outline" className="w-full group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors" asChild>
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
        <section className="py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Explore by Category</h2>
            <div className="flex-1 border-t border-border/40 ml-4"></div>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary" asChild>
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
                className="group relative p-6 rounded-xl border border-border/40 bg-card flex flex-col items-center justify-center text-center gap-3 hover:border-primary/30 hover:bg-primary/5 transition-all hover:shadow-md"
              >
                <div className="text-3xl">{category.icon}</div>
                <div className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action with modern gradient background */}
        <section className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background"></div>
          <div className="relative z-10 py-16 px-8 text-center">
            <div className="inline-block mb-4">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm border-primary/20">
                <span className="text-primary mr-1">🚀</span> Join our business community
              </Badge>
            </div>
            <h2 className="text-3xl font-bold mb-4">Grow Your Business With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              List your business on BusinessHub to reach more customers, gain visibility,
              and grow your online presence with our powerful platform.
            </p>
            <Button size="lg" className="bg-primary/90 hover:bg-primary text-white shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/owner/business-profiles/create">
                Get Started
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
} 