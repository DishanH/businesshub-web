"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getBusinessOwnerById, getUsers, getBusinesses, getBusinessPosts } from "@/lib/data"
import type { BusinessPost } from "@/lib/types"

export default function BusinessOwnerPostsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const businessOwner = getBusinessOwnerById(params.id)
  const user = getUsers().find((u) => u.id === businessOwner?.userId)
  const business = getBusinesses().find((b) => b.id === businessOwner?.businessId)
  const [posts, setPosts] = useState<BusinessPost[]>(
    getBusinessPosts().filter((p) => p.businessName === business?.name),
  )
  const [titleFilter, setTitleFilter] = useState("")

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(titleFilter.toLowerCase()))

  if (!businessOwner || !user || !business) {
    return <div>Business owner not found</div>
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
            <BreadcrumbLink href="/admin/business-owners">Business Owners</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.name}&apos;s Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user.name}&apos;s Posts</h1>
        <Input
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${post.active ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                {post.active ? "Active" : "Inactive"}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/business-posts/${post.id}`)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

