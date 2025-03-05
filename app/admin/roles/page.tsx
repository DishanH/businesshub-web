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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { updateUserRole } from "../actions"

type UserWithProfile = {
  id: string
  email: string
  user_metadata: {
    name?: string
    role?: string
  }
  created_at: string
  profile?: {
    user_id: string
    full_name: string
    role: string
    is_active: boolean
  }
}

type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function RolesPage() {
  const [users, setUsers] = useState<UserWithProfile[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const itemsPerPage = 10
  const supabase = createClient()

  // Fetch users and roles on component mount
  useEffect(() => {
    async function fetchData() {
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

        // Get admin status
        const { data: adminProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', currentUser.id)
          .single()
        
        if (profileError || adminProfile.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          return
        }

        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .order('name')

        if (rolesError) throw rolesError
        setRoles(rolesData || [])

        // First get all users
        const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) throw usersError

        // Then get their profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, role, is_active')

        if (profilesError) throw profilesError

        // Combine users with their profiles
        const combinedUsers = authUsers.users
          .filter((user): user is AuthUser & { email: string } => 
            typeof user.email === 'string' && user.email.length > 0
          )
          .map(user => ({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata || { name: undefined },
            created_at: user.created_at,
            profile: profiles?.find(p => p.user_id === user.id)
          }))

        setUsers(combinedUsers)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId)
    try {
      const result = await updateUserRole(userId, newRole as 'user' | 'business' | 'admin')

      if (!result.success) {
        throw new Error(result.error)
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              user_metadata: { ...user.user_metadata, role: newRole }
            } 
          : user
      ))

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      })
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingUserId(null)
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
            <BreadcrumbPage>User Roles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Roles</h1>
        <Button asChild>
          <Link href="/admin/roles/settings">Manage Role Definitions</Link>
        </Button>
      </div>

      <p className="text-muted-foreground">Total users: {users.length}</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Role</TableHead>
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
                  user.profile?.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {user.profile?.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                {user.user_metadata?.role || 'user'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={user.user_metadata?.role || 'user'}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={updatingUserId === user.id}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updatingUserId === user.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
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