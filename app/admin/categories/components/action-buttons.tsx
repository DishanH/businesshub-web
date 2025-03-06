"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Pencil, Plus } from "lucide-react"

export function ViewCategoryButton({ categoryId }: { categoryId: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/admin/categories/${categoryId}`}>
        <Eye className="w-4 h-4" />
      </Link>
    </Button>
  );
}

export function EditCategoryButton({ categoryId }: { categoryId: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/admin/categories/${categoryId}`}>
        <Pencil className="w-4 h-4" />
      </Link>
    </Button>
  );
}

export function AddCategoryButton() {
  return (
    <Button asChild>
      <Link href="/admin/categories/new">
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </Link>
    </Button>
  );
} 