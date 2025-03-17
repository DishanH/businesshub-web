"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  BarChart,
  Users,
  MessageSquare,
  Star,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
  Download,
  LineChart,
  PieChart,
  BarChart2,
  Building,
  InfoIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BusinessAnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [showBanner, setShowBanner] = useState(true);

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "traffic", "leads", "activity"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    const businessParam = searchParams.get("business");
    if (businessParam) {
      setSelectedBusiness(businessParam);
    }
    
    const timeParam = searchParams.get("time");
    if (timeParam && ["7days", "30days", "90days", "year"].includes(timeParam)) {
      setTimeRange(timeParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/owner/business-profiles/analytics?tab=${value}${selectedBusiness !== 'all' ? `&business=${selectedBusiness}` : ''}${timeRange !== '30days' ? `&time=${timeRange}` : ''}`);
  };

  // Handle business selection change
  const handleBusinessChange = (value: string) => {
    setSelectedBusiness(value);
    router.push(`/owner/business-profiles/analytics?tab=${activeTab}${value !== 'all' ? `&business=${value}` : ''}${timeRange !== '30days' ? `&time=${timeRange}` : ''}`);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    router.push(`/owner/business-profiles/analytics?tab=${activeTab}${selectedBusiness !== 'all' ? `&business=${selectedBusiness}` : ''}${value !== '30days' ? `&time=${value}` : ''}`);
  };

  // Handle analytics data export
  const handleExportData = () => {
    // In a real application, this would generate and download a CSV/Excel file
    // For now, we'll just show a toast message
    toast({
      title: "Analytics Export",
      description: `Exporting ${selectedBusiness === 'all' ? 'all businesses' : analyticsData.businesses.find(b => b.id === selectedBusiness)?.name} data for the ${
        timeRange === '7days' ? 'last 7 days' : 
        timeRange === '30days' ? 'last 30 days' : 
        timeRange === '90days' ? 'last 90 days' : 'last year'
      }`,
    });
  };

  // Mock data for analytics
  const analyticsData = {
    summary: {
      totalViews: {
        value: 1248,
        change: 12,
        trend: "up"
      },
      totalLeads: {
        value: 42,
        change: 5,
        trend: "up"
      },
      totalReviews: {
        value: 18,
        change: 3,
        trend: "up"
      },
      averageRating: {
        value: 4.7,
        change: 0.2,
        trend: "up"
      },
      conversionRate: {
        value: 3.4,
        change: 0.5,
        trend: "up"
      },
      engagementRate: {
        value: 8.2,
        change: -1.3,
        trend: "down"
      }
    },
    trafficSources: [
      { source: "Direct Search", percentage: 35, count: 437 },
      { source: "Google", percentage: 28, count: 349 },
      { source: "Social Media", percentage: 18, count: 225 },
      { source: "Referrals", percentage: 12, count: 150 },
      { source: "Other", percentage: 7, count: 87 }
    ],
    viewsByDay: [
      { day: "Mon", views: 145 },
      { day: "Tue", views: 132 },
      { day: "Wed", views: 164 },
      { day: "Thu", views: 187 },
      { day: "Fri", views: 219 },
      { day: "Sat", views: 253 },
      { day: "Sun", views: 148 }
    ],
    leadsByBusiness: [
      { name: "Coffee Shop", leads: 18, conversion: 4.2 },
      { name: "Fitness Studio", leads: 14, conversion: 3.8 },
      { name: "Dental Clinic", leads: 10, conversion: 2.9 }
    ],
    recentActivity: [
      { id: 1, type: "review", title: "New review received", description: "A customer left a 5-star review on your business", time: "Today, 10:23 AM", business: "Coffee Shop" },
      { id: 2, type: "view", title: "Profile view spike", description: "Your business profile received 24 views in the last hour", time: "Yesterday, 3:45 PM", business: "Fitness Studio" },
      { id: 3, type: "lead", title: "New lead generated", description: "Someone requested more information about your services", time: "Yesterday, 11:30 AM", business: "Dental Clinic" },
      { id: 4, type: "update", title: "Business information updated", description: "Your business hours were updated successfully", time: "Mar 5, 2024, 2:15 PM", business: "Coffee Shop" },
      { id: 5, type: "review", title: "Review response", description: "You responded to a customer review", time: "Mar 4, 2024, 9:20 AM", business: "Fitness Studio" },
      { id: 6, type: "lead", title: "Lead converted", description: "A lead was converted to a customer", time: "Mar 3, 2024, 4:45 PM", business: "Dental Clinic" }
    ],
    businesses: [
      { id: "1", name: "Coffee Shop" },
      { id: "2", name: "Fitness Studio" },
      { id: "3", name: "Dental Clinic" }
    ]
  };

  // Helper function to render trend indicators
  const renderTrend = (trend: string, change: number) => {
    return trend === "up" ? (
      <span className="text-green-600 dark:text-green-500 flex items-center">
        <ArrowUpRight className="h-4 w-4 mr-1" />
        +{change}%
      </span>
    ) : (
      <span className="text-red-600 dark:text-red-500 flex items-center">
        <ArrowDownRight className="h-4 w-4 mr-1" />
        {change}%
      </span>
    );
  };

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto">
      {/* Coming Soon Banner */}
      {showBanner && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/50 shadow-sm mb-6">
          <div className="relative p-6">
            <button 
              onClick={() => setShowBanner(false)} 
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss banner"
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-xl">×</span>
            </button>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Analytics Dashboard Preview</h3>
                <p className="text-muted-foreground">
                  This analytics dashboard is currently in preview mode with sample data. Live data integration and additional features will be available soon. We appreciate your patience as we work to enhance your business insights experience.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button 
                    size="sm" 
                    onClick={() => window.open('https://forms.example.com/analytics-feedback', '_blank')}
                  >
                    Provide Feedback
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowBanner(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/owner/business-profiles/manage">Business Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics & Performance</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance</h1>
          <p className="text-muted-foreground mt-1">Track and analyze your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border mr-2 cursor-help">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-primary mr-1.5 animate-pulse"></span>
                    Demo Data
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">This dashboard currently displays sample data for demonstration purposes. Live data will be available soon.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select value={selectedBusiness} onValueChange={handleBusinessChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {analyticsData.businesses.map(business => (
                <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.totalViews.value}</div>
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.totalViews.trend, analyticsData.summary.totalViews.change)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.totalLeads.value}</div>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.totalLeads.trend, analyticsData.summary.totalLeads.change)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.totalReviews.value}</div>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.totalReviews.trend, analyticsData.summary.totalReviews.change)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.averageRating.value}</div>
              <Star className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.averageRating.trend, analyticsData.summary.averageRating.change)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.conversionRate.value}%</div>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.conversionRate.trend, analyticsData.summary.conversionRate.change)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{analyticsData.summary.engagementRate.value}%</div>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>vs. previous period</span>
              {renderTrend(analyticsData.summary.engagementRate.trend, analyticsData.summary.engagementRate.change)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="leads">Leads & Conversions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Profile Views Chart */}
          <Card className="bg-background">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Views Over Time</CardTitle>
                  <CardDescription>Daily profile views for the selected period</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full bg-muted rounded-md">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing daily profile views data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your profile views are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trafficSources.map((source, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm text-muted-foreground">{source.count} views</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Business Performance */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Leads by business profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.leadsByBusiness.map((business, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{business.name}</h4>
                          <span className="text-sm font-medium">{business.leads} leads</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="w-full max-w-[180px] bg-muted rounded-full h-2 mr-3">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${(business.leads / analyticsData.summary.totalLeads.value) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{business.conversion}% conversion</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/owner/business-profiles/manage")}>
                  View All Businesses
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-background">
              <CardHeader>
                <CardTitle>Traffic Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your profile traffic</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Traffic analysis visualization would appear here</p>
                    <p className="text-xs text-muted-foreground mt-1">Showing detailed traffic metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Traffic by Device</CardTitle>
                <CardDescription>How users are accessing your profiles</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Device breakdown chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Traffic by Time</CardTitle>
                <CardDescription>When users are viewing your profiles</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex items-center justify-center h-full bg-muted rounded-md">
                  <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Time distribution chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-6">
          <Card className="md:col-span-2 bg-background">
            <CardHeader>
              <CardTitle>Leads & Conversions</CardTitle>
              <CardDescription>Track your business leads and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {analyticsData.leadsByBusiness.map((business, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{business.name}</h3>
                      <Badge variant="outline">{business.conversion}% conversion rate</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-background">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{business.leads}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Converted</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{Math.round(business.leads * (business.conversion / 100))}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{business.leads - Math.round(business.leads * (business.conversion / 100))}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/owner/business-profiles/manage")}>
                Manage Business Profiles
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-background">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent activity across all your business profiles</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-6 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <Badge variant="outline">{activity.business}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 