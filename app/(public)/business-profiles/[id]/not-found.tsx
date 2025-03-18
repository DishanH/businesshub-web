import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";

export default function BusinessProfileNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="relative">
        <Building2 className="h-24 w-24 text-muted-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-destructive">!</span>
          </div>
        </div>
      </div>
      
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Business Profile Not Found</h1>
      <p className="mt-2 text-muted-foreground max-w-[500px]">
        We couldn&apos;t find the business profile you&apos;re looking for. It might have been deleted or moved.
      </p>
      
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/business-profiles">
            <Building2 className="mr-2 h-4 w-4" />
            View All Profiles
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
} 