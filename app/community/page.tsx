import React from "react";
import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import { CommunityHighlights } from "@/components/community-highlights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { locations, findLocationById, getDefaultLocation } from "@/lib/locations";

export const metadata = {
  title: "Community Highlights | BusinessHub",
  description: "News, tips, and stories about local businesses and community events.",
};

export default async function CommunityPage({ searchParams }: { searchParams: { location?: string } }) {
  // Get the location from URL params or default to toronto

  const { location : locationParam } = await searchParams;

  const locationId = locationParam || "toronto";
  const location = findLocationById(locationId) || getDefaultLocation();
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Community</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Community Highlights</h1>
            </div>
            
            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-9 w-[200px] md:w-[250px]"
                />
              </div>
              <Link href={`/community/create`}>
                <Button variant="default">Write a Post</Button>
              </Link>
            </div>
          </div>
          
          {/* Location filter and description */}
          <div className="mb-12 space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Showing posts for {location.name}</h2>
              <p className="text-muted-foreground mb-4">
                Stay connected with local happenings, business news, and community events in {location.name}. 
                Discover stories about local businesses making a difference and get the latest 
                updates on upcoming events in your area.
              </p>
              <div className="flex flex-wrap gap-2">
                {locations.map(loc => (
                  <Link key={loc.id} href={`/community?location=${loc.id}`}>
                    <Button 
                      variant={loc.id === locationId ? "default" : "outline"} 
                      size="sm"
                      className={loc.id === locationId ? "" : "hover:bg-primary/5"}
                    >
                      {loc.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tabs for different content types */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="spotlight">Business Spotlight</TabsTrigger>
              <TabsTrigger value="news">Community News</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <CommunityHighlights locationId={locationId} />
            </TabsContent>
            <TabsContent value="events">
              <CommunityHighlights locationId={locationId} category="Events" />
            </TabsContent>
            <TabsContent value="spotlight">
              <CommunityHighlights locationId={locationId} category="Business Spotlight" />
            </TabsContent>
            <TabsContent value="news">
              <CommunityHighlights locationId={locationId} category="Community" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 