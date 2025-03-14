import { NextRequest, NextResponse } from "next/server";
import { populateBusinessMenuData } from "@/app/owner/business-profiles/populate-menu-data";

export async function POST(request: NextRequest) {
  try {
    // Get the business ID from the request body
    const { businessId } = await request.json();
    
    // Run the populate menu data function
    const result = await populateBusinessMenuData(businessId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error populating menu data:", error);
    return NextResponse.json(
      { error: "Failed to populate menu data" },
      { status: 500 }
    );
  }
}

// Also allow GET requests for easier testing
export async function GET() {
  try {
    // Use the default business ID from the function
    const result = await populateBusinessMenuData();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error populating menu data:", error);
    return NextResponse.json(
      { error: "Failed to populate menu data" },
      { status: 500 }
    );
  }
} 