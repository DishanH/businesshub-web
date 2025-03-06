"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Category } from "@/app/actions/categories"

interface CategoryBadgeProps {
  category: Category
  isSelected?: boolean
  onClick?: () => void
  count?: number
  className?: string
  href?: string
}

export function CategoryBadge({ 
  category, 
  isSelected = false, 
  onClick, 
  count, 
  className, 
  href 
}: CategoryBadgeProps) {
  const badgeContent = (
    <>
      {category.name}
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-primary-foreground/10 px-1.5 py-0.5 text-xs">{count}</span>
      )}
    </>
  )

  const badgeClasses = cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    isSelected 
      ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" 
      : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    className
  )

  // If onClick is provided, render a button
  if (onClick) {
    return (
      <button 
        type="button" 
        className={badgeClasses}
        onClick={onClick}
      >
        {badgeContent}
      </button>
    )
  }

  // Otherwise render a link
  return (
    <Link
      href={href || `/posts?category=${category.slug}`}
      className={badgeClasses}
    >
      {badgeContent}
    </Link>
  )
}

