"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getBusinessById } from "@/app/owner/business-profiles/actions/core"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import CreateBusinessPage from "@/app/owner/business-profiles/create/page"
import type { Business } from "@/app/owner/business-profiles/actions/types"

interface UpdateBusinessPageProps {
  params: {
    id: string
  }
}

export default function UpdateBusinessPage({ params }: UpdateBusinessPageProps) {
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<Business | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const result = await getBusinessById(params.id)
        
        if (result.success) {
          setBusiness(result.data)
        } else {
          setError(result.error || "Failed to load business")
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to load business",
          })
        }
      } catch (error) {
        console.error("Error fetching business:", error)
        setError("An unexpected error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Error Loading Business</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push("/business-profiles/manage")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Back to Manage Businesses
          </button>
        </div>
      </div>
    )
  }

  // Pass the business data to the CreateBusinessPage component
  return <CreateBusinessPage isEditing={true} businessData={business} />
} 