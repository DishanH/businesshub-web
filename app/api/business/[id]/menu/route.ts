import { NextRequest, NextResponse } from "next/server";
import { getBusinessMenuData } from "@/app/owner/business-profiles/menu-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    
    const result = await getBusinessMenuData(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu data" },
      { status: 500 }
    );
  }
} 