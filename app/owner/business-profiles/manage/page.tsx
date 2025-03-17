"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Pencil, Trash2, Eye, Search, Building, MapPin, Phone, BarChart, Users, MessageSquare, Star, Activity } from "lucide-react";
import { getUserBusinesses, deleteBusiness, updateBusinessStatus } from "@/app/owner/business-profiles/manage/actions";
import type { Business } from "@/app/owner/business-profiles/types";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your businesses and services</p>
        </div>
        <Button 
          onClick={() => router.push("/owner/business-profiles/create")} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Business
        </Button>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Sidebar with Stats and Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats Overview */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-semibold">Performance Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days statistics</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-border/40">
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 mb-2">
                  <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{dashboardData.totalViews}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <span className="i-lucide-trending-up mr-1"></span>+12%
                </p>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 mb-2">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Customer Leads</p>
                <p className="text-2xl font-bold">{dashboardData.totalLeads}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <span className="i-lucide-trending-up mr-1"></span>+5%
                </p>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 mb-2">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                <p className="text-2xl font-bold">{dashboardData.totalReviews}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <span className="i-lucide-trending-up mr-1"></span>+3 new
                </p>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/30 mb-2">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400 fill-current" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">{dashboardData.averageRating}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <span className="i-lucide-trending-up mr-1"></span>+0.2
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <p className="text-sm text-muted-foreground mt-1">Latest updates and interactions</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </div>
            <div className="divide-y divide-border/40">
              {dashboardData.activityFeed.slice(0, 3).map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex gap-3">
                    <Activity className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border/40">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </div>
          </div>

          {/* Recent Messages Preview */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Recent Messages</h2>
                <p className="text-sm text-muted-foreground mt-1">Latest inquiries from customers</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </div>
            <div className="divide-y divide-border/40">
              {dashboardData.recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{message.from}</p>
                      <p className="text-sm text-muted-foreground">{message.subject}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">My Businesses</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage and update your business listings</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-8 h-9 bg-background"
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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="h-9 bg-muted/50">
                    <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
                    <TabsTrigger value="active" className="text-xs px-3">Active</TabsTrigger>
                    <TabsTrigger value="inactive" className="text-xs px-3">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16">
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
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedBusinesses.map((business) => (
                      <Card 
                        key={business.id} 
                        className="overflow-hidden flex flex-col h-full border-border/40 rounded-xl hover:shadow-md transition-all duration-300"
                      >
                        <div className="h-40 bg-muted relative group">
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
                        
                        <CardContent className="pb-2 flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {business.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {business.city}, {business.state}
                              </span>
                            </div>
                            
                            {business.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="line-clamp-1">{business.phone}</span>
                              </div>
                            )}
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
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-border/40">
                    <Pagination>
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 