import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Simplified Category type that matches what's returned from the API
interface CategoryItem {
  id: string
  name: string
  slug: string
  icon?: string
  description: string
  active: boolean
}

interface CategorySectionProps {
  categories: CategoryItem[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name))
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <Link href="/categories" className="text-primary hover:underline">
          View All
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sortedCategories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Badge variant="outline" className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
              {category.icon && (
                <span className="mr-1">{category.icon}</span>
              )}
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
} 