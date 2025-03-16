import { NextRequest, NextResponse } from "next/server";
import { testReviewsQuery } from "@/app/(public)/business-profiles/[id]/test-reviews";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const businessId = searchParams.get("businessId") || "f1ce39c0-c883-415b-9119-e1070699eebf";
  
  try {
    const result = await testReviewsQuery(businessId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 