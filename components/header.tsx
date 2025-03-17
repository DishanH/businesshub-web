"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Baby, Heart, LogOut, LogIn } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminButton } from "@/components/AdminButton"
import { LocationSelector } from "@/components/location-selector"
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Fetch user data
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  useEffect(() => {
    // Simulating fetching notification count
    setNotificationCount(3)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/sign-in')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold">
            Local Business Hub
          </Link>
          <div className="hidden md:block">
            <LocationSelector />
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/nannies" className="flex items-center">
                <Baby className="h-4 w-4 mr-2" />
                Nannies
              </Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <AdminButton />
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/user/saved-posts">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href="/notifications">View all notifications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.user_metadata?.name || user.email || ''} />
                      <AvatarFallback>
                        {(user.user_metadata?.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-normal text-sm text-muted-foreground">
                      Signed in as
                    </span>
                    <span className="truncate">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/user/account">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/owner/business-profiles/manage">Business Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/user/account/ads">Manage Ads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/user/account/pages">Customize Pages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/site/privacy">Privacy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/site/contact">Contact Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => router.push('/auth/sign-in')}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
      {/* Mobile location selector */}
      <div className="md:hidden border-t py-2 px-4">
        <LocationSelector />
      </div>
    </header>
  )
}

