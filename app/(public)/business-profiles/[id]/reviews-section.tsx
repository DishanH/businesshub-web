"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Star, Trash2, Reply, Edit, Image as ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { createClient } from "@/utils/supabase/client"
import { ReviewReplyData } from "./review-actions"
import {
  getBusinessReviews,
  addBusinessReview,
  updateBusinessReview,
  deleteBusinessReview,
  addReviewReply,
  updateReviewReply,
  deleteReviewReply,
} from "./review-actions"
import { User } from "@supabase/supabase-js"

// Review Skeleton Component
const ReviewSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  )
}

// Define the ReviewData interface
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

interface ReviewsSectionProps {
  businessId: string
  isOwner: boolean
  businessName: string
}

export default function ReviewsSection({
  businessId,
  isOwner,
  businessName,
}: ReviewsSectionProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<ReviewData[] | null>(null)
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null)
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Form states
  const [rating, setRating] = useState("5")
  const [content, setContent] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  useEffect(() => {
    fetchReviews()
    getCurrentUser()
  }, [businessId])
  
  const getCurrentUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Error getting current user:", error)
    }
  }
  
  const fetchReviews = async () => {
    setLoading(true)
    try {
      const result = await getBusinessReviews(businessId)
      if (result.error) {
        throw new Error(result.error)
      }
      setReviews(result.data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reviews. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file.",
      })
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB.",
      })
      return
    }
    
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
  
  const uploadImage = async (file: File): Promise<string | undefined> => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `review-images/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(filePath, file)
      
      if (uploadError) {
        throw uploadError
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from("business-images")
        .getPublicUrl(filePath)
      
      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return undefined
    }
  }
  
  const handleReviewSubmit = async () => {
    if (!rating || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please provide both a rating and review content.",
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      let imageUrl: string | undefined = undefined
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }
      
      const result = selectedReview
        ? await updateBusinessReview(businessId, selectedReview.id, {
            rating: parseInt(rating),
            content: content.trim(),
            image_url: imageUrl || selectedReview.image_url,
          })
        : await addBusinessReview(businessId, {
            rating: parseInt(rating),
            content: content.trim(),
            image_url: imageUrl,
          })
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      toast({
        title: selectedReview ? "Review updated" : "Review submitted",
        description: selectedReview
          ? "Your review has been updated successfully."
          : "Thank you for your review!",
      })
      
      setShowReviewDialog(false)
      setSelectedReview(null)
      setRating("5")
      setContent("")
      setImageFile(null)
      setImagePreview(null)
      fetchReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleReplySubmit = async () => {
    if (!selectedReview || !replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please provide reply content.",
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      const result = selectedReplyId
        ? await updateReviewReply(businessId, selectedReplyId, replyContent.trim())
        : await addReviewReply(businessId, selectedReview.id, replyContent.trim())
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      toast({
        title: selectedReplyId ? "Reply updated" : "Reply submitted",
        description: selectedReplyId
          ? "Your reply has been updated successfully."
          : "Your reply has been posted.",
      })
      
      setShowReplyDialog(false)
      setSelectedReview(null)
      setSelectedReplyId(null)
      setReplyContent("")
      fetchReviews()
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit reply.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }
    
    try {
      const result = await deleteBusinessReview(businessId, reviewId)
      if (!result.success) {
        throw new Error(result.error)
      }
      
      toast({
        title: "Review deleted",
        description: "The review has been deleted successfully.",
      })
      
      fetchReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete review.",
      })
    }
  }
  
  const handleDeleteReply = async (replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) {
      return
    }
    
    try {
      const result = await deleteReviewReply(businessId, replyId)
      if (!result.success) {
        throw new Error(result.error)
      }
      
      toast({
        title: "Reply deleted",
        description: "The reply has been deleted successfully.",
      })
      
      fetchReviews()
    } catch (error) {
      console.error("Error deleting reply:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete reply.",
      })
    }
  }
  
  const editReview = (review: ReviewData) => {
    setSelectedReview(review)
    setRating(review.rating.toString())
    setContent(review.content)
    if (review.image_url) {
      setImagePreview(review.image_url)
    }
    setShowReviewDialog(true)
  }
  
  const editReply = (review: ReviewData, reply: ReviewReplyData) => {
    setSelectedReview(review)
    setSelectedReplyId(reply.id)
    setReplyContent(reply.content)
    setShowReplyDialog(true)
  }
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Customer Reviews
        </h2>
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedReview ? "Edit Review" : `Review ${businessName}`}
              </DialogTitle>
              <DialogDescription>
                Share your experience with others. Reviews help businesses improve and help customers make informed decisions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} {value === 1 ? "Star" : "Stars"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Review</label>
                <Textarea
                  placeholder="Write your review here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px]"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {content.length}/1000 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("review-image")?.click()}
                    className="w-32"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {imagePreview ? "Change" : "Add Image"}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  id="review-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Review image preview"
                      className="max-h-48 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleReviewSubmit}
                disabled={isSubmitting || !rating || !content.trim()}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <>
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={review.user?.user_metadata?.avatar_url}
                        alt={review.user?.user_metadata?.name || "User"}
                      />
                      <AvatarFallback>
                        {(review.user?.user_metadata?.name || "User")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {review.user?.user_metadata?.name || "Anonymous User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.is_verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{review.content}</p>
                {review.image_url && (
                  <img
                    src={review.image_url}
                    alt="Review image"
                    className="mt-4 max-h-64 rounded-md"
                  />
                )}
                
                {/* Review Actions */}
                <div className="flex justify-end gap-2 mt-4">
                  {isOwner && !review.replies?.length && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review)
                        setShowReplyDialog(true)
                      }}
                    >
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                  )}
                  {currentUser && review.user_id === currentUser.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editReview(review)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {(currentUser && review.user_id === currentUser.id) || isOwner ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  ) : null}
                </div>
                
                {/* Owner Reply */}
                {review.replies?.[0] && (
                  <div className="mt-4 pl-4 border-l-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={review.replies[0].user?.user_metadata?.avatar_url}
                          alt={review.replies[0].user?.user_metadata?.name || "Business Owner"}
                        />
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">
                          {review.replies[0].user?.user_metadata?.name || "Business Owner"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.replies[0].created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.replies[0].content}
                    </p>
                    
                    {/* Reply Actions */}
                    {isOwner && (
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editReply(review, review.replies![0])}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteReply(review.replies![0].id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Be the first to review {businessName}. Your feedback helps others make informed decisions.
              </p>
              <Button onClick={() => setShowReviewDialog(true)}>Write a Review</Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedReplyId ? "Edit Reply" : "Reply to Review"}
            </DialogTitle>
            <DialogDescription>
              Respond to customer feedback professionally and constructively.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Reply</label>
              <Textarea
                placeholder="Write your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {replyContent.length}/1000 characters
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleReplySubmit}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedReplyId ? "Update Reply" : "Submit Reply"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
} 