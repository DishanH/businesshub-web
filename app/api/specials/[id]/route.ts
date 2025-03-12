import { NextRequest, NextResponse } from "next/server";
import { deleteBusinessSpecial } from "@/app/(public)/business-profiles/[id]/specials-actions";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Special ID is required" },
        { status: 400 }
      );
    }
    
    const result = await deleteBusinessSpecial(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting special:", error);
    return NextResponse.json(
      { error: "Failed to delete special" },
      { status: 500 }
    );
  }
} 