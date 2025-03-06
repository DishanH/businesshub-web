"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash } from "lucide-react"

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      e.preventDefault();
    }
  };

  return (
    <Button variant="destructive" size="sm" asChild>
      <Link href={`/admin/categories/delete/${categoryId}`} onClick={handleDeleteClick}>
        <Trash className="w-4 h-4" />
      </Link>
    </Button>
  );
} 