"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthDialog } from "@/components/AuthDialog";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    
    checkUser();
  }, [router, supabase.auth]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Join our community today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <AuthDialog 
            defaultTab="sign-up" 
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