"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Pencil, Trash2, Eye, Search } from "lucide-react";
import { getUserBusinesses, deleteBusiness, updateBusinessStatus } from "@/app/businesses/actions/core";
import type { Business } from "@/app/businesses/actions/types";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const result = await getUserBusinesses();
        if (result.success) {
          setBusinesses(result.data || []);
          setFilteredBusinesses(result.data || []);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to load businesses",
          });
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load businesses",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, []);

  // Filter businesses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBusinesses(businesses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = businesses.filter(
        business => 
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.address.toLowerCase().includes(query) ||
          business.city.toLowerCase().includes(query) ||
          business.state.toLowerCase().includes(query) ||
          business.category?.name.toLowerCase().includes(query)
      );
      setFilteredBusinesses(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, businesses]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleToggleActive = async (businessId: string, currentStatus: boolean) => {
    try {
      setToggling(businessId);
      const result = await updateBusinessStatus(businessId, !currentStatus);
      
      if (result.success) {
        setBusinesses(businesses.map(business => 
          business.id === businessId 
            ? { ...business, is_active: !currentStatus, deactivated_by_user: currentStatus } 
            : business
        ));
        
        setFilteredBusinesses(filteredBusinesses.map(business => 
          business.id === businessId 
            ? { ...business, is_active: !currentStatus, deactivated_by_user: currentStatus } 
            : business
        ));
        
        toast({
          title: "Success",
          description: currentStatus 
            ? "Business has been deactivated" 
            : "Business has been activated",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update business status",
        });
      }
    } catch (error) {
      console.error("Error updating business status:", error);
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
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Businesses</h1>
        <Button onClick={() => router.push("/businesses/add")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Business
        </Button>
      </div>

      {/* Search and filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search businesses by name, description, location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">
            {searchQuery ? "No businesses match your search" : "You haven't added any businesses yet"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try a different search term" : "Get started by adding your first business listing"}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push("/businesses/add")}>
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
              <Card key={business.id} className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted relative">
                  {business.images && business.images.length > 0 ? (
                    <Image 
                      src={business.images.find(img => img.is_primary)?.url || business.images[0].url} 
                      alt={business.images.find(img => img.is_primary)?.alt_text || business.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {business.is_active ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                    ) : business.deactivated_by_user ? (
                      <Badge variant="outline" className="border-red-500 text-red-500">Deactivated</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">Pending Review</Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{business.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    {business.category?.name || "Uncategorized"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {business.description}
                  </p>
                  <p className="text-sm">
                    {business.address}, {business.city}, {business.state} {business.zip}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-2 flex flex-col gap-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={business.is_active}
                        disabled={toggling === business.id}
                        onCheckedChange={() => handleToggleActive(business.id, business.is_active)}
                      />
                      <span className="text-sm font-medium">
                        {toggling === business.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : business.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          {deleting === business.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the business and all associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(business.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/businesses/${business.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <Link href={`/businesses/edit/${business.id}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
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
    </div>
  );
} 