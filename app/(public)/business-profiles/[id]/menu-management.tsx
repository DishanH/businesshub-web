"use client";

import { useState } from "react";
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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessMenuData } from "@/app/owner/business-profiles/menu-types";
import { 
  addMenuCategory, 
  addMenuItem, 
  updateMenuSection, 
  updateMenuCategory, 
  updateMenuItem, 
  deleteMenuCategory, 
  deleteMenuItem 
} from "./menu-actions";

interface MenuManagementProps {
  businessId: string;
  menuData: BusinessMenuData | null;
  onMenuUpdated: () => void;
  children?: React.ReactNode;
}

export default function MenuManagement({ 
  businessId, 
  menuData, 
  onMenuUpdated,
  children 
}: MenuManagementProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("section");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Section form state
  const [sectionTitle, setSectionTitle] = useState(menuData?.section?.title || "Menu");
  const [sectionIcon, setSectionIcon] = useState(menuData?.section?.icon || "Utensils");
  const [sectionVisible, setSectionVisible] = useState(menuData?.section?.is_visible ?? true);
  
  // Category form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryDisplayOrder, setCategoryDisplayOrder] = useState(0);
  
  // Item form state
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemIsFeatured, setItemIsFeatured] = useState(false);
  const [itemDisplayOrder, setItemDisplayOrder] = useState(0);
  
  // Reset form states
  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setCategoryDisplayOrder(menuData?.categories?.length || 0);
    setSelectedCategoryId(null);
  };
  
  const resetItemForm = () => {
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemIsFeatured(false);
    setItemDisplayOrder(0);
    setSelectedItemId(null);
  };
  
  // Load category data for editing
  const loadCategoryForEdit = (categoryId: string) => {
    const category = menuData?.categories?.find(c => c.id === categoryId);
    if (category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description || "");
      setCategoryDisplayOrder(category.display_order);
      setSelectedCategoryId(categoryId);
      setActiveTab("categories");
    }
  };
  
  // Load item data for editing
  const loadItemForEdit = (itemId: string, categoryId: string) => {
    const category = menuData?.categories?.find(c => c.id === categoryId);
    const item = category?.items?.find(i => i.id === itemId);
    
    if (item) {
      setItemName(item.name);
      setItemDescription(item.description || "");
      setItemPrice(item.price || "");
      setItemIsFeatured(item.is_featured);
      setItemDisplayOrder(item.display_order);
      setSelectedItemId(itemId);
      setSelectedCategoryId(categoryId);
      setActiveTab("items");
    }
  };
  
  // Handle section update
  const handleSectionUpdate = async () => {
    setIsLoading(true);
    try {
      const result = await updateMenuSection(businessId, {
        id: menuData?.section?.id || "",
        title: sectionTitle,
        icon: sectionIcon,
        is_visible: sectionVisible
      });
      
      if (result.success) {
        toast({
          title: "Section updated",
          description: "Menu section has been updated successfully."
        });
        onMenuUpdated();
      } else {
        throw new Error(result.error || "Failed to update section");
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the menu section."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle category save (create or update)
  const handleCategorySave = async () => {
    if (!categoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Category name is required."
      });
      return;
    }
    
    setIsLoading(true);
    try {
      let result;
      
      if (selectedCategoryId) {
        // Update existing category
        result = await updateMenuCategory(businessId, {
          id: selectedCategoryId,
          name: categoryName,
          description: categoryDescription,
          display_order: categoryDisplayOrder,
          section_id: menuData?.section?.id || ""
        });
      } else {
        // Create new category
        if (!menuData?.section?.id) {
          throw new Error("Menu section not found");
        }
        
        result = await addMenuCategory(businessId, {
          name: categoryName,
          description: categoryDescription,
          display_order: categoryDisplayOrder,
          section_id: menuData.section.id
        });
      }
      
      if (result.success) {
        toast({
          title: selectedCategoryId ? "Category updated" : "Category added",
          description: `Category has been ${selectedCategoryId ? "updated" : "added"} successfully.`
        });
        resetCategoryForm();
        onMenuUpdated();
      } else {
        throw new Error(result.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: `There was an error ${selectedCategoryId ? "updating" : "adding"} the category.`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle item save (create or update)
  const handleItemSave = async () => {
    if (!itemName.trim() || !selectedCategoryId) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Item name and category are required."
      });
      return;
    }
    
    setIsLoading(true);
    try {
      let result;
      
      // Try to parse price as numeric if possible
      let priceNumeric = null;
      if (itemPrice) {
        const numericValue = parseFloat(itemPrice.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericValue)) {
          priceNumeric = numericValue;
        }
      }
      
      if (selectedItemId) {
        // Update existing item
        result = await updateMenuItem(businessId, {
          id: selectedItemId,
          name: itemName,
          description: itemDescription,
          price: itemPrice,
          price_numeric: priceNumeric,
          is_featured: itemIsFeatured,
          display_order: itemDisplayOrder,
          category_id: selectedCategoryId
        });
      } else {
        // Create new item
        result = await addMenuItem(businessId, {
          name: itemName,
          description: itemDescription,
          price: itemPrice,
          price_numeric: priceNumeric,
          is_featured: itemIsFeatured,
          display_order: itemDisplayOrder,
          category_id: selectedCategoryId
        });
      }
      
      if (result.success) {
        toast({
          title: selectedItemId ? "Item updated" : "Item added",
          description: `Menu item has been ${selectedItemId ? "updated" : "added"} successfully.`
        });
        resetItemForm();
        onMenuUpdated();
      } else {
        throw new Error(result.error || "Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: `There was an error ${selectedItemId ? "updating" : "adding"} the menu item.`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle category delete
  const handleCategoryDelete = async () => {
    if (!selectedCategoryId) return;
    
    if (!confirm("Are you sure you want to delete this category? This will also delete all items in this category.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteMenuCategory(businessId, selectedCategoryId);
      
      if (result.success) {
        toast({
          title: "Category deleted",
          description: "Category has been deleted successfully."
        });
        resetCategoryForm();
        onMenuUpdated();
      } else {
        throw new Error(result.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the category."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle item delete
  const handleItemDelete = async () => {
    if (!selectedItemId) return;
    
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteMenuItem(businessId, selectedItemId);
      
      if (result.success) {
        toast({
          title: "Item deleted",
          description: "Menu item has been deleted successfully."
        });
        resetItemForm();
        onMenuUpdated();
      } else {
        throw new Error(result.error || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the menu item."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Menu</DialogTitle>
          <DialogDescription>
            Customize your business menu, categories, and items.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="section">Menu Section</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="items">Menu Items</TabsTrigger>
          </TabsList>
          
          {/* Section Tab */}
          <TabsContent value="section" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Section Settings</CardTitle>
                <CardDescription>
                  Configure the main menu section that appears on your business profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="section-title">Section Title</Label>
                  <Input 
                    id="section-title" 
                    value={sectionTitle} 
                    onChange={(e) => setSectionTitle(e.target.value)} 
                    placeholder="e.g., Menu, Services, Products"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section-icon">Icon</Label>
                  <Select value={sectionIcon} onValueChange={setSectionIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Utensils">Utensils (Food)</SelectItem>
                      <SelectItem value="Briefcase">Briefcase (Services)</SelectItem>
                      <SelectItem value="Wrench">Wrench (Repairs)</SelectItem>
                      <SelectItem value="Car">Car (Automotive)</SelectItem>
                      <SelectItem value="Dumbbell">Dumbbell (Fitness)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="section-visible" 
                    checked={sectionVisible} 
                    onCheckedChange={setSectionVisible}
                  />
                  <Label htmlFor="section-visible">Visible on profile</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSectionUpdate} 
                  disabled={isLoading || !menuData?.section}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedCategoryId ? "Edit Category" : "Add New Category"}</CardTitle>
                <CardDescription>
                  {selectedCategoryId 
                    ? "Update an existing category" 
                    : "Create a new category for your menu items"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input 
                    id="category-name" 
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)} 
                    placeholder="e.g., Appetizers, Services, Products"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea 
                    id="category-description" 
                    value={categoryDescription} 
                    onChange={(e) => setCategoryDescription(e.target.value)} 
                    placeholder="Brief description of this category"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-order">Display Order</Label>
                  <Input 
                    id="category-order" 
                    type="number" 
                    value={categoryDisplayOrder} 
                    onChange={(e) => setCategoryDisplayOrder(parseInt(e.target.value) || 0)} 
                    min={0}
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {selectedCategoryId && (
                    <Button 
                      variant="destructive" 
                      onClick={handleCategoryDelete} 
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={resetCategoryForm} 
                    disabled={isLoading}
                  >
                    {selectedCategoryId ? "Cancel" : "Reset"}
                  </Button>
                  <Button 
                    onClick={handleCategorySave} 
                    disabled={isLoading || !categoryName.trim()}
                  >
                    {isLoading ? "Saving..." : (selectedCategoryId ? "Update" : "Add Category")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {menuData?.categories && menuData.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {menuData.categories.map((category) => (
                      <div 
                        key={category.id} 
                        className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => loadCategoryForEdit(category.id)}
                      >
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedItemId ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
                <CardDescription>
                  {selectedItemId 
                    ? "Update an existing menu item" 
                    : "Add a new item to your menu"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <Select 
                    value={selectedCategoryId || ""} 
                    onValueChange={setSelectedCategoryId}
                    disabled={!menuData?.categories || menuData.categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuData?.categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(!menuData?.categories || menuData.categories.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      You need to create a category first
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input 
                    id="item-name" 
                    value={itemName} 
                    onChange={(e) => setItemName(e.target.value)} 
                    placeholder="e.g., Caesar Salad, Website Design"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-description">Description (Optional)</Label>
                  <Textarea 
                    id="item-description" 
                    value={itemDescription} 
                    onChange={(e) => setItemDescription(e.target.value)} 
                    placeholder="Brief description of this item"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-price">Price</Label>
                  <Input 
                    id="item-price" 
                    value={itemPrice} 
                    onChange={(e) => setItemPrice(e.target.value)} 
                    placeholder="e.g., $10, From $50/hour, Custom quote"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="item-featured" 
                    checked={itemIsFeatured} 
                    onCheckedChange={(checked) => setItemIsFeatured(checked === true)}
                  />
                  <Label htmlFor="item-featured">Featured item</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-order">Display Order</Label>
                  <Input 
                    id="item-order" 
                    type="number" 
                    value={itemDisplayOrder} 
                    onChange={(e) => setItemDisplayOrder(parseInt(e.target.value) || 0)} 
                    min={0}
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  {selectedItemId && (
                    <Button 
                      variant="destructive" 
                      onClick={handleItemDelete} 
                      disabled={isLoading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={resetItemForm} 
                    disabled={isLoading}
                  >
                    {selectedItemId ? "Cancel" : "Reset"}
                  </Button>
                  <Button 
                    onClick={handleItemSave} 
                    disabled={isLoading || !itemName.trim() || !selectedCategoryId}
                  >
                    {isLoading ? "Saving..." : (selectedItemId ? "Update" : "Add Item")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {menuData?.categories && menuData.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Existing Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuData.categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.items && category.items.length > 0 ? (
                          <div className="space-y-2">
                            {category.items.map((item) => (
                              <div 
                                key={item.id} 
                                className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                                onClick={() => loadItemForEdit(item.id, category.id)}
                              >
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{item.name}</h4>
                                    {item.is_featured && (
                                      <Badge variant="secondary" className="ml-2">Featured</Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-primary">{item.price}</span>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No items in this category</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
} 