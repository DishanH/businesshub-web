import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarIcon, MessageSquare, Share2, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findLocationById, getDefaultLocation } from "@/lib/locations";

// This would eventually come from an API or database
const SAMPLE_POSTS = [
  {
    id: "1",
    title: "5 Local Businesses Making a Difference in Our Community",
    content: `
      <p>Small businesses are more than just commercial establishments—they're essential parts of our community fabric. Beyond providing goods and services, many local entrepreneurs actively work to make our neighborhoods better places to live.</p>
      
      <p>These five businesses exemplify how commerce and community service can go hand in hand, creating positive ripple effects throughout our area:</p>
      
      <h3>1. Green Thumb Garden Center</h3>
      <p>Beyond selling plants and garden supplies, Green Thumb has initiated a community garden program where they donate seeds, soil, and expertise to school gardens. They also host monthly workshops teaching sustainable gardening practices to residents.</p>
      
      <h3>2. Riverfront Café</h3>
      <p>This family-owned café does more than serve great coffee. They've implemented a "suspended coffee" program where customers can pre-pay for coffee that will be given to someone who can't afford it. They also offer their space free of charge for community meetings and host fundraisers for local causes.</p>
      
      <h3>3. BookNook Bookstore</h3>
      <p>This independent bookstore runs a literacy program in partnership with local schools, donating books to children from low-income families. Their monthly author events spotlight local writers and strengthen our community's literary culture.</p>
      
      <h3>4. Tech Forward</h3>
      <p>This computer repair shop refurbishes old computers and donates them to seniors and students who can't afford new equipment. They also offer free basic computer skills classes to help bridge the digital divide in our community.</p>
      
      <h3>5. Healthy Harvest Market</h3>
      <p>This grocery store partners exclusively with local farmers and food producers, strengthening our local food economy. They've also implemented a food waste reduction program, donating all unsold but still edible food to local shelters.</p>
      
      <p>These businesses demonstrate that success isn't just measured in profits but also in positive community impact. By supporting these establishments, you're not just getting goods and services—you're investing in a stronger, more connected community.</p>
      
      <p>Do you know other local businesses making a difference? Share them in the comments below!</p>
    `,
    excerpt: "Discover how these small businesses are giving back and making our neighborhood better for everyone.",
    category: "Community",
    date: "2023-11-15",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Jamie Smith",
      avatar: "/placeholder.svg"
    },
    commentCount: 12,
    comments: [
      {
        id: "c1",
        author: {
          name: "Riley Thompson",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-16",
        content: "Great article! I'd add Parkside Bakery to this list. They donate leftover bread and pastries to the local shelter every evening.",
        likes: 8
      },
      {
        id: "c2",
        author: {
          name: "Morgan Chen",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-17",
        content: "I volunteer at Tech Forward's computer classes. The impact they've had on seniors in our community is incredible!",
        likes: 12
      }
    ]
  },
  {
    id: "2",
    title: "Upcoming Street Festival: What to Expect This Year",
    content: `
      <p>Our annual street festival is just around the corner, and this year promises to be bigger and better than ever! Mark your calendars for June 15-17 and get ready for a weekend filled with food, music, art, and community celebration.</p>
      
      <h3>Food Vendors</h3>
      <p>This year features over 30 food vendors representing cuisines from around the world. From local favorites like The Grill House and Sweet Treats Bakery to newcomers like Authentic Thai and Mediterranean Delights, there will be something to satisfy every palate.</p>
      
      <h3>Local Artists</h3>
      <p>The art exhibition has expanded this year with 25 local artists displaying and selling their work. Look for the art pavilion on Main Street where you can meet the artists and even participate in hands-on workshops throughout the weekend.</p>
      
      <h3>Live Music</h3>
      <p>Two stages will feature continuous performances from local bands and musicians. The main stage on Central Avenue will host headliners each evening, while the community stage near the park will showcase emerging talent throughout the day.</p>
      
      <h3>Family Activities</h3>
      <p>The family zone has doubled in size this year! Look forward to carnival games, face painting, a petting zoo, and inflatables for the kids. New this year is a STEM activity center where children can participate in fun science experiments.</p>
      
      <h3>Community Showcase</h3>
      <p>Local businesses and community organizations will have booths throughout the festival where you can learn about their services and how to get involved in community initiatives.</p>
      
      <h3>Practical Information</h3>
      <p>The festival runs Friday 4-10pm, Saturday 10am-10pm, and Sunday 10am-6pm. Free parking is available at the community center with shuttle service to the festival grounds. Admission is free, but food and some activities require purchase.</p>
      
      <p>Don't miss this celebration of everything that makes our community special! Check the official festival website for the full schedule of performances and events.</p>
    `,
    excerpt: "The annual street festival returns with more food vendors, local artists, and activities for the whole family.",
    category: "Events",
    date: "2023-11-10",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg"
    },
    commentCount: 8,
    comments: [
      {
        id: "c3",
        author: {
          name: "Jordan Williams",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-12",
        content: "Looking forward to this! Will there be vegetarian food options available?",
        likes: 5
      }
    ]
  },
  {
    id: "3",
    title: "Local Business Spotlight: Riverfront Café",
    content: `
      <p>Nestled along the riverbank with a picturesque view of the water, Riverfront Café has become more than just a place to grab coffee—it's a community hub where locals gather, ideas are exchanged, and neighborhood bonds are strengthened.</p>
      
      <h3>A Family Legacy</h3>
      <p>Opened in 2010 by the Martinez family, Riverfront Café began as a small coffee shop with just four tables. Maria and Carlos Martinez had a vision that extended beyond serving great coffee; they wanted to create a space where community members could connect.</p>
      
      <p>"We moved to this neighborhood because we fell in love with its sense of community," explains Maria. "The café was our way of contributing to that community fabric."</p>
      
      <h3>More Than Just Coffee</h3>
      <p>While their specialty coffee drinks and homemade pastries initially attracted customers, it's the café's community-focused approach that has earned them loyal patrons. The back room of the café—dubbed "The Living Room"—is available free of charge for community meetings, book clubs, and study groups.</p>
      
      <p>Every month, the café hosts "Community Night" featuring local musicians, poetry readings, or discussions on neighborhood issues. These events regularly draw crowds that fill the café's recently expanded space.</p>
      
      <h3>Supporting Local Causes</h3>
      <p>Riverfront Café sources ingredients from local suppliers and displays art by local artists on their walls. Their "Charity Drink of the Month" program has raised over $15,000 for local causes over the years, with a dollar from each featured drink going to that month's selected organization.</p>
      
      <p>During the pandemic, the café pivoted to provide free coffee to healthcare workers and organized a meal delivery program for elderly residents in the neighborhood.</p>
      
      <h3>Looking Forward</h3>
      <p>Now run by the Martinez family's second generation, with daughter Elena taking the lead, Riverfront Café continues to evolve while maintaining its community focus.</p>
      
      <p>"We're expanding our food menu and planning to open a small satellite location in the new community center," Elena shares. "But no matter how we grow, our mission remains the same—to serve as a gathering place that strengthens our community bonds."</p>
      
      <p>Whether you stop by for their award-winning cappuccino, their famous homemade cinnamon rolls, or to attend a community event, you'll quickly understand why Riverfront Café has become the heart of the neighborhood.</p>
      
      <p>Visit them at 123 River Street, open daily from 7am to 8pm.</p>
    `,
    excerpt: "How this family-owned café became a community hub and gathering spot for neighborhood events.",
    category: "Business Spotlight",
    date: "2023-11-05",
    image: "/placeholder.svg",
    locationId: "toronto",
    author: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg"
    },
    commentCount: 15,
    comments: [
      {
        id: "c4",
        author: {
          name: "Casey Wilson",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-06",
        content: "I love Riverfront Café! Their community events have introduced me to so many interesting people in the neighborhood.",
        likes: 14
      },
      {
        id: "c5",
        author: {
          name: "Taylor Rodriguez",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-08",
        content: "Their Charity Drink program is such a great idea. I always feel good knowing part of my purchase is going to a good cause.",
        likes: 9
      },
      {
        id: "c6",
        author: {
          name: "Jamie Parker",
          avatar: "/placeholder.svg"
        },
        date: "2023-11-09",
        content: "I've been going there since they opened and the quality has never dropped. Great to see them expanding!",
        likes: 6
      }
    ]
  }
];

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export async function generateMetadata({ params }: { params: { postId: string } }) {

  const { postId } = await params;
  const post = SAMPLE_POSTS.find(post => post.id === postId);
  
  if (!post) {
    return {
      title: 'Post Not Found | BusinessHub Community',
      description: 'The requested community post could not be found.'
    };
  }
  
  return {
    title: `${post.title} | BusinessHub Community`,
    description: post.excerpt
  };
}

export default await function PostPage({ 
  params, 
  searchParams 
}: { 
  params: { postId: string }, 
  searchParams: { location?: string } 
}) {
  const post = SAMPLE_POSTS.find(post => post.id === params.postId);
  const locationId = searchParams.location || post?.locationId || "toronto";
  const location = findLocationById(locationId) || getDefaultLocation();
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="bg-background min-h-screen pb-12">
      {/* Cover image */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto -mt-24 relative z-10">
          {/* Breadcrumb navigation */}
          <Breadcrumb className="mb-6 text-white">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white/80 hover:text-white">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href={`/community?location=${locationId}`} 
                  className="text-white/80 hover:text-white"
                >
                  Community
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">
                  {post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <article className="bg-card shadow-lg rounded-xl overflow-hidden">
            <div className="p-6 md:p-10">
              <Badge className="mb-4 bg-primary hover:bg-primary/90">
                {post.category}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentCount} comments</span>
                </div>
                <span className="text-muted-foreground/30">•</span>
                <span>{location.name}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
                <Avatar className="h-10 w-10 border border-primary/10">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">By {post.author.name}</p>
                  <p className="text-sm text-muted-foreground">Community Contributor</p>
                </div>
              </div>
              
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-base prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-border">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" /> 
                  Share
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/community?location=${locationId}`}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Community
                  </Link>
                </Button>
              </div>
            </div>
          </article>
          
          {/* Comments section */}
          <div className="mt-8 bg-card shadow-lg rounded-xl overflow-hidden">
            <div className="p-6 md:p-10">
              <h2 className="text-xl font-bold mb-6">
                Comments ({post.comments?.length || 0})
              </h2>
              
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/40 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{comment.author.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                          </div>
                          <p className="text-sm text-foreground/90">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground gap-1.5">
                            <Heart className="h-3.5 w-3.5" /> 
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
              )}
              
              <Separator className="my-8" />
              
              {/* Add comment form */}
              <div>
                <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 mt-1">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="mb-4 resize-none min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button className="gap-2">
                        Post Comment
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 