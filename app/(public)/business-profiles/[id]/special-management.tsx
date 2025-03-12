"use client";

import { useState, useEffect } from "react";
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Edit, Plus, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BusinessSpecial } from "./specials-actions";
import { Switch } from "@/components/ui/switch";

// Special Form Component
const SpecialForm = ({ 
  businessId, 
  onSuccess,
  specialToEdit = null
}: { 
  businessId: string, 
  onSuccess?: () => void,
  specialToEdit?: BusinessSpecial | null
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    specialToEdit?.start_date ? new Date(specialToEdit.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    specialToEdit?.end_date ? new Date(specialToEdit.end_date) : undefined
  );
  const [imageUrl, setImageUrl] = useState(specialToEdit?.image_url || '');
  const [previewUrl, setPreviewUrl] = useState(specialToEdit?.image_url || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('is_active') === 'on';
    const displayOrder = parseInt(formData.get('display_order') as string) || 0;
    
    if (!name) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    try {
      const endpoint = '/api/specials';
      const method = specialToEdit ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: specialToEdit?.id,
          business_id: businessId,
          name,
          description,
          image_url: imageUrl,
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null,
          is_active: isActive,
          display_order: displayOrder
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save special');
      }
      
      toast({
        title: `Special ${specialToEdit ? 'Updated' : 'Created'}`,
        description: `The special has been successfully ${specialToEdit ? 'updated' : 'created'}.`,
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving special:', error);
      toast({
        title: "Error",
        description: `Failed to ${specialToEdit ? 'update' : 'create'} special. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={specialToEdit?.name || ''} 
              placeholder="e.g., Summer Special"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={specialToEdit?.description || ''} 
              placeholder="Describe the special offer"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <div className="flex gap-2">
              <Input 
                id="image_url" 
                name="image_url" 
                value={imageUrl}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {previewUrl && (
                <div className="w-12 h-12 border rounded overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={() => setPreviewUrl('/placeholder.svg')}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date: Date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                name="display_order" 
                type="number"
                defaultValue={specialToEdit?.display_order || 0} 
                min={0}
              />
            </div>
            
            <div className="flex items-center space-x-2 h-full pt-8">
              <Checkbox 
                id="is_active" 
                name="is_active"
                defaultChecked={specialToEdit ? specialToEdit.is_active : true}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          {specialToEdit ? 'Update' : 'Create'} Special
        </Button>
      </div>
    </form>
  );
};

// Special List Component
const SpecialsList = ({ 
  businessId,
  onRefresh,
  onEdit
}: { 
  businessId: string,
  onRefresh: () => void,
  onEdit: (special: BusinessSpecial) => void
}) => {
  const { toast } = useToast();
  const [specials, setSpecials] = useState<BusinessSpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/specials/business/${businessId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch specials');
      }
      
      const data = await response.json();
      setSpecials(data || []);
    } catch (error) {
      console.error('Error fetching specials:', error);
      setError('Failed to load specials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, [businessId]);

  const handleDelete = async (specialId: string) => {
    if (!confirm('Are you sure you want to delete this special?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/specials/${specialId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete special');
      }
      
      toast({
        title: "Special Deleted",
        description: "The special has been successfully deleted.",
      });
      
      fetchSpecials();
      onRefresh();
    } catch (error) {
      console.error('Error deleting special:', error);
      toast({
        title: "Error",
        description: "Failed to delete special. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (specials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No specials found. Create your first special to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {specials.map((special) => (
        <Card key={special.id} className={`overflow-hidden ${!special.is_active ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{special.name}</CardTitle>
                {special.description && (
                  <CardDescription className="mt-1">{special.description}</CardDescription>
                )}
              </div>
              <div className="flex space-x-1">
                {!special.is_active && (
                  <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                )}
                {special.start_date && special.end_date && (
                  <Badge variant="secondary">
                    {new Date(special.start_date).toLocaleDateString()} - {new Date(special.end_date).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {special.image_url && (
              <div className="w-full h-32 rounded overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={special.image_url} 
                  alt={special.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDelete(special.id)}
            >
              Delete
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onEdit(special)}
            >
              Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

// Section Preferences Component
const SectionPreferencesForm = ({ 
  businessId,
  onSuccess
}: { 
  businessId: string,
  onSuccess?: () => void
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Featured Specials");
  const [isVisible, setIsVisible] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch current preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`/api/business/${businessId}/section-preferences/specials`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTitle(data.title || "Featured Specials");
            setIsVisible(data.is_visible !== undefined ? data.is_visible : true);
          }
        }
      } catch (error) {
        console.error("Error fetching section preferences:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPreferences();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/section-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_id: businessId,
          section_type: 'specials',
          title,
          is_visible: isVisible
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update section preferences');
      }
      
      toast({
        title: "Preferences Updated",
        description: "Section preferences have been successfully updated.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating section preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update section preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="section-title">Section Title</Label>
          <Input 
            id="section-title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Featured Specials"
          />
          <p className="text-sm text-muted-foreground">
            This title will be displayed at the top of the specials section.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="visibility">Section Visibility</Label>
            <Switch 
              id="visibility" 
              checked={isVisible}
              onCheckedChange={setIsVisible}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {isVisible 
              ? "The specials section is visible to all visitors." 
              : "The specials section is hidden from visitors but remains visible to you."}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </form>
  );
};

export default function SpecialManagement({ 
  businessId,
  onSpecialsUpdated
}: { 
  businessId: string;
  onSpecialsUpdated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [specialToEdit, setSpecialToEdit] = useState<BusinessSpecial | null>(null);
  
  // Listen for the custom event from AddFirstSpecialButton
  useEffect(() => {
    const handleOpenManagement = () => {
      setIsOpen(true);
      setActiveTab("add");
    };
    
    window.addEventListener('open-specials-management', handleOpenManagement);
    
    return () => {
      window.removeEventListener('open-specials-management', handleOpenManagement);
    };
  }, []);
  
  const handleSpecialSuccess = () => {
    setActiveTab("list");
    setSpecialToEdit(null);
    if (onSpecialsUpdated) onSpecialsUpdated();
    
    // Dispatch a custom event that the SpecialsSection component can listen for
    window.dispatchEvent(new CustomEvent('specials-updated'));
  };
  
  const handlePreferencesSuccess = () => {
    // Dispatch a custom event to refresh the section with new preferences
    window.dispatchEvent(new CustomEvent('section-preferences-updated'));
    if (onSpecialsUpdated) onSpecialsUpdated();
  };
  
  const handleEditSpecial = (special: BusinessSpecial) => {
    setSpecialToEdit(special);
    setActiveTab("edit");
  };
  
  const handleAddNewClick = () => {
    setSpecialToEdit(null);
    setActiveTab("add");
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setTimeout(() => {
        setActiveTab("list");
        setSpecialToEdit(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          data-manage-specials-button
        >
          <Edit className="mr-2 h-4 w-4" />
          Manage Specials
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Specials</DialogTitle>
          <DialogDescription>
            Create and manage special offers for your business.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">All Specials</TabsTrigger>
              {/* <TabsTrigger value="add">Add New</TabsTrigger> */}
              <TabsTrigger value="preferences">Section Preferences</TabsTrigger>
              {specialToEdit && (
                <TabsTrigger value="edit">Edit Special</TabsTrigger>
              )}
            </TabsList>
            
            {activeTab === "list" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddNewClick}
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
          
          <TabsContent value="list" className="space-y-4">
            <SpecialsList 
              businessId={businessId} 
              onRefresh={handleSpecialSuccess}
              onEdit={handleEditSpecial}
            />
          </TabsContent>
          
          <TabsContent value="add">
            <SpecialForm 
              businessId={businessId} 
              onSuccess={handleSpecialSuccess}
            />
          </TabsContent>
          
          <TabsContent value="preferences">
            <SectionPreferencesForm 
              businessId={businessId}
              onSuccess={handlePreferencesSuccess}
            />
          </TabsContent>
          
          <TabsContent value="edit">
            {specialToEdit && (
              <SpecialForm 
                businessId={businessId} 
                onSuccess={handleSpecialSuccess}
                specialToEdit={specialToEdit}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 