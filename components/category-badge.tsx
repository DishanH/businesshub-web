import { cn } from "@/lib/utils"
import Link from "next/link"

interface CategoryBadgeProps {
  name: string
  count?: number
  className?: string
  href?: string
}

export function CategoryBadge({ name, count, className, href = "#" }: CategoryBadgeProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className,
      )}
    >
      {name}
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-primary-foreground/10 px-1.5 py-0.5 text-xs">{count}</span>
      )}
    </Link>
  )
}

