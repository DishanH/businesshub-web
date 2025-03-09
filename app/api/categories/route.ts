import { NextResponse } from "next/server"
import { getActiveCategories } from "@/app/(public)/categories/actions"

export async function GET() {
  try {
    const result = await getActiveCategories()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in categories API route:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      },
      { status: 500 }
    )
  }
} 