"use client"

import Link from "next/link"
import { Category } from "@/app/actions/categories"

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection2({ categories }: CategorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <Link href="/posts" className="text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/posts?category=${category.slug}`}
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
} 