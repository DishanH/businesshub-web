"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getBusinessPosts, toggleBusinessPostActive } from "@/lib/data"
import type { BusinessPost } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function BusinessPostsPage() {
  const [posts, setPosts] = useState<BusinessPost[]>(getBusinessPosts())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleToggleActive = (id: string) => {
    const updatedPost = toggleBusinessPostActive(id)
    if (updatedPost) {
      setPosts(posts.map((p) => (p.id === id ? updatedPost : p)))
    }
  }

  const paginatedPosts = posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(posts.length / itemsPerPage)

  const BusinessPostPreview = ({ post }: { post: BusinessPost }) => (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold mb-2">{post.businessName}</p>
        <p className="text-sm text-muted-foreground">{post.content}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Business Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Posts</h1>
        <Link href="/admin/business-posts/new">
          <Button>Add Business Post</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPosts.map((post, index) => (
            <TableRow key={post.id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.businessName}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${post.active ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                {post.active ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Business Post Preview</DialogTitle>
                      <DialogDescription>Preview of the business post details</DialogDescription>
                    </DialogHeader>
                    <BusinessPostPreview post={post} />
                  </DialogContent>
                </Dialog>
                <Link href={`/admin/business-posts/${post.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {post.active ? "Deactivate" : "Activate"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{post.active ? "Deactivate" : "Activate"} Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to {post.active ? "deactivate" : "activate"} this post? This action can be
                        reversed later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleToggleActive(post.id)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

