"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, Briefcase, Wrench, Car, Dumbbell, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessMenuData } from "@/app/owner/business-profiles/menu-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuManagement from "./menu-management";

// Menu Item Skeleton Component
const MenuItemSkeleton = () => {
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/5" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

// Menu Category Skeleton Component
const MenuCategorySkeleton = () => {
  return (
    <div className="space-y-4 mb-6">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-4">
        <MenuItemSkeleton />
        <MenuItemSkeleton />
        <MenuItemSkeleton />
      </div>
    </div>
  );
};

// Icon mapping for different menu types
const iconMap: Record<string, React.ReactNode> = {
  "Utensils": <Utensils className="h-5 w-5" />,
  "Briefcase": <Briefcase className="h-5 w-5" />,
  "Wrench": <Wrench className="h-5 w-5" />,
  "Car": <Car className="h-5 w-5" />,
  "Dumbbell": <Dumbbell className="h-5 w-5" />
};

export default function MenuSection({ 
  businessId, 
  isOwner, 
  initialMenuData 
}: { 
  businessId: string;
  isOwner: boolean;
  initialMenuData: BusinessMenuData | null;
}) {
  const [menuData, setMenuData] = useState<BusinessMenuData | null>(initialMenuData);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/business/${businessId}/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu data');
      }
      const data = await response.json();
      setMenuData(data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setMenuData(null);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!initialMenuData) {
      fetchMenuData();
    }
    
    // If we have initial data, check if the section is visible
    if (initialMenuData?.section) {
      setIsVisible(initialMenuData.section.is_visible);
    }
  }, [initialMenuData, fetchMenuData]);

  // If section is not visible and user is not the owner, don't render anything
  if (!isVisible && !isOwner) {
    return null;
  }

  // Get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || <Utensils className="h-5 w-5" />;
  };

  // Handle menu data update
  const handleMenuUpdated = () => {
    fetchMenuData();
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          {menuData?.section ? (
            <>
              {getIconComponent(menuData.section.icon)}
              <span className="ml-2">{menuData.section.title}</span>
            </>
          ) : (
            <>
              <Utensils className="mr-2 h-5 w-5" />
              Menu
            </>
          )}
        </h2>
        {isOwner && (
          <div className="flex space-x-2">
            {!isVisible && (
              <Badge variant="outline" className="ml-2">Hidden</Badge>
            )}
            <MenuManagement 
              businessId={businessId}
              menuData={menuData}
              onMenuUpdated={handleMenuUpdated}
            >
              <Button variant="outline" size="sm">
                Manage Menu
              </Button>
            </MenuManagement>
          </div>
        )}
      </div>
      
      {loading ? (
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <MenuCategorySkeleton />
                <MenuCategorySkeleton />
              </div>
              <div className="space-y-6">
                <MenuCategorySkeleton />
                <MenuCategorySkeleton />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : menuData && menuData.categories && menuData.categories.length > 0 ? (
        <Card className="shadow-md overflow-hidden">
          <Tabs defaultValue={menuData.categories[0]?.name.toLowerCase()}>
            <TabsList className="h-12 w-full justify-start overflow-hidden p-0 bg-muted/50 rounded-t-lg rounded-b-none border-b">
              {menuData.categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.name.toLowerCase()}
                  className="py-4 px-6 h-12 data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {menuData.categories.map((category) => (
              <TabsContent key={category.id} value={category.name.toLowerCase()} className="p-4">
                <div className="space-y-4">
                  {category.items?.map((item) => (
                    <Card key={item.id} className="overflow-hidden border border-muted hover:border-muted-foreground/20 transition-all">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-primary">{item.price}</span>
                          {item.is_featured && (
                            <Badge variant="secondary" className="mt-1">Featured</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0 shadow-md">
          {isOwner ? (
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Menu Preview</h3>
                <p className="text-muted-foreground mb-6">
                  This is how your menu will appear to customers. Add menu items to make this section live.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <MenuCategorySkeleton />
                  <MenuCategorySkeleton />
                </div>
                <div className="space-y-6">
                  <MenuCategorySkeleton />
                  <MenuCategorySkeleton />
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <MenuManagement 
                  businessId={businessId}
                  menuData={menuData}
                  onMenuUpdated={handleMenuUpdated}
                >
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Menu Item
                  </Button>
                </MenuManagement>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Menu Available</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                This business hasn&apos;t added any menu items to their profile yet.
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </section>
  );
} 