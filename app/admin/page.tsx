import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Layers, Users, FileText, UserIcon, MessageSquareQuote, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <Layers className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Categories</div>
            <p className="text-sm text-muted-foreground">
              Create, edit and organize business categories and subcategories
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Users</div>
            <p className="text-sm text-muted-foreground">
              View and manage user accounts, permissions and activity
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Posts</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Posts</div>
            <p className="text-sm text-muted-foreground">
              Review, moderate and manage business posts and announcements
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/business-posts">Manage Posts</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Owners</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Businesses</div>
            <p className="text-sm text-muted-foreground">
              Oversee business accounts, verify credentials and manage listings
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/business-owners">Manage Businesses</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <MessageSquareQuote className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Testimonials</div>
            <p className="text-sm text-muted-foreground">
              Review, approve and moderate user testimonials and feedback
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/testimonials">Manage Testimonials</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col h-[240px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-2">Manage Roles</div>
            <p className="text-sm text-muted-foreground">
              Configure user roles, permission levels and access controls
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary">
              <Link href="/admin/roles">Manage Roles</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

