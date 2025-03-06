import { NextResponse } from "next/server"
import { getBusinessesByCategory, getBusinessesByLocation, searchBusinesses } from "@/app/actions/businesses"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")
    const location = searchParams.get("location")
    const query = searchParams.get("query")
    
    let result
    
    if (categoryId) {
      result = await getBusinessesByCategory(categoryId)
    } else if (location) {
      result = await getBusinessesByLocation(location)
    } else if (query) {
      result = await searchBusinesses(query)
    } else {
      // Return empty result if no parameters provided
      result = { success: true, data: [] }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in businesses API route:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: []
      },
      { status: 500 }
    )
  }
} 