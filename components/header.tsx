"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Heart, LogOut, LogIn, Newspaper, Home, Menu, Baby, Search } from "lucide-react"
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminButton } from "@/components/AdminButton"
import { HeaderLocationSelector } from "@/components/header-location-selector"
import { useLocation } from "@/components/location-context"
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { location } = useLocation()
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
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and desktop navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r  from-pink-500/90 to-blue-600">LocalHub</span>
          </Link>
          
          <div className="hidden md:block">
            <HeaderLocationSelector />
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            {/* <Button variant="ghost" size="sm" asChild className="h-9 px-3">
              <Link href="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button> */}
          </nav>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="hidden md:flex h-10 items-center px-4 rounded-full border-primary/30 bg-primary/5 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Link href={`/community?location=${location.id}`} className="flex items-center gap-1.5">
              <Newspaper className="h-4 w-4" />
              <span>Community</span>
            </Link>
          </Button>
          
          <AdminButton />
          
          <ThemeToggle />
          
          {/* Mobile menu button - visible on mobile only */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6">
                <HeaderLocationSelector />
                <div className="grid gap-2">
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="justify-start rounded-md border-primary/30 bg-primary/5 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Link href={`/community?location=${location.id}`} className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4" />
                      Community
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link href="/nannies" className="flex items-center gap-2">
                      <Baby className="h-4 w-4" />
                      Nannies
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/user/saved-posts">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
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
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Avatar className="h-7 w-7">
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
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/user/account">Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/owner/business-profiles/manage">Business Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/owner/business-profiles/analytics">Analytics & Performance</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/nannies">Nannies</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/site/privacy">Privacy</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/site/contact">Contact Us</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
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
              className="h-9 flex items-center gap-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => router.push('/auth/sign-in')}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

