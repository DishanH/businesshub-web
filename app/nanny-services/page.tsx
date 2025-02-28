import { Metadata } from "next"
import NannyFilters from "./components/NannyFilters"
import NannyGrid from "./components/NannyGrid"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, BookmarkCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Nanny Services | BusinessHub",
  description: "Find experienced and caring nannies in your area",
}

export default async function NannyServicesPage() {
  // In the future, this will fetch data from the database
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-foreground">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nanny Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nanny Services</h1>
            <p className="text-muted-foreground mt-2">
              Find experienced and caring nannies in your area
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="default" 
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gradient-to-r from-indigo-500/90 via-purple-500 to-pink-500/90 hover:from-indigo-600/90 hover:via-purple-600 hover:to-pink-600/90" 
              asChild
            >
              <Link href="/nanny-services/create-profile">
                <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">Get Started</span>
              </Link>
            </Button>
            <Link href="/nanny-services/favorites">
              <Button variant="outline" className="flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5" />
                <span>Liked Nannies</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-6">
          <NannyFilters />
          <NannyGrid />
        </div>
      </div>
    </div>
  )
} 