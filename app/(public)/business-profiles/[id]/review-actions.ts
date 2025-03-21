"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface ReviewData {
  id: string
  business_id: string
  user_id: string
  rating: number
  content: string
  image_url?: string
  is_verified: boolean
  created_at: string
  updated_at: string
  user?: {
    id: string
    email?: string
    user_metadata?: {
      name?: string
      avatar_url?: string
    }
  }
  replies?: ReviewReplyData[]
}

export interface ReviewReplyData {
  id: string
  review_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    email?: string
    user_metadata?: {
      name?: string
      avatar_url?: string
    }
  }
}

/**
 * Get reviews for a business
 * 
 * @param businessId - Business ID to fetch reviews for
 * @returns Object with success status and data or error details
 */
export async function getBusinessReviews(businessId: string): Promise<{ 
  data: ReviewData[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient()
    
    // Get reviews without trying to join with users directly
    const { data: reviews, error } = await supabase
      .from("business_reviews")
      .select(`
        *,
        replies:business_review_replies (
          *
        )
      `)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
    
    if (error) {
      throw error
    }
    
    // If we have reviews, fetch user data separately for each review
    if (reviews && reviews.length > 0) {
      // Get all user IDs from reviews and replies
      const userIds = new Set<string>()
      
      reviews.forEach(review => {
        userIds.add(review.user_id)
        if (review.replies && review.replies.length > 0) {
          review.replies.forEach((reply: ReviewReplyData) => {
            userIds.add(reply.user_id)
          })
        }
      })
      
      // Create a map to store user data
      const userMap = new Map<string, {
        display_name?: string;
        full_name?: string;
        avatar_url?: string;
        [key: string]: unknown;
      }>()
      
      // Fetch user data from user_profiles table
      for (const userId of userIds) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single()
          
          if (!userError && userData) {
            userMap.set(userId, userData)
          }
        } catch (error) {
          console.error(`Error fetching user data for user ${userId}:`, error)
        }
      }
      
      // Add user data to reviews
      reviews.forEach(review => {
        const userData = userMap.get(review.user_id)
        
        review.user = {
          id: review.user_id,
          user_metadata: {
            name: userData?.display_name || userData?.full_name || "User",
            avatar_url: userData?.avatar_url
          }
        }
        
        // Add user data to replies
        if (review.replies && review.replies.length > 0) {
          review.replies.forEach((reply: ReviewReplyData) => {
            const replyUserData = userMap.get(reply.user_id)
            
            reply.user = {
              id: reply.user_id,
              user_metadata: {
                name: replyUserData?.display_name || replyUserData?.full_name || "Business Owner",
                avatar_url: replyUserData?.avatar_url
              }
            }
          })
        }
      })
    }
    
    return {
      data: reviews,
      error: null
    }
  } catch (error) {
    console.error("Error fetching business reviews:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

/**
 * Add a review for a business
 * 
 * @param businessId - Business ID to add review for
 * @param reviewData - Review data to add
 * @returns Object with success status and data or error details
 */
export async function addBusinessReview(
  businessId: string, 
  reviewData: {
    rating: number;
    content: string;
    image_url?: string;
  }
): Promise<{ 
  success: boolean;
  data?: ReviewData;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if user already reviewed this business
    const { data: existingReview } = await supabase
      .from("business_reviews")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", user.id)
      .maybeSingle()
    
    if (existingReview) {
      return { success: false, error: "You have already reviewed this business" }
    }
    
    // Validate review data
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" }
    }
    
    if (!reviewData.content || reviewData.content.trim().length === 0) {
      return { success: false, error: "Review content is required" }
    }
    
    if (reviewData.content.length > 1000) {
      return { success: false, error: "Review content must be 1000 characters or less" }
    }
    
    // Add the review
    const { data: newReview, error } = await supabase
      .from("business_reviews")
      .insert({
        business_id: businessId,
        user_id: user.id,
        rating: reviewData.rating,
        content: reviewData.content,
        image_url: reviewData.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single()
    
    if (error) {
      console.error("Error adding review:", error)
      return { success: false, error: error.message }
    }
    
    // Manually add user data to the review
    const reviewWithUser: ReviewData = {
      ...newReview,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true, data: reviewWithUser }
  } catch (error) {
    console.error("Error in addBusinessReview:", error)
    return { success: false, error: "Failed to add review" }
  }
}

/**
 * Update a review
 * 
 * @param businessId - Business ID the review belongs to
 * @param reviewId - Review ID to update
 * @param reviewData - Updated review data
 * @returns Object with success status and data or error details
 */
export async function updateBusinessReview(
  businessId: string,
  reviewId: string,
  reviewData: {
    rating: number;
    content: string;
    image_url?: string;
  }
): Promise<{ 
  success: boolean;
  data?: ReviewData;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if review exists and belongs to user
    const { data: existingReview, error: reviewError } = await supabase
      .from("business_reviews")
      .select("id, user_id")
      .eq("id", reviewId)
      .eq("business_id", businessId)
      .single()
    
    if (reviewError || !existingReview) {
      return { success: false, error: "Review not found" }
    }
    
    if (existingReview.user_id !== user.id) {
      return { success: false, error: "You can only update your own reviews" }
    }
    
    // Validate review data
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" }
    }
    
    if (!reviewData.content || reviewData.content.trim().length === 0) {
      return { success: false, error: "Review content is required" }
    }
    
    if (reviewData.content.length > 1000) {
      return { success: false, error: "Review content must be 1000 characters or less" }
    }
    
    // Update the review
    const { data: updatedReview, error } = await supabase
      .from("business_reviews")
      .update({
        rating: reviewData.rating,
        content: reviewData.content,
        image_url: reviewData.image_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select("*")
      .single()
    
    if (error) {
      console.error("Error updating review:", error)
      return { success: false, error: error.message }
    }
    
    // Manually add user data to the review
    const reviewWithUser: ReviewData = {
      ...updatedReview,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true, data: reviewWithUser }
  } catch (error) {
    console.error("Error in updateBusinessReview:", error)
    return { success: false, error: "Failed to update review" }
  }
}

/**
 * Delete a review (owner or author can delete)
 * 
 * @param businessId - Business ID the review belongs to
 * @param reviewId - Review ID to delete
 * @returns Object with success status and error details if any
 */
export async function deleteBusinessReview(
  businessId: string,
  reviewId: string
): Promise<{ 
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if review exists and get its details
    const { data: review, error: reviewError } = await supabase
      .from("business_reviews")
      .select("id, user_id, business_id")
      .eq("id", reviewId)
      .eq("business_id", businessId)
      .single()
    
    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }
    
    // Check if user is the review author
    const isAuthor = review.user_id === user.id
    
    // Check if user is the business owner
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single()
    
    if (businessError) {
      console.error("Error checking business ownership:", businessError)
    }
    
    const isOwner = business && business.user_id === user.id
    
    // Check if user is an admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
    
    const isAdmin = !!userRole
    
    // Allow deletion if user is the author, business owner, or an admin
    if (!isAuthor && !isOwner && !isAdmin) {
      return { success: false, error: "You can only delete your own reviews, or you must be the business owner or an admin" }
    }
    
    // Delete the review
    const { error } = await supabase
      .from("business_reviews")
      .delete()
      .eq("id", reviewId)
    
    if (error) {
      console.error("Error deleting review:", error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteBusinessReview:", error)
    return { success: false, error: "Failed to delete review" }
  }
}

/**
 * Add a reply to a review (business owner only)
 * 
 * @param businessId - Business ID the review belongs to
 * @param reviewId - Review ID to reply to
 * @param content - Reply content
 * @returns Object with success status and data or error details
 */
export async function addReviewReply(
  businessId: string,
  reviewId: string,
  content: string
): Promise<{ 
  success: boolean;
  data?: ReviewReplyData;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if user is the business owner
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("user_id")
      .eq("id", businessId)
      .single()
    
    if (businessError || !business) {
      return { success: false, error: "Business not found" }
    }
    
    if (business.user_id !== user.id) {
      return { success: false, error: "Only the business owner can reply to reviews" }
    }
    
    // Check if review exists and belongs to the business
    const { data: review, error: reviewError } = await supabase
      .from("business_reviews")
      .select("id")
      .eq("id", reviewId)
      .eq("business_id", businessId)
      .single()
    
    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }
    
    // Validate reply content
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Reply content is required" }
    }
    
    if (content.length > 1000) {
      return { success: false, error: "Reply content must be 1000 characters or less" }
    }
    
    // Check if a reply already exists
    const { data: existingReply } = await supabase
      .from("business_review_replies")
      .select("id")
      .eq("review_id", reviewId)
      .maybeSingle()
    
    if (existingReply) {
      return { success: false, error: "A reply already exists for this review" }
    }
    
    // Add the reply
    const { data: newReply, error } = await supabase
      .from("business_review_replies")
      .insert({
        review_id: reviewId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single()
    
    if (error) {
      console.error("Error adding reply:", error)
      return { success: false, error: error.message }
    }
    
    // Manually add user data to the reply
    const replyWithUser: ReviewReplyData = {
      ...newReply,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true, data: replyWithUser }
  } catch (error) {
    console.error("Error in addReviewReply:", error)
    return { success: false, error: "Failed to add reply" }
  }
}

/**
 * Update a review reply
 * 
 * @param businessId - Business ID the review belongs to
 * @param replyId - Reply ID to update
 * @param content - Updated reply content
 * @returns Object with success status and data or error details
 */
export async function updateReviewReply(
  businessId: string,
  replyId: string,
  content: string
): Promise<{ 
  success: boolean;
  data?: ReviewReplyData;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if reply exists and belongs to user
    const { data: existingReply, error: replyError } = await supabase
      .from("business_review_replies")
      .select("id, user_id, review_id")
      .eq("id", replyId)
      .single()
    
    if (replyError || !existingReply) {
      return { success: false, error: "Reply not found" }
    }
    
    if (existingReply.user_id !== user.id) {
      return { success: false, error: "You can only update your own replies" }
    }
    
    // Get the review to verify business
    const { data: review, error: reviewError } = await supabase
      .from("business_reviews")
      .select("business_id")
      .eq("id", existingReply.review_id)
      .single()
    
    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }
    
    if (review.business_id !== businessId) {
      return { success: false, error: "Reply does not belong to this business" }
    }
    
    // Validate reply content
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Reply content is required" }
    }
    
    if (content.length > 1000) {
      return { success: false, error: "Reply content must be 1000 characters or less" }
    }
    
    // Update the reply
    const { data: updatedReply, error } = await supabase
      .from("business_review_replies")
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq("id", replyId)
      .eq("user_id", user.id)
      .select("*")
      .single()
    
    if (error) {
      console.error("Error updating reply:", error)
      return { success: false, error: error.message }
    }
    
    // Manually add user data to the reply
    const replyWithUser: ReviewReplyData = {
      ...updatedReply,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true, data: replyWithUser }
  } catch (error) {
    console.error("Error in updateReviewReply:", error)
    return { success: false, error: "Failed to update reply" }
  }
}

/**
 * Delete a review reply
 * 
 * @param businessId - Business ID the review belongs to
 * @param replyId - Reply ID to delete
 * @returns Object with success status and error details if any
 */
export async function deleteReviewReply(
  businessId: string,
  replyId: string
): Promise<{ 
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check if reply exists
    const { data: existingReply, error: replyError } = await supabase
      .from("business_review_replies")
      .select("id, user_id, review_id")
      .eq("id", replyId)
      .single()
    
    if (replyError || !existingReply) {
      return { success: false, error: "Reply not found" }
    }
    
    // Get the review to verify business
    const { data: review, error: reviewError } = await supabase
      .from("business_reviews")
      .select("business_id")
      .eq("id", existingReply.review_id)
      .single()
    
    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }
    
    if (review.business_id !== businessId) {
      return { success: false, error: "Reply does not belong to this business" }
    }
    
    // Check if user is the reply author or an admin
    const isAuthor = existingReply.user_id === user.id
    
    if (!isAuthor) {
      // Check if user is an admin
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle()
      
      if (!userRole) {
        return { success: false, error: "You can only delete your own replies or must be an admin" }
      }
    }
    
    // Delete the reply
    const { error } = await supabase
      .from("business_review_replies")
      .delete()
      .eq("id", replyId)
    
    if (error) {
      console.error("Error deleting reply:", error)
      return { success: false, error: error.message }
    }
    
    // Revalidate the business profile page
    revalidatePath(`/business-profiles/${businessId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteReviewReply:", error)
    return { success: false, error: "Failed to delete reply" }
  }
} 