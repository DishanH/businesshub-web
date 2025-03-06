"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategoryId?: string
}

export function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId === selectedCategoryId) {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    
    router.push(`/search?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={category.id === selectedCategoryId ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  )
} 