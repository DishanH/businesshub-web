"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get role directly from user metadata
          const userRole = user.user_metadata?.role || 'user';
          setIsAdmin(userRole === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserRole();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || 'user';
        setIsAdmin(userRole === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Button variant="outline" className="bg-gradient-to-r from-indigo-500/90 via-purple-500 to-pink-500/90 hover:from-indigo-600/90 hover:via-purple-600 hover:to-pink-600/90" asChild>
      <Link href="/admin">
        <Shield className="mr-2 h-4 w-4" />
        Admin
      </Link>
    </Button>
  );
} 