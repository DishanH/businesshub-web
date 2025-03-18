"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Calendar, Clock, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";

// Define interfaces for our data
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  categories: string[];
  featured?: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Toggle saved post status
  const toggleSaved = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  // Define blog categories
  const categories: BlogCategory[] = [
    { id: "all", name: "All Posts", count: 12 },
    { id: "business-tips", name: "Business Tips", count: 5 },
    { id: "marketing", name: "Marketing", count: 3 },
    { id: "analytics", name: "Analytics & Performance", count: 2 },
    { id: "customer-engagement", name: "Customer Engagement", count: 2 },
    { id: "industry-news", name: "Industry News", count: 1 },
  ];

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Ways to Optimize Your Business Profile for Maximum Visibility",
      excerpt: "Learn the essential strategies to make your business stand out in search results and attract more potential customers.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/optimize-profile.jpg",
      publishDate: "2023-06-15",
      readTime: "8 min read",
      author: {
        name: "Alex Morgan",
        avatar: "/images/avatars/alex-morgan.jpg",
        role: "Marketing Specialist"
      },
      categories: ["business-tips", "marketing"],
      featured: true
    },
    {
      id: "2",
      title: "Understanding Analytics: How to Use Data to Grow Your Business",
      excerpt: "Dive into the world of business analytics and learn how to interpret data to make informed decisions for growth.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/analytics.jpg",
      publishDate: "2023-05-28",
      readTime: "12 min read",
      author: {
        name: "Sam Wilson",
        avatar: "/images/avatars/sam-wilson.jpg",
        role: "Data Analyst"
      },
      categories: ["analytics", "business-tips"],
      featured: true
    },
    {
      id: "3",
      title: "Building Customer Loyalty Through Engagement",
      excerpt: "Discover proven strategies to enhance customer engagement and build lasting relationships with your audience.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/customer-loyalty.jpg",
      publishDate: "2023-05-10",
      readTime: "6 min read",
      author: {
        name: "Priya Sharma",
        avatar: "/images/avatars/priya-sharma.jpg",
        role: "Customer Relations"
      },
      categories: ["customer-engagement", "business-tips"]
    },
    {
      id: "4",
      title: "The Future of Digital Business Cards",
      excerpt: "Explore how digital business cards are evolving and how they can help you make a lasting impression.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/digital-cards.jpg",
      publishDate: "2023-04-22",
      readTime: "5 min read",
      author: {
        name: "Jordan Lee",
        avatar: "/images/avatars/jordan-lee.jpg",
        role: "Product Designer"
      },
      categories: ["industry-news", "business-tips"]
    },
    {
      id: "5",
      title: "Email Marketing Strategies That Actually Convert",
      excerpt: "Learn effective email marketing techniques that can help increase your conversion rates and grow your customer base.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/email-marketing.jpg",
      publishDate: "2023-04-05",
      readTime: "9 min read",
      author: {
        name: "Alex Morgan",
        avatar: "/images/avatars/alex-morgan.jpg",
        role: "Marketing Specialist"
      },
      categories: ["marketing", "business-tips"]
    },
    {
      id: "6",
      title: "Measuring ROI on Your Digital Presence",
      excerpt: "Understand how to effectively measure the return on investment for your online business presence.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/roi-measurement.jpg",
      publishDate: "2023-03-18",
      readTime: "10 min read",
      author: {
        name: "Sam Wilson",
        avatar: "/images/avatars/sam-wilson.jpg",
        role: "Data Analyst"
      },
      categories: ["analytics", "business-tips"]
    },
    {
      id: "7",
      title: "Customer Feedback: How to Collect and Implement It Effectively",
      excerpt: "Discover strategies to gather valuable customer feedback and turn it into actionable improvements for your business.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/customer-feedback.jpg",
      publishDate: "2023-03-02",
      readTime: "7 min read",
      author: {
        name: "Priya Sharma",
        avatar: "/images/avatars/priya-sharma.jpg",
        role: "Customer Relations"
      },
      categories: ["customer-engagement", "business-tips"]
    },
    {
      id: "8",
      title: "The Psychology of Color in Marketing",
      excerpt: "Learn how color psychology affects customer perception and how to use it effectively in your marketing materials.",
      content: "Lorem ipsum dolor sit amet...",
      coverImage: "/images/blog/color-psychology.jpg",
      publishDate: "2023-02-14",
      readTime: "8 min read",
      author: {
        name: "Jordan Lee",
        avatar: "/images/avatars/jordan-lee.jpg",
        role: "Product Designer"
      },
      categories: ["marketing", "business-tips"]
    }
  ];

  // Filter blog posts based on search query and active category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || post.categories.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Separate featured posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container py-10">
      {/* Breadcrumb Navigation - Full width */}
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/site">Site</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Business Hub Blog</h1>
          <p className="text-muted-foreground mt-1">
            Expert insights, tips, and strategies to help you grow your business.
          </p>
        </div>
      </div>
      
      {/* Full width separator */}
      <Separator className="bg-gradient-to-r from-border via-primary/20 to-border mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar - Category filters and search */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Search bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-border/40 focus-visible:ring-primary/30"
                />
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`w-full justify-between h-auto py-2 px-3 ${
                      activeCategory === category.id ? "bg-primary/10 text-primary" : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
              <h3 className="font-medium mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get the latest articles and business tips delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input placeholder="Your email address" className="border-border/40" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content - Article listings */}
        <div className="lg:col-span-3 space-y-10">
          {/* Featured Articles */}
          {featuredPosts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Featured Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Image</span>
                      </div>
                      {/* Uncomment when real images are available */}
                      {/* <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      /> */}
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          {post.categories.map((catId) => {
                            const category = categories.find(c => c.id === catId);
                            return category ? (
                              <Badge key={catId} variant="outline" className="mr-2 bg-muted/50">
                                {category.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => toggleSaved(post.id)}
                        >
                          {savedPosts.includes(post.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="mt-2 text-xl group-hover:text-primary transition-colors">
                        <Link href={`/site/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 border border-border/30">
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium leading-none">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">{post.author.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{formatDate(post.publishDate)}</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Articles */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Recent Articles</h2>
              {activeCategory !== "all" && (
                <Button variant="ghost" size="sm" onClick={() => setActiveCategory("all")}>
                  View all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image</span>
                    </div>
                    {/* Uncomment when real images are available */}
                    {/* <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    /> */}
                  </div>
                  <CardHeader className="pb-3 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        {post.categories.slice(0, 1).map((catId) => {
                          const category = categories.find(c => c.id === catId);
                          return category ? (
                            <Badge key={catId} variant="outline" className="mr-2 bg-muted/50">
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => toggleSaved(post.id)}
                      >
                        {savedPosts.includes(post.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardTitle className="mt-2 text-lg group-hover:text-primary transition-colors">
                      <Link href={`/site/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-4 flex items-center justify-between border-t border-border/20 mt-auto">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6 border border-border/30">
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{post.author.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(post.publishDate)}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {regularPosts.length > 6 && (
              <div className="flex justify-center mt-10">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary/10 text-primary">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* More content CTA */}
          <div className="bg-muted/30 border border-border/40 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Want to contribute?</h3>
              <p className="text-muted-foreground mt-1">
                Share your expertise with our community. Submit your article today.
              </p>
            </div>
            <Button className="md:flex-shrink-0 group">
              <span>Submit Article</span>
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 