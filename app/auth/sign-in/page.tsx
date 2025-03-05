"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AuthDialog } from "@/components/AuthDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      }
    };
    
    checkUser();
  }, [router, supabase.auth, redirect]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Please sign in to your account
        </p>
      </div>

      {error && (
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error === 'Account is inactive' 
                ? 'Your account has been deactivated. Please contact support for assistance.'
                : error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <AuthDialog 
            defaultTab="sign-in" 
            open={open} 
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) router.push("/");
            }} 
          />
        </div>
      </div>
    </div>
  );
} 