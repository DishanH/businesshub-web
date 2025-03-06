"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { deleteCategory } from "../../actions"
import { toast } from "sonner"

export default function DeleteCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    const removeCategory = async () => {
      try {
        const result = await deleteCategory(params.id)
        
        if (result.success) {
          toast.success("Category deleted successfully")
        } else {
          toast.error(`Failed to delete category: ${result.error}`)
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
        console.error(error)
      } finally {
        router.push("/admin/categories")
      }
    }
    
    removeCategory()
  }, [params.id, router])
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
} 