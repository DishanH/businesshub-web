import { NextRequest, NextResponse } from "next/server";
import { createBusinessSpecial, updateBusinessSpecial } from "@/app/(public)/business-profiles/[id]/specials-actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      business_id, 
      name, 
      description, 
      image_url, 
      start_date, 
      end_date, 
      is_active, 
      display_order 
    } = body;
    
    if (!business_id || !name) {
      return NextResponse.json(
        { error: "Business ID and name are required" },
        { status: 400 }
      );
    }
    
    const result = await createBusinessSpecial({
      business_id,
      name,
      description,
      image_url,
      start_date,
      end_date,
      is_active,
      display_order
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error creating special:", error);
    return NextResponse.json(
      { error: "Failed to create special" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      id, 
      name, 
      description, 
      image_url, 
      start_date, 
      end_date, 
      is_active, 
      display_order 
    } = body;
    
    if (!id || !name) {
      return NextResponse.json(
        { error: "Special ID and name are required" },
        { status: 400 }
      );
    }
    
    const result = await updateBusinessSpecial(id, {
      name,
      description,
      image_url,
      start_date,
      end_date,
      is_active,
      display_order
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating special:", error);
    return NextResponse.json(
      { error: "Failed to update special" },
      { status: 500 }
    );
  }
} 