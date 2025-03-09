"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Users, 
  Building, 
  MessageSquare, 
  Star, 
  Calendar, 
  PlusCircle,
  ArrowRight,
  Activity
} from "lucide-react";
import { getUserBusinesses } from "@/app/owner/business-profiles/actions/core";
import { toast } from "@/components/ui/use-toast";

// Define business type
interface Business {
  id: string;
  name: string;
  description: string;
  image?: string;
  category?: {
    name: string;
  } | null;
}

export default function OwnerDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await getUserBusinesses();
        
        if (fetchError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: fetchError,
          });
          setBusinesses([]);
        } else if (data) {
          setBusinesses(data as Business[]);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch businesses",
        });
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Mock data for dashboard
  const dashboardData = {
    totalViews: 1248,
    totalLeads: 42,
    totalReviews: 18,
    averageRating: 4.7,
    recentMessages: [
      { id: 1, from: "John Doe", subject: "Inquiry about your services", date: "2024-03-07" },
      { id: 2, from: "Jane Smith", subject: "Booking request", date: "2024-03-06" },
      { id: 3, from: "Michael Johnson", subject: "Question about hours", date: "2024-03-05" }
    ],
    upcomingAppointments: [
      { id: 1, client: "Emily Wilson", service: "Consultation", date: "2024-03-10", time: "10:00 AM" },
      { id: 2, client: "Robert Brown", service: "Follow-up", date: "2024-03-12", time: "2:30 PM" }
    ]
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your businesses and services</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/owner/business-profiles/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/owner/services/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.totalViews}</div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.totalLeads}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.totalReviews}</div>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+3 new reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.averageRating}</div>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="businesses">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="businesses">My Businesses</TabsTrigger>
          <TabsTrigger value="services">My Services</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="businesses" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Business Profiles</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/owner/business-profiles">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading your businesses...</p>
            </div>
          ) : businesses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No businesses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first business profile
                </p>
                <Button asChild>
                  <Link href="/owner/business-profiles/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Business
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.slice(0, 3).map((business) => (
                <Card key={business.id} className="overflow-hidden">
                  <div className="h-32 bg-muted flex items-center justify-center">
                    {business.image ? (
                      <img 
                        src={business.image} 
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>{business.category?.name || "Uncategorized"}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/owner/business-profiles/${business.id}`}>
                        Preview
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/owner/business-profiles/edit/${business.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Services</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/owner/services">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4">
                Start offering your services to reach more customers
              </p>
              <Button asChild>
                <Link href="/owner/services/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Messages</CardTitle>
                <CardDescription>Latest inquiries from potential customers</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentMessages.map((message) => (
                      <div key={message.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{message.from}</p>
                          <p className="text-sm text-muted-foreground">{message.subject}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No recent messages</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Messages
                </Button>
              </CardFooter>
            </Card>
            
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Scheduled meetings with clients</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{appointment.client}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No upcoming appointments</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Calendar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Activity Feed */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Activity Feed</CardTitle>
                <CardDescription>Recent activity on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">New review received</p>
                      <p className="text-sm text-muted-foreground">A customer left a 5-star review on your business</p>
                      <p className="text-xs text-muted-foreground mt-1">Today, 10:23 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Profile view spike</p>
                      <p className="text-sm text-muted-foreground">Your business profile received 24 views in the last hour</p>
                      <p className="text-xs text-muted-foreground mt-1">Today, 9:15 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">New message</p>
                      <p className="text-sm text-muted-foreground">You received a new inquiry about your services</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday, 4:32 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 