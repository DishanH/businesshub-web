"use client"

import { useState, useEffect } from "react"
import { Category } from "@/app/actions/categories"
import { CategoryBadge } from "@/components/category-badge"

interface CategoryFilterProps {
  categories: Category[]
  onSelectCategory: (category: Category) => void
  selectedCategory?: Category | null
}

export function CategoryFilter2({ categories, onSelectCategory, selectedCategory }: CategoryFilterProps) {
  const [activeCategories, setActiveCategories] = useState<Category[]>([])

  useEffect(() => {
    // Filter out inactive categories
    setActiveCategories(categories.filter(category => category.active))
  }, [categories])

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeCategories.map((category) => (
        <CategoryBadge
          key={category.id}
          category={category}
          isSelected={selectedCategory?.id === category.id}
          onClick={() => onSelectCategory(category)}
        />
      ))}
    </div>
  )
} 