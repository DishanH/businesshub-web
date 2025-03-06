"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { createRole, updateRolePermissions, deleteRole, fetchRoles } from "@/app/admin/actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

type RoleDefinition = {
  id: string
  name: string
  description: string
  permissions: string[]
}

// Available permissions in the system
const availablePermissions = [
  { id: "view_users", label: "View Users" },
  { id: "manage_users", label: "Manage Users" },
  { id: "view_businesses", label: "View Businesses" },
  { id: "manage_businesses", label: "Manage Businesses" },
  { id: "view_content", label: "View Content" },
  { id: "manage_content", label: "Manage Content" },
  { id: "admin_access", label: "Admin Access" },
]

export default function RolesSettingsPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to access this page.",
            variant: "destructive",
          })
          router.push('/auth/sign-in')
          return
        }

        // Check if user is admin
        const userRole = user.user_metadata?.role || 'user'
        if (userRole !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          router.push('/')
          return
        }

        // Fetch roles using server action
        const { success, roles: rolesData, error: rolesError } = await fetchRoles()
        
        if (!success) {
          throw new Error(rolesError || 'Failed to fetch roles')
        }
        
        setRoles(rolesData || [])
      } catch (error) {
        console.error('Error fetching roles:', error)
        toast({
          title: "Error",
          description: "Failed to load roles data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, router])

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const result = await createRole({
        name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: []
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      // Add new role to state
      if (result.role) {
        setRoles([...roles, result.role])
      }

      // Reset form
      setNewRoleName("")
      setNewRoleDescription("")

      toast({
        title: "Success",
        description: "Role created successfully",
      })
    } catch (error) {
      console.error('Error creating role:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create role",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleTogglePermission = async (roleId: string, permissionId: string, hasPermission: boolean) => {
    setUpdatingRoleId(roleId)
    try {
      const role = roles.find(r => r.id === roleId)
      if (!role) return

      // Update permissions
      const updatedPermissions = hasPermission
        ? role.permissions.filter(p => p !== permissionId)
        : [...role.permissions, permissionId]

      const result = await updateRolePermissions(roleId, updatedPermissions)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Update state
      setRoles(roles.map(r => 
        r.id === roleId 
          ? { ...r, permissions: updatedPermissions }
          : r
      ))

      toast({
        title: "Success",
        description: "Role permissions updated",
      })
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update permissions",
        variant: "destructive",
      })
    } finally {
      setUpdatingRoleId(null)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
      return
    }

    setUpdatingRoleId(roleId)
    try {
      const result = await deleteRole(roleId)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Remove role from state
      setRoles(roles.filter(r => r.id !== roleId))

      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting role:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      })
    } finally {
      setUpdatingRoleId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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
            <BreadcrumbLink href="/admin/roles">User Roles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Role Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Role Settings</h1>
      </div>

      {/* Create new role */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
          <CardDescription>
            Add a new role to the system. You can configure permissions after creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g., Editor, Moderator"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Describe the role's purpose"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateRole} 
            disabled={isCreating || !newRoleName.trim()}
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </CardFooter>
      </Card>

      {/* Existing roles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRole(role.id)}
                  disabled={updatingRoleId === role.id || ['admin', 'user', 'business'].includes(role.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Permissions</h4>
                <div className="grid gap-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <Label htmlFor={`${role.id}-${permission.id}`} className="flex-1">
                        {permission.label}
                      </Label>
                      <Switch
                        id={`${role.id}-${permission.id}`}
                        checked={role.permissions.includes(permission.id)}
                        onCheckedChange={() => 
                          handleTogglePermission(role.id, permission.id, role.permissions.includes(permission.id))
                        }
                        disabled={updatingRoleId === role.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 