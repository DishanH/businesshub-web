import React from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { locations } from "@/lib/locations";

export const metadata = {
  title: "Create Community Post | BusinessHub",
  description: "Share news, tips, or stories about local businesses or community events.",
};

export default function CreateCommunityPostPage({ searchParams }: { searchParams: { location?: string } }) {
  // Get the location from URL params or default to toronto
  const locationId = searchParams.location || "toronto";
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/community?location=${locationId}`}>Community</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Post</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Header section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Community Post</h1>
          </div>
          
          {/* Form */}
          <div className="bg-card shadow-lg rounded-xl p-6 md:p-8">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a descriptive title for your post"
                    className="mt-1.5"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="community">
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="business-spotlight">Business Spotlight</SelectItem>
                        <SelectItem value="tips">Tips & Advice</SelectItem>
                        <SelectItem value="news">Local News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select defaultValue={locationId}>
                      <SelectTrigger id="location" className="mt-1.5">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Short Description</Label>
                  <Textarea 
                    id="excerpt" 
                    placeholder="Write a brief summary of your post (100-150 characters)"
                    className="mt-1.5 resize-none h-20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be displayed in post previews and search results.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Write your post content here. You can use markdown for formatting."
                    className="mt-1.5 min-h-[300px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="mt-1.5 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Drag and drop an image here, or click to select a file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200 x 600 pixels (JPEG or PNG)
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" asChild>
                  <Link href={`/community?location=${locationId}`}>Cancel</Link>
                </Button>
                <Button type="submit">Publish Post</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 