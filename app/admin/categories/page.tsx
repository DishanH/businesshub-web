import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Plus, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchCategories, toggleCategoryActive, deleteCategory } from "./actions"

// Define types for our data
type Subcategory = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

type Attribute = {
  id: string;
  name: string;
  type: string;
  options?: string[];
  required: boolean;
  description?: string;
}

type CategoryType = {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  subcategories: Subcategory[];
  attributes: Attribute[];
}

// Loading component
function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  )
}

// Category Preview component
function CategoryPreview({ category }: { category: CategoryType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
        <div className="flex flex-wrap gap-2">
          {category.subcategories.map((subcategory) => (
            <Badge key={subcategory.id} variant="secondary">
              {subcategory.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Categories Table component
async function CategoriesTable() {
  const { success, data: categories, error } = await fetchCategories();
  
  if (!success) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Error loading categories: {error}
      </div>
    );
  }
  
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No categories found</p>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Create your first category
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: CategoryType, index: number) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description.length > 35 ? category.description.slice(0, 35) + "..." : category.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((subcategory) => (
                        <Badge key={subcategory.id} variant="outline" className="text-xs">
                          {subcategory.name}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subcategories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"} className="capitalize">
                      {category.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Category Preview</DialogTitle>
                          <DialogDescription>Preview of the category details</DialogDescription>
                        </DialogHeader>
                        <CategoryPreview category={category} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/categories/${category.id}`}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <form action={async () => {
                      await toggleCategoryActive(category.id);
                    }} className="inline">
                      <Button variant="outline" size="sm" type="submit">
                        {category.active ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                    <form action={async () => {
                      await deleteCategory(category.id);
                    }} className="inline" 
                          onSubmit={(e) => {
                            if (!confirm("Are you sure you want to delete this category?")) {
                              e.preventDefault();
                            }
                          }}>
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesTable />
      </Suspense>
    </div>
  )
} 