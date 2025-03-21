"use client"

import { useState } from "react"
import { 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  Star,
  AlertCircle,
  CheckCircle2,
  EyeOff,
  Eye
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toggleTestimonialActive, updateTestimonialStatus } from "@/app/actions/testimonials"
import { useToast } from "@/components/ui/use-toast"

// Testimonial type definition
type Testimonial = {
  id: string
  name: string
  email: string
  role: string
  business: string | null
  text: string
  rating: number
  date: string
  category: 'business-owner' | 'customer'
  featured: boolean
  status: 'pending' | 'approved' | 'rejected'
  active: boolean
  image: string
  created_at: string
}

// Toggle Testimonial Active State Button
function ToggleTestimonialStateButton({ id, isActive }: { id: string; isActive: boolean }) {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  async function handleToggle() {
    try {
      setIsPending(true)
      const result = await toggleTestimonialActive(id, isActive)
      
      if (result.success) {
        toast({
          title: result.message,
          description: isActive 
            ? "This testimonial will no longer be visible to users." 
            : "This testimonial is now visible to users.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update testimonial status",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }
  
  return (
    <Button 
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      title={isActive ? "Deactivate testimonial" : "Activate testimonial"}
    >
      {isActive ? (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="sr-only">
        {isActive ? "Deactivate" : "Activate"} testimonial
      </span>
    </Button>
  )
}

// Update Testimonial Status Button
function UpdateStatusButton({ 
  id, 
  status, 
  currentStatus, 
  children 
}: { 
  id: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  currentStatus: string;
  children: React.ReactNode;
}) {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  
  // Don't show the option if it's already in that status
  if (status === currentStatus) {
    return null
  }
  
  async function handleUpdateStatus() {
    try {
      setIsPending(true)
      const result = await updateTestimonialStatus(id, status)
      
      if (result.success) {
        toast({
          title: result.message,
          description: `Testimonial status updated to ${status}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update testimonial status",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }
  
  return (
    <div onClick={handleUpdateStatus} className={isPending ? "opacity-50 pointer-events-none" : ""}>
      {children}
    </div>
  )
}

function StatusBadge({ status, active }: { status: string; active: boolean }) {
  if (!active) {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
        Inactive
      </Badge>
    )
  }
  
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    default:
      return null
  }
}

function UpdateStatusDropdown({ id, currentStatus }: { id: string; currentStatus: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UpdateStatusButton id={id} status="approved" currentStatus={currentStatus}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </DropdownMenuItem>
        </UpdateStatusButton>
        
        <UpdateStatusButton id={id} status="rejected" currentStatus={currentStatus}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </DropdownMenuItem>
        </UpdateStatusButton>
        
        <UpdateStatusButton id={id} status="pending" currentStatus={currentStatus}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Mark as Pending
          </DropdownMenuItem>
        </UpdateStatusButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TestimonialAdminList({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter testimonials based on active tab
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return testimonial.status === "pending"
    if (activeTab === "approved") return testimonial.status === "approved"
    if (activeTab === "rejected") return testimonial.status === "rejected"
    return true
  })
  
  // Count testimonials by status
  const pendingCount = testimonials.filter(t => t.status === "pending").length
  const approvedCount = testimonials.filter(t => t.status === "approved").length
  const rejectedCount = testimonials.filter(t => t.status === "rejected").length

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">
          All Testimonials ({testimonials.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingCount})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approvedCount})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({rejectedCount})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab}>
        <Card>
          <CardHeader className="px-6 py-4 bg-muted/30 border-b">
            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
              <div className="col-span-3">User</div>
              <div className="col-span-4">Testimonial</div>
              <div className="col-span-1 text-center">Rating</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {filteredTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No testimonials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id} className={!testimonial.active ? "bg-muted/50" : ""}>
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 border border-primary/10">
                            <AvatarImage src={testimonial.image} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                {testimonial.category === "business-owner" ? "Business" : "Customer"}
                              </Badge>
                              {testimonial.featured && (
                                <Badge variant="secondary" className="text-xs py-0 h-5">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {testimonial.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(testimonial.date).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {Array(testimonial.rating).fill(0).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={testimonial.status} active={testimonial.active} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ToggleTestimonialStateButton 
                            id={testimonial.id} 
                            isActive={testimonial.active} 
                          />
                          <UpdateStatusDropdown 
                            id={testimonial.id}
                            currentStatus={testimonial.status}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 