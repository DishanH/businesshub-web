"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceManagement from "./service-management";
import AddFirstServiceButton from "./add-first-service-button";

// Define types for the services data
interface BusinessService {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_description: string | null;
  is_featured: boolean;
  category_id: string | null;
}

interface BusinessServiceCategory {
  id: string;
  name: string;
  description: string | null;
  services: BusinessService[];
}

interface ServicesData {
  categories: BusinessServiceCategory[];
  uncategorizedServices: BusinessService[];
  featuredServices: BusinessService[];
}

// Service Skeleton Component
const ServiceSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export default function ServicesSection({ 
  businessId, 
  isOwner, 
  businessName,
  initialServicesData 
}: { 
  businessId: string;
  isOwner: boolean;
  businessName: string;
  initialServicesData: ServicesData | null;
}) {
  const [servicesData, setServicesData] = useState<ServicesData | null>(initialServicesData);
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/services/business/${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServicesData(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  // Listen for a custom event that ServiceManagement might dispatch
  useEffect(() => {
    const handleServiceUpdate = () => {
      fetchServices();
    };

    window.addEventListener('services-updated', handleServiceUpdate);
    
    return () => {
      window.removeEventListener('services-updated', handleServiceUpdate);
    };
  }, [fetchServices]);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Briefcase className="mr-2 h-5 w-5" />
          Our Services
        </h2>
        {isOwner && (
          <div className="flex space-x-2">
            <ServiceManagement businessId={businessId} onServicesUpdated={fetchServices} />
          </div>
        )}
      </div>
      
      {loading ? (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ServiceSkeleton />
              <ServiceSkeleton />
            </div>
          </CardContent>
        </Card>
      ) : servicesData && servicesData.featuredServices && servicesData.featuredServices.length > 0 ? (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesData.featuredServices.slice(0, 4).map((service) => (
                <div 
                  key={service.id} 
                  className={`flex flex-col p-4 border rounded-lg hover:shadow-md transition-shadow ${service.is_featured ? "border-primary" : ""}`}
                >
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                    {service.is_featured && (
                      <Badge className="flex items-center gap-1 h-6">
                        <span className="text-xs">Featured</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground flex-grow mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-primary">
                      {service.price !== null 
                        ? `$${service.price.toFixed(2)}${service.price_description ? ` ${service.price_description}` : ''}`
                        : (service.price_description || 'Price upon request')
                      }
                    </span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View All Services</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Briefcase className="mr-2 h-5 w-5" />
                      All Services
                    </DialogTitle>
                    <DialogDescription>
                      Complete list of services offered by {businessName}
                    </DialogDescription>
                  </DialogHeader>
                  {servicesData && servicesData.categories && servicesData.categories.length > 0 ? (
                    <div className="py-4">
                      <Tabs defaultValue={servicesData.categories[0].id}>
                        <TabsList className="mb-4">
                          {servicesData.categories.map((category) => (
                            <TabsTrigger key={category.id} value={category.id}>
                              {category.name}
                            </TabsTrigger>
                          ))}
                          {servicesData.uncategorizedServices && servicesData.uncategorizedServices.length > 0 && (
                            <TabsTrigger value="uncategorized">Other Services</TabsTrigger>
                          )}
                        </TabsList>
                        
                        {servicesData.categories.map((category) => (
                          <TabsContent key={category.id} value={category.id} className="space-y-4">
                            {category.description && (
                              <p className="text-muted-foreground mb-4">{category.description}</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {category.services.map((service) => (
                                <div key={service.id} className={`flex flex-col p-4 border rounded-lg ${service.is_featured ? "border-primary" : ""}`}>
                                  <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                                    {service.is_featured && (
                                      <Badge className="ml-2">Featured</Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground flex-grow mb-4">{service.description}</p>
                                  <div className="flex justify-between items-center mt-auto">
                                    <span className="text-lg font-medium">
                                      {service.price !== null 
                                        ? `$${service.price.toFixed(2)}${service.price_description ? ` ${service.price_description}` : ''}`
                                        : (service.price_description || 'Price upon request')
                                      }
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                        
                        {servicesData.uncategorizedServices && servicesData.uncategorizedServices.length > 0 && (
                          <TabsContent value="uncategorized" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {servicesData.uncategorizedServices.map((service) => (
                                <div key={service.id} className={`flex flex-col p-4 border rounded-lg ${service.is_featured ? "border-primary" : ""}`}>
                                  <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                                    {service.is_featured && (
                                      <Badge className="ml-2">Featured</Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground flex-grow mb-4">{service.description}</p>
                                  <div className="flex justify-between items-center mt-auto">
                                    <span className="text-lg font-medium">
                                      {service.price !== null 
                                        ? `$${service.price.toFixed(2)}${service.price_description ? ` ${service.price_description}` : ''}`
                                        : (service.price_description || 'Price upon request')
                                      }
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">No services available.</p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button variant="outline">Close</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0 shadow-md">
          {isOwner ? (
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Service Preview</h3>
                <p className="text-muted-foreground mb-6">
                  This is how your services will appear to customers. Add services to make this section live.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ServiceSkeleton />
                <ServiceSkeleton />
                <ServiceSkeleton />
                <ServiceSkeleton />
              </div>
              
              <div className="flex justify-center">
                <AddFirstServiceButton />
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Services Available</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                This business hasn&apos;t added any services to their profile yet.
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </section>
  );
} 