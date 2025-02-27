"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock reviews for demonstration
const mockReviews = [
  { id: 1, author: "John Doe", rating: 5, content: "Great service and delicious cakes!" },
  { id: 2, author: "Jane Smith", rating: 4, content: "Good variety of flavors, but a bit pricey." },
]

export default function ReviewSection({ businessId }: { businessId: number }) {
  const [rating, setRating] = useState("5")
  const [review, setReview] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement review submission logic
    console.log("Review submitted:", { businessId, rating, review })
    // Reset form
    setRating("5")
    setReview("")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="font-semibold">{review.author}</span>
            </div>
            <p>{review.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold">Leave a Review</h3>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} {value === 1 ? "Star" : "Stars"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <Button type="submit">Submit Review</Button>
      </form>
    </div>
  )
}

