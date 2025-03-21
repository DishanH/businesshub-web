"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowRight, MessageSquare, Share2 } from "lucide-react";

interface CommunityPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  locationId: string;
  author: {
    name: string;
    avatar: string;
  };
  commentCount: number;
}

// Example community posts data (can be replaced with actual data fetching)
const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: "1",
    title: "5 Local Businesses Making a Difference in Our Community",
    excerpt: "Discover how these small businesses are giving back and making our neighborhood better for everyone.",
    category: "Community",
    date: "2023-11-15",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Jamie Smith",
      avatar: "/placeholder.svg"
    },
    commentCount: 12
  },
  {
    id: "2",
    title: "Upcoming Street Festival: What to Expect This Year",
    excerpt: "The annual street festival returns with more food vendors, local artists, and activities for the whole family.",
    category: "Events",
    date: "2023-11-10",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg"
    },
    commentCount: 8
  },
  {
    id: "3",
    title: "Local Business Spotlight: Riverfront Café",
    excerpt: "How this family-owned café became a community hub and gathering spot for neighborhood events.",
    category: "Business Spotlight",
    date: "2023-11-05",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg"
    },
    commentCount: 15
  },
  {
    id: "4",
    title: "Hamilton Art Walk Series Launches Next Month",
    excerpt: "The new monthly art walk will showcase local artists and bring the community together around creativity.",
    category: "Events",
    date: "2023-11-18",
    image: "/placeholder.svg",
    locationId: "hamilton",
    author: {
      name: "Taylor Wong",
      avatar: "/placeholder.svg"
    },
    commentCount: 7
  },
  {
    id: "5",
    title: "Mississauga Green Initiative Helps Local Businesses Reduce Carbon Footprint",
    excerpt: "New program supports small businesses in implementing sustainable practices and reducing environmental impact.",
    category: "Community",
    date: "2023-11-12",
    image: "/placeholder.svg",
    locationId: "mississauga",
    author: {
      name: "Jordan Patel",
      avatar: "/placeholder.svg"
    },
    commentCount: 9
  },
  {
    id: "6",
    title: "Vaughan Restaurant Week: Your Guide to Special Menus and Deals",
    excerpt: "Discover the best dining experiences during Vaughan's annual restaurant celebration week.",
    category: "Events",
    date: "2023-11-20",
    image: "/placeholder.svg",
    locationId: "vaughan",
    author: {
      name: "Casey Kim",
      avatar: "/placeholder.svg"
    },
    commentCount: 14
  }
];

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

interface CommunityHighlightsProps {
  locationId?: string;
  category?: string;
}

export function CommunityHighlights({ locationId = "toronto", category }: CommunityHighlightsProps) {
  // Filter posts by location and category if provided
  const filteredPosts = SAMPLE_POSTS.filter(post => {
    // Filter by location
    if (locationId && post.locationId !== locationId) {
      return false;
    }
    
    // Filter by category if specified
    if (category && post.category !== category) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts available for this selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-4px] border-0 shadow-sm">
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary/90">
                  {post.category}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/community/${post.id}?location=${post.locationId}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    <span>{post.commentCount}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          className="border-primary/20 hover:bg-primary/5"
          asChild
        >
          <Link href={locationId ? `/community?location=${locationId}` : "/community"} className="flex items-center gap-1">
            View All Community Posts
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
} 