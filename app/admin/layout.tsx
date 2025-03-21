import type { ReactNode } from "react"
import Link from "next/link"
import { Shield, LayoutDashboard, Layers, Users, FileText, Briefcase, MessageSquareQuote, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/categories", icon: Layers, label: "Categories" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/business-posts", icon: FileText, label: "Business Posts" },
  { href: "/admin/business-owners", icon: Briefcase, label: "Business Owners" },
  { href: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { href: "/admin/roles", icon: UserIcon, label: "User Roles" },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium",
                  "transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}

