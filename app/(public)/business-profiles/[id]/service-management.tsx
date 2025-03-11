"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Edit, Plus, RefreshCw, AlertCircle, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  BusinessServiceCategory,
  BusinessService
} from "@/app/owner/business-profiles/actions";

// Define the structure of the services data
interface ServicesData {
  categories: (BusinessServiceCategory & { services: BusinessService[] })[];
  uncategorizedServices: BusinessService[];
}

// Service Category Form Component
const ServiceCategoryForm = ({ 
  businessId, 
  onSuccess,
  categoryToEdit = null
}: { 
  businessId: string, 
  onSuccess?: () => void,
  categoryToEdit?: BusinessServiceCategory | null
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!name) return;
    
    try {
      const response = await fetch('/api/services/categories', {
        method: categoryToEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryToEdit?.id,
          business_id: businessId,
          name,
          description: description || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save category');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="w-full p-2 border rounded-md" 
          placeholder="e.g., Consultations, Maintenance Services"
          defaultValue={categoryToEdit?.name || ""}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
        <textarea 
          id="description" 
          name="description" 
          className="w-full p-2 border rounded-md min-h-[100px]" 
          placeholder="Describe this category of services"
          defaultValue={categoryToEdit?.description || ""}
        />
      </div>
      
      <div className="flex justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button" className="mr-2">Cancel</Button>
        </DialogClose>
        <Button type="submit">{categoryToEdit ? 'Update' : 'Save'} Category</Button>
      </div>
    </form>
  );
};

// Service Form Component
const ServiceForm = ({ 
  businessId, 
  categories, 
  onSuccess,
  serviceToEdit = null
}: { 
  businessId: string, 
  categories: BusinessServiceCategory[],
  onSuccess?: () => void,
  serviceToEdit?: BusinessService | null
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category_id') as string;
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;
    const priceDescription = formData.get('price_description') as string;
    const isFeatured = (formData.get('is_featured') as string) === 'on';
    
    if (!name) return;
    
    try {
      const response = await fetch('/api/services', {
        method: serviceToEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: serviceToEdit?.id,
          business_id: businessId,
          category_id: categoryId || null,
          name,
          description: description || null,
          price,
          price_description: priceDescription || null,
          is_featured: isFeatured,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save service');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Service Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="w-full p-2 border rounded-md" 
          placeholder="e.g., Initial Consultation, Oil Change"
          defaultValue={serviceToEdit?.name || ""}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="category_id" className="text-sm font-medium">Category</label>
        <select 
          id="category_id" 
          name="category_id" 
          className="w-full p-2 border rounded-md"
          defaultValue={serviceToEdit?.category_id || ""}
        >
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
        <textarea 
          id="description" 
          name="description" 
          className="w-full p-2 border rounded-md min-h-[100px]" 
          placeholder="Describe what this service includes"
          defaultValue={serviceToEdit?.description || ""}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (Optional)</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            className="w-full p-2 border rounded-md" 
            placeholder="e.g., 99.99"
            defaultValue={serviceToEdit?.price || ""}
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="price_description" className="text-sm font-medium">Price Description (Optional)</label>
          <input 
            type="text" 
            id="price_description" 
            name="price_description" 
            className="w-full p-2 border rounded-md" 
            placeholder="e.g., per hour, starting from"
            defaultValue={serviceToEdit?.price_description || ""}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="is_featured" 
          name="is_featured" 
          className="rounded border-gray-300" 
          defaultChecked={serviceToEdit?.is_featured || false}
        />
        <label htmlFor="is_featured" className="text-sm font-medium">Feature this service</label>
      </div>
      
      <div className="flex justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button" className="mr-2">Cancel</Button>
        </DialogClose>
        <Button type="submit">{serviceToEdit ? 'Update' : 'Save'} Service</Button>
      </div>
    </form>
  );
};

export default function ServiceManagement({ 
  businessId,
  onServicesUpdated
}: { 
  businessId: string;
  onServicesUpdated?: () => void;
}) {
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BusinessServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<BusinessService | null>(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/services/business/${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServicesData(data);
      
      // Call the callback if provided
      if (onServicesUpdated) {
        onServicesUpdated();
      }
      
      // Dispatch a custom event for other components to listen to
      window.dispatchEvent(new Event('services-updated'));
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, toast, onServicesUpdated]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCategorySuccess = () => {
    fetchServices();
    toast({
      title: "Success",
      description: selectedCategory 
        ? "Category updated successfully" 
        : "Category added successfully",
    });
    setSelectedCategory(null);
    
    // Call the callback if provided
    if (onServicesUpdated) {
      onServicesUpdated();
    }
    
    // Dispatch a custom event for other components to listen to
    window.dispatchEvent(new Event('services-updated'));
  };

  const handleServiceSuccess = () => {
    fetchServices();
    toast({
      title: "Success",
      description: selectedService 
        ? "Service updated successfully" 
        : "Service added successfully",
    });
    setSelectedService(null);
    
    // Call the callback if provided
    if (onServicesUpdated) {
      onServicesUpdated();
    }
    
    // Dispatch a custom event for other components to listen to
    window.dispatchEvent(new Event('services-updated'));
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center mr-2"
        onClick={fetchServices}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Services
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            data-manage-services-button
          >
            <Edit className="mr-2 h-4 w-4" />
            Manage Services
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Business Services</DialogTitle>
            <DialogDescription>
              Add, edit, or remove services for your business profile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="categories">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">Service Categories</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Service Categories</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add Service Category</DialogTitle>
                          <DialogDescription>
                            Create a new category to organize your services.
                          </DialogDescription>
                        </DialogHeader>
                        <ServiceCategoryForm 
                          businessId={businessId} 
                          onSuccess={handleCategorySuccess}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardHeader className="py-3">
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : servicesData?.categories && servicesData.categories.length > 0 ? (
                    <div className="space-y-2">
                      {servicesData.categories.map((category: BusinessServiceCategory) => (
                        <Card key={category.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{category.name}</CardTitle>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Service Category</DialogTitle>
                                    <DialogDescription>
                                      Update this service category.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <ServiceCategoryForm 
                                    businessId={businessId} 
                                    categoryToEdit={selectedCategory}
                                    onSuccess={handleCategorySuccess}
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                            {category.description && (
                              <CardDescription>{category.description}</CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No categories found</AlertTitle>
                      <AlertDescription>
                        You haven&apos;t added any service categories yet. Create categories to organize your services.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="services">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Services</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Add New Service</DialogTitle>
                          <DialogDescription>
                            Create a new service to showcase what your business offers.
                          </DialogDescription>
                        </DialogHeader>
                        <ServiceForm 
                          businessId={businessId} 
                          categories={servicesData?.categories || []} 
                          onSuccess={handleServiceSuccess}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardHeader className="py-3">
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : servicesData?.categories && servicesData.categories.some(cat => cat.services.length > 0) || 
                   (servicesData?.uncategorizedServices && servicesData.uncategorizedServices.length > 0) ? (
                    <div className="space-y-4">
                      {servicesData.categories.map((category) => (
                        category.services.length > 0 && (
                          <div key={category.id} className="space-y-2">
                            <h4 className="font-medium">{category.name}</h4>
                            {category.services.map((service: BusinessService) => (
                              <Card key={service.id} className={service.is_featured ? "border-primary" : ""}>
                                <CardHeader className="py-3">
                                  <div className="flex justify-between items-center">
                                    <CardTitle className="text-base">{service.name}</CardTitle>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => setSelectedService(service)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[550px]">
                                        <DialogHeader>
                                          <DialogTitle>Edit Service</DialogTitle>
                                          <DialogDescription>
                                            Update this service.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <ServiceForm 
                                          businessId={businessId} 
                                          categories={servicesData?.categories || []} 
                                          serviceToEdit={selectedService}
                                          onSuccess={handleServiceSuccess}
                                        />
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                  {service.description && (
                                    <CardDescription>{service.description}</CardDescription>
                                  )}
                                </CardHeader>
                                <CardFooter className="py-2 flex justify-between items-center">
                                  <div className="text-sm">
                                    {service.price !== null ? (
                                      <span className="font-medium">${service.price.toFixed(2)}</span>
                                    ) : (
                                      <span className="text-muted-foreground">No price set</span>
                                    )}
                                    {service.price_description && (
                                      <span className="text-muted-foreground ml-1">{service.price_description}</span>
                                    )}
                                  </div>
                                  {service.is_featured && (
                                    <Badge className="flex items-center gap-1">
                                      <Star className="h-3 w-3" /> Featured
                                    </Badge>
                                  )}
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        )
                      ))}
                      
                      {servicesData.uncategorizedServices && servicesData.uncategorizedServices.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Uncategorized</h4>
                          {servicesData.uncategorizedServices.map((service: BusinessService) => (
                            <Card key={service.id} className={service.is_featured ? "border-primary" : ""}>
                              <CardHeader className="py-3">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base">{service.name}</CardTitle>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedService(service)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[550px]">
                                      <DialogHeader>
                                        <DialogTitle>Edit Service</DialogTitle>
                                        <DialogDescription>
                                          Update this service.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <ServiceForm 
                                        businessId={businessId} 
                                        categories={servicesData?.categories || []} 
                                        serviceToEdit={selectedService}
                                        onSuccess={handleServiceSuccess}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                {service.description && (
                                  <CardDescription>{service.description}</CardDescription>
                                )}
                              </CardHeader>
                              <CardFooter className="py-2 flex justify-between items-center">
                                <div className="text-sm">
                                  {service.price !== null ? (
                                    <span className="font-medium">${service.price.toFixed(2)}</span>
                                  ) : (
                                    <span className="text-muted-foreground">No price set</span>
                                  )}
                                  {service.price_description && (
                                    <span className="text-muted-foreground ml-1">{service.price_description}</span>
                                  )}
                                </div>
                                {service.is_featured && (
                                  <Badge className="flex items-center gap-1">
                                    <Star className="h-3 w-3" /> Featured
                                  </Badge>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No services found</AlertTitle>
                      <AlertDescription>
                        You haven&apos;t added any services yet. Add services to showcase what your business offers.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 