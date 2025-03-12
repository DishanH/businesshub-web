import { NextRequest, NextResponse } from "next/server";
import { updateSectionPreferences, getSectionPreferences } from "@/app/(public)/business-profiles/[id]/specials-actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const sectionType = searchParams.get('sectionType');
    
    if (!businessId || !sectionType) {
      return NextResponse.json(
        { error: "Business ID and section type are required" },
        { status: 400 }
      );
    }
    
    const result = await getSectionPreferences(businessId, sectionType);
    
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      business_id, 
      section_type, 
      title, 
      is_visible 
    } = body;
    
    if (!business_id || !section_type) {
      return NextResponse.json(
        { error: "Business ID and section type are required" },
        { status: 400 }
      );
    }
    
    const result = await updateSectionPreferences(
      business_id,
      section_type,
      {
        title,
        is_visible
      }
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating section preferences:", error);
    return NextResponse.json(
      { error: "Failed to update section preferences" },
      { status: 500 }
    );
  }
} 