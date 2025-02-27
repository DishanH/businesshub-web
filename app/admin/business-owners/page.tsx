"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getBusinessOwners, getUsers, getBusinesses, getBusinessPosts } from "@/lib/data"
import type { BusinessOwner } from "@/lib/types"

export default function BusinessOwnersPage() {
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>(getBusinessOwners())
  const [locationFilter, setLocationFilter] = useState("")
  const users = getUsers()
  const businesses = getBusinesses()
  const posts = getBusinessPosts()

  const filteredBusinessOwners = businessOwners.filter((bo) =>
    bo.location.toLowerCase().includes(locationFilter.toLowerCase()),
  )

  const BusinessOwnerPreview = ({ businessOwnerId }: { businessOwnerId: string }) => {
    const businessOwner = businessOwners.find((bo) => bo.id === businessOwnerId)
    const user = users.find((u) => u.id === businessOwner?.userId)
    const business = businesses.find((b) => b.id === businessOwner?.businessId)

    return (
      <Card>
        <CardHeader>
          <CardTitle>{user?.name || "Business Owner"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Business:</strong> {business?.name}
          </p>
          <p>
            <strong>Location:</strong> {businessOwner?.location}
          </p>
        </CardContent>
      </Card>
    )
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
            <BreadcrumbPage>Business Owners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Owners</h1>
        <Input
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBusinessOwners.map((businessOwner) => {
            const user = users.find((u) => u.id === businessOwner.userId)
            const business = businesses.find((b) => b.id === businessOwner.businessId)
            const ownerPosts = posts.filter((p) => p.businessName === business?.name)

            return (
              <TableRow key={businessOwner.id}>
                <TableCell>{user?.name}</TableCell>
                <TableCell>{business?.name}</TableCell>
                <TableCell>{businessOwner.location}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Business Owner Preview</DialogTitle>
                          <DialogDescription>Details of the business owner</DialogDescription>
                        </DialogHeader>
                        <BusinessOwnerPreview businessOwnerId={businessOwner.id} />
                      </DialogContent>
                    </Dialog>
                    <Link href={`/admin/business-owners/${businessOwner.id}/posts`}>
                      <Button variant="outline" size="sm">
                        View Posts ({ownerPosts.length})
                      </Button>
                    </Link>
                    <Link href={`/admin/business-owners/${businessOwner.id}/messages`}>
                      <Button variant="outline" size="sm">
                        Messages
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

