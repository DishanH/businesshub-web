"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toggleCategoryActive } from "../../actions"
import { toast } from "sonner"

export default function ToggleCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    const toggleCategory = async () => {
      try {
        const result = await toggleCategoryActive(params.id)
        
        if (result.success) {
          toast.success("Category status updated successfully")
        } else {
          toast.error(`Failed to update category status: ${result.error}`)
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
        console.error(error)
      } finally {
        router.push("/admin/categories")
      }
    }
    
    toggleCategory()
  }, [params.id, router])
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
} 