"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createBusinessPost } from "@/lib/data"
import type { BusinessPost } from "@/lib/types"

export default function AddBusinessPostPage() {
  const router = useRouter()
  const [post, setPost] = useState<Omit<BusinessPost, "id">>({
    title: "",
    businessName: "",
    content: "",
    active: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createBusinessPost(post)
    router.push("/admin/business-posts")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/business-posts">Business Posts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Add New Business Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={post.businessName}
            onChange={(e) => setPost({ ...post, businessName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={post.active}
            onCheckedChange={(checked) => setPost({ ...post, active: checked as boolean })}
          />
          <Label htmlFor="active">Active</Label>
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  )
}

