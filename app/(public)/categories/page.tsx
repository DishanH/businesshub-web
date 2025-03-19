import { Suspense } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"

import { getActiveCategories } from "./actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Categories | BusinessHub",
  description: "Browse all categories and find businesses by type",
}

async function CategoryList() {
  const result = await getActiveCategories()
  
  if (!result.success || !result.data) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Unable to load categories</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    )
  }
  
  // Sort categories alphabetically
  const sortedCategories = [...result.data].sort((a, b) => 
    a.name.localeCompare(b.name)
  )
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function CategoryCard({ category }: { category: any }) {
  // Map of icon names to emoji fallbacks if needed
  const iconToEmoji: Record<string, string> = {
    "utensils": "🍽️",
    "coffee": "☕",
    "truck": "🚚",
    "shirt": "👕",
    "laptop": "💻",
    "home": "🏠",
    "gift": "🎁",
    "dumbbell": "💪",
    "scissors": "✂️",
    "stethoscope": "🩺",
    "gavel": "⚖️",
    "dollar-sign": "💰",
    "building": "🏢",
    "pen-tool": "🖋️",
    "spray-can": "🧴",
    "tool": "🔧",
    "tree": "🌳",
    "wrench": "🔧",
    "droplet": "💧",
    "book": "📚",
    "child": "👶",
    "calendar": "📅",
    "film": "🎬",
    "heart": "❤️",
    "shopping-bag": "🛍️"
  }
  
  // Get emoji for icon or fallback
  const getIconDisplay = (iconName?: string) => {
    if (!iconName) return null
    return iconToEmoji[iconName] || "🔍"
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          {category.icon && (
            <span className="text-2xl">{getIconDisplay(category.icon)}</span>
          )}
          <CardTitle>{category.name}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="text-sm font-medium mb-2">Subcategories</h3>
        <div className="flex flex-wrap gap-2">
          {category.subcategories && category.subcategories.length > 0 ? (
            category.subcategories
              .filter((sub: any) => sub.active)
              .slice(0, 5)
              .map((sub: any) => (
                <Badge key={sub.id} variant="outline" className="hover:bg-secondary">
                  {sub.name}
                </Badge>
              ))
          ) : (
            <p className="text-sm text-muted-foreground">No subcategories</p>
          )}
          
          {category.subcategories && category.subcategories.length > 5 && (
            <Badge variant="outline" className="hover:bg-secondary">
              +{category.subcategories.length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/categories/${category.slug}`} className="w-full">
          <Button variant="secondary" className="w-full group">
            Browse
            <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function CategoriesPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Browse Categories</h1>
        <p className="text-muted-foreground mb-6">
          Explore our wide range of business categories and find exactly what you're looking for
        </p>
        
        {/* Category Search */}
        <form className="flex items-center gap-2 max-w-xl mx-auto" action="/search" method="get">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              name="q"
              placeholder="Search categories..."
              className="pl-10"
            />
            <input type="hidden" name="type" value="category" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Categories</span>
      </div>
      
      {/* Category Grid with Suspense */}
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  )
} 