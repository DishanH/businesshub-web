"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { BusinessSpecial } from "./specials-actions";
import SpecialManagement from "./special-management";
import AddFirstSpecialButton from "./add-first-special-button";

// Special Skeleton Component
const SpecialSkeleton = () => {
  return (
    <Card className="h-full border-0 shadow-md overflow-hidden">
      <div className="h-40 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
};

export default function SpecialsSection({ 
  businessId, 
  isOwner, 
  businessName,
  initialSpecialsData 
}: { 
  businessId: string;
  isOwner: boolean;
  businessName: string;
  initialSpecialsData: BusinessSpecial[] | null;
}) {
  const [specialsData, setSpecialsData] = useState<BusinessSpecial[] | null>(initialSpecialsData);
  const [loading, setLoading] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("Featured Specials");
  const [isVisible, setIsVisible] = useState(true);
  const [sectionPreferencesLoaded, setSectionPreferencesLoaded] = useState(false);

  const fetchSpecials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/business/${businessId}/specials`);
      if (!response.ok) {
        throw new Error('Failed to fetch specials');
      }
      const data = await response.json();
      setSpecialsData(data);
    } catch (error) {
      console.error('Error fetching specials:', error);
      setSpecialsData([]);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const fetchSectionPreferences = useCallback(async () => {
    try {
      const response = await fetch(`/api/business/${businessId}/section-preferences/specials`);
      if (!response.ok) {
        throw new Error('Failed to fetch section preferences');
      }
      const data = await response.json();
      if (data) {
        setSectionTitle(data.title || 'Our Specials');
        setIsVisible(data.isVisible);
      } else {
        setSectionTitle('Our Specials');
        setIsVisible(true);
      }
      setSectionPreferencesLoaded(true);
    } catch (error) {
      console.error('Error fetching section preferences:', error);
      setSectionTitle('Our Specials');
      setIsVisible(true);
      setSectionPreferencesLoaded(true);
    }
  }, [businessId]);

  // Listen for a custom event that SpecialManagement might dispatch
  useEffect(() => {
    const handleSpecialUpdate = () => {
      fetchSpecials();
    };

    window.addEventListener('specials-updated', handleSpecialUpdate);
    
    return () => {
      window.removeEventListener('specials-updated', handleSpecialUpdate);
    };
  }, [fetchSpecials]);

  // Fetch section preferences on mount
  useEffect(() => {
    fetchSpecials();
    fetchSectionPreferences();
  }, [fetchSpecials, fetchSectionPreferences]);

  // Mock specials for demonstration
  const mockSpecials = [
    {
      id: "1",
      name: "Summer Special",
      description: "Limited time offer: 20% off all services",
      image_url: "/placeholder.svg",
      start_date: null,
      end_date: null,
      is_active: true,
      display_order: 1,
      business_id: businessId
    },
    {
      id: "2",
      name: "New Customer Discount",
      description: "First-time customers receive a complimentary consultation",
      image_url: "/placeholder.svg",
      start_date: null,
      end_date: null,
      is_active: true,
      display_order: 2,
      business_id: businessId
    },
    {
      id: "3",
      name: "Loyalty Program",
      description: "Join our loyalty program and earn points with every visit",
      image_url: "/placeholder.svg",
      start_date: null,
      end_date: null,
      is_active: true,
      display_order: 3,
      business_id: businessId
    },
  ];

  // Use mock data if no real data is available
  const displaySpecials = specialsData && specialsData.length > 0 ? specialsData : mockSpecials;

  // If section is not visible and user is not the owner, don't render anything
  if (!isVisible && !isOwner) {
    return null;
  }

  // If section preferences are still loading, show a skeleton
  if (!sectionPreferencesLoaded) {
    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {[1, 2].map((index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <SpecialSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          {sectionTitle}
        </h2>
        {isOwner && (
          <div className="flex space-x-2">
            <SpecialManagement 
              businessId={businessId} 
              onSpecialsUpdated={fetchSpecials}
            />
            {!isVisible && (
              <Badge variant="outline" className="ml-2">Hidden</Badge>
            )}
          </div>
        )}
      </div>
      
      {loading ? (
        <Carousel className="w-full">
          <CarouselContent>
            {[1, 2].map((index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <SpecialSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : displaySpecials.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {displaySpecials.map((special) => (
              <CarouselItem key={special.id} className="md:basis-1/2 lg:basis-1/2">
                <Card className="h-full border-0 shadow-md overflow-hidden">
                  <div className="h-40 relative overflow-hidden">
                    <Image
                      src={special.image_url || "/placeholder.svg"}
                      alt={special.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{special.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{special.description}</p>
                    {(special.start_date || special.end_date) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {special.start_date && `From ${new Date(special.start_date).toLocaleDateString()}`}
                        {special.start_date && special.end_date && " to "}
                        {special.end_date && `${new Date(special.end_date).toLocaleDateString()}`}
                      </p>
                    )}
                    <div className="mt-4 flex justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{special.name}</DialogTitle>
                            <DialogDescription>
                              Special offer details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            {special.image_url && (
                              <div className="w-full h-48 rounded overflow-hidden mb-4">
                                <Image
                                  src={special.image_url}
                                  alt={special.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h3 className="font-medium mb-2">Description</h3>
                            <p className="text-muted-foreground mb-4">{special.description}</p>
                            
                            {(special.start_date || special.end_date) && (
                              <>
                                <h3 className="font-medium mb-2">Availability</h3>
                                <p className="text-muted-foreground">
                                  {special.start_date && `From ${new Date(special.start_date).toLocaleDateString()}`}
                                  {special.start_date && special.end_date && " to "}
                                  {special.end_date && `${new Date(special.end_date).toLocaleDateString()}`}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative mr-2 translate-y-0" />
            <CarouselNext className="relative ml-2 translate-y-0" />
          </div>
        </Carousel>
      ) : (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-6 flex justify-center">
            {isOwner ? (
              <AddFirstSpecialButton />
            ) : (
              <p className="text-muted-foreground py-10 text-center">No specials available at this time.</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {displaySpecials.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">View All Specials</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                All Specials
              </DialogTitle>
              <DialogDescription>
                Complete list of specials offered by {businessName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {displaySpecials.map((special) => (
                <Card key={special.id} className="overflow-hidden">
                  {special.image_url && (
                    <div className="h-40 relative overflow-hidden">
                      <Image
                        src={special.image_url}
                        alt={special.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle>{special.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{special.description}</p>
                    {(special.start_date || special.end_date) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {special.start_date && `From ${new Date(special.start_date).toLocaleDateString()}`}
                        {special.start_date && special.end_date && " to "}
                        {special.end_date && `${new Date(special.end_date).toLocaleDateString()}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
} 