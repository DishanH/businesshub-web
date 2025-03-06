import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewAllButtonProps {
  href: string
  label?: string
}

export function ViewAllButton({ href, label = "View All" }: ViewAllButtonProps) {
  return (
    <Button variant="ghost" size="sm" asChild className="group">
      <Link href={href} className="flex items-center gap-1">
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  )
} 