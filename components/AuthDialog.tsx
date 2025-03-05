"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AuthError } from "@supabase/supabase-js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, LogIn, Mail, User } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sign In Form Schema
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// Sign Up Form Schema
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  // Commented out confirmPassword field
  // confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface AuthDialogProps {
  defaultTab?: "sign-in" | "sign-up";
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthDialog({ 
  defaultTab = "sign-in", 
  trigger, 
  open, 
  onOpenChange 
}: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Sign In Form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleEmailSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (values: SignUpFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: 'user'
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      router.push("/auth/verify-email");
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "facebook" | "github") => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="p-0 sm:max-w-[900px] overflow-hidden">
        <div className="flex h-[700px]">
          {/* Left side - Image */}
          <div className="relative hidden md:block w-[45%] bg-gradient-to-br from-indigo-100 to-blue-100">
            <div className="absolute inset-0 bg-white/10" />
            <Image 
              src="/images/auth-background.svg" 
              alt="Authentication" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute bottom-8 left-8 right-8 text-indigo-900">
              <h3 className="text-2xl font-bold mb-2">Business Hub</h3>
              <p className="text-sm opacity-80">Manage your business efficiently with our comprehensive suite of tools.</p>
            </div>
          </div>
          
          {/* Right side - Auth forms */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <DialogHeader className="p-0 space-y-1">
                <DialogTitle className="text-2xl font-bold">
                  {activeTab === "sign-in" ? "Welcome back" : "Create account"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "sign-in" 
                    ? "Sign in to access your account" 
                    : "Sign up to get started with Business Hub"}
                </p>
              </DialogHeader>
            </div>
            
            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth("google")}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() => handleSocialAuth("facebook")}
                className="w-full"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
            
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sign-in" | "sign-up")} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="sign-in" className="space-y-2 mt-0 h-full px-1">
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(handleEmailSignIn)} className="space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <Button
                                variant="link"
                                className="px-0 font-normal h-auto"
                                type="button"
                                onClick={() => router.push("/auth/forgot-password")}
                              >
                                Forgot password?
                              </Button>
                            </div>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {error && (
                        <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
                          {error}
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={loading}
                        size="lg"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="sign-up" className="space-y-4 mt-0 h-full">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleEmailSignUp)} className="space-y-4 px-1">
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Commented out confirm password field to save space
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      */}
                      {error && (
                        <div className="text-sm font-medium text-destructive p-2 bg-destructive/10 rounded-md">
                          {error}
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={loading}
                        size="lg"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 