import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the structure of the user_profiles table
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      return NextResponse.json(
        { error: tableError.message },
        { status: 500 }
      );
    }
    
    // Get the column information
    const { data: columnInfo, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' })
      .select('*');
    
    if (columnError) {
      console.log("Column info error:", columnError);
      // Fallback if the RPC function doesn't exist
      return NextResponse.json({
        tableInfo,
        message: "Successfully retrieved user_profiles data. Check the structure to ensure it has user_id, display_name, and avatar_url columns."
      });
    }
    
    return NextResponse.json({
      tableInfo,
      columnInfo,
      message: "Use this information to adjust the column names in your review-actions.ts file."
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 