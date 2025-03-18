"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Share2, Bookmark, BookmarkCheck, ChevronLeft } from "lucide-react";

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

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Toggle saved post status
  const toggleSaved = () => {
    setIsSaved(!isSaved);
  };

  // Fetch post data
  useEffect(() => {
    // Sample blog categories
    const blogCategories: BlogCategory[] = [
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
        content: `<p>Having a strong online presence is essential for businesses today. Yet, many business owners struggle to make their profiles stand out in an increasingly crowded digital landscape. This article explores ten proven strategies to optimize your business profile and increase your visibility.</p>
        
        <h2>1. Complete Your Profile Entirely</h2>
        <p>Studies show that complete profiles get up to 30% more views. Take time to fill out every section of your business profile. This includes business hours, services offered, payment methods, and plenty of high-quality images. Search algorithms favor complete profiles, and customers are more likely to engage with businesses that provide comprehensive information.</p>
        
        <h2>2. Use Strategic Keywords</h2>
        <p>Research keywords that potential customers use when looking for services you offer. Incorporate these naturally throughout your profile description, services list, and even in photo captions. Focus on local-specific keywords if you serve a particular geographic area.</p>
        
        <h2>3. Showcase Visual Content</h2>
        <p>Profiles with quality visuals receive up to 94% more views. Upload professional photos of your business, products, services, and team. Consider adding videos as they can increase engagement by 80%. Ensure all visual content is high-resolution and properly represents your brand.</p>
        
        <h2>4. Collect and Respond to Reviews</h2>
        <p>Businesses with active review management see up to 15% higher conversion rates. Encourage satisfied customers to leave positive reviews. Always respond thoughtfully to both positive and negative feedback. This demonstrates your commitment to customer service and boosts your profile's credibility.</p>
        
        <h2>5. Update Regularly</h2>
        <p>Profiles updated within the last 30 days appear higher in search results. Make regular updates to your hours, offerings, or add seasonal promotions. Even small changes signal to search algorithms that your business is active and relevant.</p>
        
        <h2>6. Add Special Features and Attributes</h2>
        <p>Highlight what makes your business unique. Are you woman-owned, eco-friendly, or veteran-operated? Do you offer free Wi-Fi, outdoor seating, or accessibility features? These attributes help you appear in specialized searches and appeal to customers with specific preferences.</p>
        
        <h2>7. Create Engaging Posts</h2>
        <p>Businesses that post weekly see 120% more customer engagement than those who don't. Share updates, special offers, events, or helpful tips related to your industry. Use a mix of text, images, and videos to keep your content fresh and engaging.</p>
        
        <h2>8. Optimize for Mobile Viewing</h2>
        <p>Over 60% of profile views come from mobile devices. Ensure your profile looks good on small screens by using concise text, vertical images, and mobile-friendly videos. Test your profile's appearance on various devices to ensure optimal presentation.</p>
        
        <h2>9. Link to Your Website and Social Media</h2>
        <p>Create a cohesive online presence by connecting all your digital platforms. This improves your SEO ranking and provides customers with multiple ways to engage with your business. Ensure your branding is consistent across all platforms for a professional appearance.</p>
        
        <h2>10. Analyze and Adapt</h2>
        <p>Use analytics tools to track which aspects of your profile generate the most interest. Pay attention to which photos get the most views, what information customers click on most, and which posts receive the highest engagement. Use these insights to continuously refine your profile strategy.</p>
        
        <h2>Conclusion</h2>
        <p>Optimizing your business profile is an ongoing process rather than a one-time task. By implementing these ten strategies and regularly refining your approach based on performance data, you'll increase your visibility, attract more customers, and ultimately grow your business.</p>`,
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
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
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
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
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
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
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
    ];

    setCategories(blogCategories);
    
    // Find the post with the matching ID
    const currentPost = blogPosts.find(post => post.id === postId);
    if (currentPost) {
      setPost(currentPost);
      
      // Find related posts (posts with shared categories, excluding the current post)
      if (currentPost.categories && currentPost.categories.length > 0) {
        const related = blogPosts
          .filter(p => 
            p.id !== postId && 
            p.categories.some(cat => currentPost.categories.includes(cat))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [postId]);

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl">Loading article...</h1>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Breadcrumb Navigation */}
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
              <BreadcrumbLink href="/site/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content - Article */}
        <div className="lg:col-span-3 space-y-8">
          {/* Article Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((catId) => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <Link href={`/site/blog?category=${catId}`} key={catId}>
                    <Badge variant="outline" className="mr-2 bg-muted/50">
                      {category.name}
                    </Badge>
                  </Link>
                ) : null;
              })}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 border border-border/30">
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Article cover image */}
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted mb-8">
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">Featured Image</span>
            </div>
            {/* Uncomment when real images are available */}
            {/* <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            /> */}
          </div>
          
          {/* Article content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Article footer - tags and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-b border-border/40 py-6 mt-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((catId) => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <Link href={`/site/blog?category=${catId}`} key={catId}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {category.name}
                    </Badge>
                  </Link>
                ) : null;
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleSaved}>
                {isSaved ? <BookmarkCheck className="h-4 w-4 mr-1 text-primary" /> : <Bookmark className="h-4 w-4 mr-1" />}
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Author bio */}
          <div className="bg-muted/30 rounded-lg border border-border/40 p-6 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="h-16 w-16 border border-border/30">
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">About {post.author.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{post.author.role}</p>
                <p className="text-sm">
                  {post.author.name} is a specialist in {post.author.role.toLowerCase()} with years of experience helping businesses achieve their goals. They regularly write about {post.categories.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return category ? category.name.toLowerCase() : '';
                  }).join(', ')}.
                </p>
              </div>
            </div>
          </div>
          
          {/* Article navigation */}
          <div className="flex justify-between items-center mt-10">
            <Button variant="outline" className="gap-1" asChild>
              <Link href="/site/blog">
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Blog</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Table of contents */}
            <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
              <h3 className="font-medium mb-3">In This Article</h3>
              <div className="space-y-1 text-sm">
                <a href="#" className="block text-primary hover:underline py-1">Introduction</a>
                <a href="#" className="block hover:text-primary py-1">Complete Your Profile Entirely</a>
                <a href="#" className="block hover:text-primary py-1">Use Strategic Keywords</a>
                <a href="#" className="block hover:text-primary py-1">Showcase Visual Content</a>
                <a href="#" className="block hover:text-primary py-1">And 6 more sections...</a>
              </div>
            </div>
            
            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
                <h3 className="font-medium mb-3">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map(relatedPost => (
                    <div key={relatedPost.id} className="flex gap-3">
                      <div className="relative min-w-[60px] w-[60px] h-[60px] rounded overflow-hidden bg-muted">
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground text-xs">Image</span>
                        </div>
                      </div>
                      <div>
                        <Link href={`/site/blog/${relatedPost.id}`} className="font-medium text-sm hover:text-primary line-clamp-2">
                          {relatedPost.title}
                        </Link>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(relatedPost.publishDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/40">
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link href="/site/blog">View All Articles</Link>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Popular categories */}
            <div className="bg-muted/30 rounded-lg border border-border/40 p-4">
              <h3 className="font-medium mb-3">Popular Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.id !== 'all').slice(0, 5).map(category => (
                  <Link href={`/site/blog?category=${category.id}`} key={category.id}>
                    <Badge variant="outline" className="bg-muted/50 hover:bg-muted cursor-pointer">
                      {category.name} ({category.count})
                    </Badge>
                  </Link>
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
                <input type="text" placeholder="Your email address" className="w-full px-3 py-2 border border-border/40 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 