import { NextRequest, NextResponse } from "next/server";
import { testMenuData } from "@/app/owner/business-profiles/test-menu-data";

export async function GET(request: NextRequest) {
  try {
    // Get the business ID from the query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId") || "f1ce39c0-c883-415b-9119-e1070699eebf";
    
    // Run the test menu data function
    const result = await testMenuData(businessId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error testing menu data:", error);
    return NextResponse.json(
      { error: "Failed to test menu data" },
      { status: 500 }
    );
  }
} 