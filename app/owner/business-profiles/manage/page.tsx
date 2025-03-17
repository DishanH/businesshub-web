"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Pencil, Trash2, Eye, Search, Building, MapPin, Phone, Mail, Calendar, BarChart, Users, MessageSquare, Star, Activity } from "lucide-react";
import { getUserBusinesses, deleteBusiness, updateBusinessStatus } from "@/app/owner/business-profiles/manage/actions";
import type { Business } from "@/app/owner/business-profiles/types";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Extended Business interface with additional properties needed for the UI
interface ExtendedBusiness extends Business {
  category: {
    name: string;
  };
  images: {
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }[];
}

export default function ManageBusinessesPage() {
  const [businesses, setBusinesses] = useState<ExtendedBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<ExtendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("businesses");
  const itemsPerPage = 6;
  const router = useRouter();

  // Mock data for dashboard stats
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
    ],
    activityFeed: [
      { id: 1, type: "review", title: "New review received", description: "A customer left a 5-star review on your business", time: "Today, 10:23 AM" },
      { id: 2, type: "view", title: "Profile view spike", description: "Your business profile received 24 views in the last hour", time: "Yesterday, 3:45 PM" },
      { id: 3, type: "lead", title: "New lead generated", description: "Someone requested more information about your services", time: "Yesterday, 11:30 AM" },
      { id: 4, type: "update", title: "Business information updated", description: "Your business hours were updated successfully", time: "Mar 5, 2024, 2:15 PM" }
    ]
  };

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const result = await getUserBusinesses();
        console.log(result);
        if (result.success) {
          setBusinesses(result.data || []);
          setFilteredBusinesses(result.data || []);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to fetch businesses",
          });
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch businesses",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, []);

  useEffect(() => {
    let filtered = [...businesses];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(business => 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (business.category?.name && business.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter(business => business.is_active);
    } else if (activeTab === "inactive") {
      filtered = filtered.filter(business => !business.is_active);
    }
    
    setFilteredBusinesses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, businesses, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredBusinesses.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (businessId: string) => {
    try {
      setDeleting(businessId);
      const result = await deleteBusiness(businessId);
      
      if (result.success) {
        const updatedBusinesses = businesses.filter(business => business.id !== businessId);
        setBusinesses(updatedBusinesses);
        setFilteredBusinesses(updatedBusinesses);
        toast({
          title: "Success",
          description: "Business deleted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete business",
        });
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete business",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (businessId: string, isDeactivated: boolean) => {
    try {
      setToggling(businessId);
      const result = await updateBusinessStatus(businessId, !isDeactivated);
      
      if (result.success) {
        setBusinesses(businesses.map(business => 
          business.id === businessId 
            ? { ...business, deactivated_by_user: !isDeactivated } 
            : business
        ));
        
        setFilteredBusinesses(filteredBusinesses.map(business => 
          business.id === businessId 
            ? { ...business, deactivated_by_user: !isDeactivated } 
            : business
        ));
        
        toast({
          title: "Success",
          description: isDeactivated 
            ? "Business activation request submitted. It will be reviewed by an admin." 
            : "Business deactivated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update business status",
        });
      }
    } catch (error) {
      console.error("Error toggling business status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update business status",
      });
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Business Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your businesses and services</p>
        </div>
        <Button onClick={() => router.push("/owner/business-profiles/create")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Business
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full h-12 grid-cols-2 mb-6">
          <TabsTrigger value="businesses" className="text-base py-1.5">My Businesses</TabsTrigger>
          <TabsTrigger value="activity" className="text-base py-1.5">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="businesses" className="mt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Business Profiles</h2>
              <p className="text-muted-foreground">Manage and update your business listings</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, description, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-950 border-0 shadow-sm"
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" 
                      onClick={() => setSearchQuery("")}
                    >
                      <span className="sr-only">Clear</span>
                      <span className="text-lg">×</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-white dark:bg-gray-950 shadow-sm">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="inactive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Inactive
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-border/40">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h2 className="text-xl font-medium mb-2">
                {searchQuery ? "No businesses match your search" : "You haven't added any businesses yet"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try a different search term or clear the filters" 
                  : "Get started by adding your first business listing to showcase your services"}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => router.push("/owner/business-profiles/create")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Business
                </Button>
              )}
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBusinesses.map((business) => (
                  <Card 
                    key={business.id} 
                    className="overflow-hidden flex flex-col h-full bg-white dark:bg-gray-950 border-border/40 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-48 bg-muted relative group">
                      {business.images && business.images.length > 0 ? (
                        <Image 
                          src={business.images.find(img => img.is_primary)?.url || business.images[0].url} 
                          alt={business.images.find(img => img.is_primary)?.alt_text || business.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                          <Building className="h-12 w-12 text-muted-foreground opacity-30" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        {business.is_active ? (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1">Active</Badge>
                        ) : business.deactivated_by_user ? (
                          <Badge variant="outline" className="border-red-500 text-red-500 bg-white/90 dark:bg-gray-900/90 dark:text-red-400 font-medium px-3 py-1">Deactivated</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1">Pending Review</Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1 text-xl">{business.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="rounded-full font-normal">
                              {business.category?.name || "Uncategorized"}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {!business.deactivated_by_user ? "Active" : "Inactive"}
                          </span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Switch
                                checked={!business.deactivated_by_user}
                                disabled={toggling === business.id}
                                className={`border-2 ${!business.deactivated_by_user 
                                  ? "data-[state=checked]:bg-green-500 border-green-300 dark:border-green-700" 
                                  : "data-[state=unchecked]:bg-red-200 dark:data-[state=unchecked]:bg-red-900/50 border-red-300 dark:border-red-800"
                                } [&>span]:bg-white dark:[&>span]:bg-gray-200`}
                              />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {business.deactivated_by_user 
                                    ? "Activate Business?" 
                                    : "Deactivate Business?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {business.deactivated_by_user 
                                    ? "This will submit a request to activate your business. An admin will review your request before the business is activated." 
                                    : "This will deactivate your business. Your business will no longer be visible to the public."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleToggleActive(business.id, business.deactivated_by_user)}
                                  className={business.deactivated_by_user ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                                >
                                  {toggling === business.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : null}
                                  {business.deactivated_by_user ? "Request Activation" : "Deactivate"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {toggling === business.id && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2 flex-grow space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.description}
                      </p>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {business.address}, {business.city}, {business.state} {business.zip}
                          </span>
                        </div>
                        
                        {business.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{business.phone}</span>
                          </div>
                        )}
                        
                        {business.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="line-clamp-1">{business.email}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Added {new Date(business.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-4 flex flex-col gap-3 border-t border-border/40 mt-auto">
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
                          <Link href={`/business-profiles/${business.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                          asChild
                        >
                          <Link href={`/owner/business-profiles/edit/${business.id}`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="w-10 h-9 rounded-full">
                              {deleting === business.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the business and all associated data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(business.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Recent Activities</h2>
              <p className="text-muted-foreground">Track interactions and updates for your business</p>
            </div>
          </div>
          
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
                  {dashboardData.activityFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
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