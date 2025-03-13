import { NextRequest, NextResponse } from "next/server";
import { getBusinessSpecialsByBusinessId } from "@/app/owner/business-profiles/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    
    const { data, error } = await getBusinessSpecialsByBusinessId(id);
    
    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching specials:", error);
    return NextResponse.json(
      { error: "Failed to fetch specials" },
      { status: 500 }
    );
  }
}