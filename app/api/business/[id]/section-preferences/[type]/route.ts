import { NextRequest, NextResponse } from "next/server";
import { getSectionPreferences } from "@/app/(public)/business-profiles/[id]/specials-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, type: string } }
) {
  try {
    const { id, type } = await params;
    
    if (!id || !type) {
      return NextResponse.json(
        { error: "Business ID and section type are required" },
        { status: 400 }
      );
    }
    
    const result = await getSectionPreferences(id, type);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching section preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch section preferences" },
      { status: 500 }
    );
  }
} 