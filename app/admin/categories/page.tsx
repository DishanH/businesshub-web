import { Suspense } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCategories } from "./actions"

// Define types
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

// Import the client components
import { DeleteCategoryButton } from "./components/delete-button"
import { ViewCategoryButton, EditCategoryButton, AddCategoryButton } from "./components/action-buttons"

// Server components below
function CategoriesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

async function CategoriesTable() {
  const result = await fetchCategories();
  
  if (!result.success) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Error loading categories: {result.error}
      </div>
    );
  }
  
  const categories = result.data;
  
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No categories found</p>
        <AddCategoryButton />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead>Attributes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: CategoryType) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge variant={category.active ? "default" : "outline"}>
                  {category.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{category.subcategories.length}</TableCell>
              <TableCell>{category.attributes.length}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ViewCategoryButton categoryId={category.id} />
                  <EditCategoryButton categoryId={category.id} />
                  <DeleteCategoryButton categoryId={category.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
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
        <AddCategoryButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CategoriesLoading />}>
            <CategoriesTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 