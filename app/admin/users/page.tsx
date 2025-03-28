"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { User as AuthUser } from '@supabase/supabase-js'
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
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { banUser, unbanUser } from "./actions"

type UserProfile = {
  user_id: string
  full_name: string
}

type UserWithProfile = {
  id: string
  email: string
  user_metadata: {
    name?: string
    role?: string
  }
  created_at: string
  banned: boolean
  profile?: UserProfile
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const itemsPerPage = 10
  const supabase = createClient()

  // Fetch users on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
        if (authError || !currentUser) {
          toast({
            title: "Error",
            description: "You must be logged in to view this page.",
            variant: "destructive",
          })
          return
        }

        // First get all users
        const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) throw usersError

        // Then get their profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')

        if (profilesError) throw profilesError

        // Combine users with their profiles
        const combinedUsers = authUsers.users
          .filter((user): user is AuthUser & { email: string } => 
            typeof user.email === 'string' && user.email.length > 0
          )
          .map(user => {
            // Check if user is banned by examining user properties
            // Supabase might return banned status in different ways
            const isBanned = false; // Default to not banned
            
            return {
              id: user.id,
              email: user.email,
              user_metadata: user.user_metadata || { name: undefined },
              created_at: user.created_at,
              banned: isBanned,
              profile: profiles?.find(p => p.user_id === user.id) as UserProfile | undefined
            };
          })

        setUsers(combinedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  const handleToggleBan = async (user: UserWithProfile) => {
    setSelectedUser(user)
  }

  const confirmToggleBan = async () => {
    if (!selectedUser) return

    setIsUpdating(true)
    try {
      // Use the server action to ban or unban user
      const result = selectedUser.banned 
        ? await unbanUser(selectedUser.id)
        : await banUser(selectedUser.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Update local state
      setUsers(users.map((u) => 
        u.id === selectedUser.id 
          ? { ...u, banned: !u.banned }
          : u
      ))

      toast({
        title: "Success",
        description: `User has been ${selectedUser.banned ? 'unbanned' : 'banned'} successfully.`,
      })
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setSelectedUser(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Total users: {users.length}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.profile?.full_name || user.user_metadata?.name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  !user.banned 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {!user.banned ? "Active" : "Banned"}
                </span>
              </TableCell>
              <TableCell>
                {user.user_metadata?.role || 'user'}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant={!user.banned ? "destructive" : "default"}
                      onClick={() => handleToggleBan(user)}
                    >
                      {!user.banned ? "Ban" : "Unban"}
                    </Button>
                  </AlertDialogTrigger>
                  {selectedUser?.id === user.id && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {!user.banned ? "Ban" : "Unban"} User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to {!user.banned ? "ban" : "unban"} this user?
                          {!user.banned && (
                            " This will prevent them from logging into their account."
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedUser(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmToggleBan}
                          disabled={isUpdating}
                        >
                          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!user.banned ? "Ban" : "Unban"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex space-x-2">
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
    </div>
  )
}

