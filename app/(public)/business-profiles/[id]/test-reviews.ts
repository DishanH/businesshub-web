"use server"

import { createClient } from "@/utils/supabase/server"

export async function testReviewsQuery(businessId: string) {
  try {
    const supabase = await createClient()
    
    // First approach: Try the original query with joins
    console.log("Attempting original query with joins...")
    const { data: joinData, error: joinError } = await supabase
      .from("business_reviews")
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        ),
        replies:business_review_replies (
          *,
          user:user_id (
            id,
            email,
            user_metadata
          )
        )
      `)
      .eq("business_id", businessId)
      .limit(1)
    
    if (joinError) {
      console.error("Join query error:", joinError)
    } else {
      console.log("Join query successful:", joinData)
    }
    
    // Second approach: Try without joins
    console.log("\nAttempting query without joins...")
    const { data: noJoinData, error: noJoinError } = await supabase
      .from("business_reviews")
      .select(`
        *,
        replies:business_review_replies (
          *
        )
      `)
      .eq("business_id", businessId)
      .limit(1)
    
    if (noJoinError) {
      console.error("No join query error:", noJoinError)
    } else {
      console.log("No join query successful:", noJoinData)
    }
    
    // Third approach: Check if user_profiles table exists
    console.log("\nChecking if user_profiles table exists...")
    const { data: profilesData, error: profilesError } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(1)
    
    if (profilesError) {
      console.error("User profiles query error:", profilesError)
    } else {
      console.log("User profiles query successful:", profilesData)
    }
    
    return {
      joinQuery: { data: joinData, error: joinError?.message },
      noJoinQuery: { data: noJoinData, error: noJoinError?.message },
      profilesQuery: { data: profilesData, error: profilesError?.message }
    }
  } catch (error) {
    console.error("Test error:", error)
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
} 