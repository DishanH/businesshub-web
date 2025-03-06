"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  role: "user" | "business" | "admin"
) {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Update user metadata only
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role } }
    );

    if (updateUserError) throw updateUserError;

    // Revalidate admin pages
    revalidatePath("/admin/roles");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Create a new role
 */
export async function createRole(roleData: {
  name: string;
  description: string;
  permissions: string[];
}) {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Check if role already exists
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleData.name)
      .single();

    if (roleError && roleError.code !== "PGRST116") throw roleError;
    if (role) throw new Error(`Role "${roleData.name}" already exists`);

    // Create new role
    const { data: newRole, error: createError } = await supabase
      .from("roles")
      .insert({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Revalidate admin pages
    revalidatePath("/admin/roles/settings");

    return { success: true, role: newRole };
  } catch (error) {
    console.error("Error creating role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Update role permissions
 */
export async function updateRolePermissions(
  roleId: string,
  permissions: string[]
) {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Update role permissions
    const { error: updateError } = await supabase
      .from("roles")
      .update({ permissions })
      .eq("id", roleId);

    if (updateError) throw updateError;

    // Revalidate admin pages
    revalidatePath("/admin/roles/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating role permissions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string) {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Get the role name
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("name")
      .eq("id", roleId)
      .single();

    if (roleError) throw roleError;

    // Check if role is in use by listing all users
    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers();

    if (usersError) throw usersError;

    // Filter users with the role in their metadata
    const usersWithRole = users.filter(
      (u) => u.user_metadata && u.user_metadata.role === role.name
    );

    if (usersWithRole.length > 0) {
      throw new Error("Cannot delete role that is assigned to users");
    }

    // Delete role
    const { error: deleteError } = await supabase
      .from("roles")
      .delete()
      .eq("id", roleId);

    if (deleteError) throw deleteError;

    // Revalidate admin pages
    revalidatePath("/admin/roles/settings");

    return { success: true };
  } catch (error) {
    console.error("Error deleting role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Fetch all roles
 */
export async function fetchRoles() {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Fetch roles using direct SQL query to bypass RLS
    const { data: roles, error: rolesError } = await supabase.rpc(
      "admin_get_roles"
    );

    if (rolesError) {
      console.error("RPC error:", rolesError);

      // Fallback to regular query if RPC doesn't exist
      const { data: fallbackRoles, error: fallbackError } = await supabase
        .from("roles")
        .select("*")
        .order("name");

      if (fallbackError) throw fallbackError;

      return { success: true, roles: fallbackRoles };
    }

    return { success: true, roles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      roles: [],
    };
  }
}

/**
 * Fetch all users with their roles
 */
export async function fetchUsersWithRoles() {
  try {
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Get admin status from user metadata
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin") throw new Error("Admin access required");

    // Instead of using admin.listUsers(), use a direct SQL query with RLS bypass
    // This avoids the need for a service role key
    const { data: users, error: usersError } = await supabase.rpc(
      "admin_list_users"
    );

    if (usersError) {
      console.error("RPC error:", usersError);
      throw new Error("Failed to fetch users: " + usersError.message);
    }

    // Define type for user from RPC
    type UserFromRPC = {
      id: string;
      email: string | null;
      user_metadata: Record<string, unknown> | null;
      created_at: string;
    };

    // Map users to include role from metadata
    const usersWithRoles = (users || []).map((user: UserFromRPC) => ({
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata || {},
      created_at: user.created_at,
      role: user.user_metadata?.role || "user",
    }));

    return { success: true, users: usersWithRoles };
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      users: [],
    };
  }
}

/**
 * Create a user profile if it doesn't exist
 */
export async function createUserProfileIfNotExists(
  userId: string,
  fullName: string,
  email: string
) {
  try {
    const supabase = await createClient();

    // Check if current user is admin or the user themselves
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication required");

    // Only allow admin or the user themselves to create their profile
    const userRole = user?.user_metadata?.role || "user";
    if (userRole !== "admin" && user?.id !== userId) {
      throw new Error("Permission denied");
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") throw profileError;

    // If profile doesn't exist, create it
    if (!profile) {
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          full_name: fullName,
          email: email,
        });

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
