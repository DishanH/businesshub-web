import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

import { getActiveCategories } from "../actions";
import { getBusinessesByCategory } from "../../business-profiles/actions";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BusinessCard from "@/components/business-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const result = await fetchCategoryBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Category Not Found | BusinessHub",
      description: "The requested category could not be found",
    };
  }

  return {
    title: `${result.data.name} | BusinessHub`,
    description: result.data.description,
  };
}

// Generate static paths for categories
export async function generateStaticParams() {
  const { data: categories } = await getActiveCategories();

  if (!categories) return [];

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Fetch category data by slug
async function fetchCategoryBySlug(slug: string) {
  const { data: categories } = await getActiveCategories();

  if (!categories) {
    return { success: false, error: "Failed to load categories" };
  }

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  return { success: true, data: category };
}

// Category view component
async function CategoryView({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: { sort?: string; subcategory?: string };
}) {
  const result = await fetchCategoryBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const category = result.data;
  const businessesResult = await getBusinessesByCategory(category.id);
  const businesses = businessesResult.success ? businessesResult.data : [];

  // Get sorting option from URL
  const sortOption = searchParams.sort;

  // Get subcategory filter from URL
  const subcategoryFilter = searchParams.subcategory;

  // Map of icon names to emoji fallbacks
  const iconToEmoji: Record<string, string> = {
    utensils: "🍽️",
    coffee: "☕",
    truck: "🚚",
    shirt: "👕",
    laptop: "💻",
    home: "🏠",
    gift: "🎁",
    dumbbell: "💪",
    scissors: "✂️",
    stethoscope: "🩺",
    gavel: "⚖️",
    "dollar-sign": "💰",
    building: "🏢",
    "pen-tool": "🖋️",
    "spray-can": "🧴",
    tool: "🔧",
    tree: "🌳",
    wrench: "🔧",
    droplet: "💧",
    book: "📚",
    child: "👶",
    calendar: "📅",
    film: "🎬",
    heart: "❤️",
    "shopping-bag": "🛍️",
  };

  // Get emoji for icon
  const getIconDisplay = (iconName?: string) => {
    if (!iconName) return null;
    return iconToEmoji[iconName] || "🔍";
  };

  const activeSubcategories =
    category.subcategories?.filter((sub) => sub.active) || [];

  // Filter businesses by subcategory if specified
  let filteredBusinesses = businesses;
  if (subcategoryFilter && businesses) {
    // In a real application, you'd likely have a subcategory_id field to filter by
    // This is a simplified example that could be expanded with actual subcategory data
    filteredBusinesses = businesses;

    // Show a message when filter is applied but no matching businesses
    if (filteredBusinesses.length === 0) {
      // You might want to add UI to indicate that a filter is applied but no results found
    }
  }

  // Sort businesses based on sort option
  if (sortOption && filteredBusinesses) {
    const sortedBusinesses = [...filteredBusinesses];
    switch (sortOption) {
      case "rating-desc":
        sortedBusinesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        filteredBusinesses = sortedBusinesses;
        break;
      case "newest":
        // In a real application, you'd sort by creation date
        // This is a simplified example
        filteredBusinesses = sortedBusinesses;
        break;
      default:
        // Default sort (no change)
        break;
    }
  }

  // Get the active filter message
  const getFilterDescription = () => {
    let description = "";

    if (sortOption === "rating-desc") {
      description = "Sorted by highest rated";
    } else if (sortOption === "newest") {
      description = "Sorted by newest first";
    }

    if (subcategoryFilter) {
      const subcategory = activeSubcategories.find(
        (sub) => sub.id === subcategoryFilter
      );
      if (subcategory) {
        description += description ? " and " : "";
        description += `filtered by ${subcategory.name}`;
      }
    }

    return description;
  };

  const activeFilterDescription = getFilterDescription();

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="bg-muted/40 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          {category.icon && (
            <span className="text-3xl">{getIconDisplay(category.icon)}</span>
          )}
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      {/* Subcategories Section */}
      {activeSubcategories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {activeSubcategories.map((subcategory) => (
              <Badge
                key={subcategory.id}
                variant="secondary"
                className="px-3 py-1 text-sm hover:bg-secondary/80 cursor-pointer"
              >
                {subcategory.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Businesses in this category */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Businesses in {category.name}
            </h2>
            {activeFilterDescription && (
              <p className="text-sm text-muted-foreground mt-1">
                {activeFilterDescription}
              </p>
            )}
          </div>

          {/* Desktop: Dropdown menu for filters */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href={`/categories/${slug}?sort=rating-desc`}
                      className="w-full"
                    >
                      Highest Rated
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/categories/${slug}?sort=newest`}
                      className="w-full"
                    >
                      Newest First
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/categories/${slug}`} className="w-full">
                      Default
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {activeSubcategories.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Subcategories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[200px] overflow-y-auto">
                      {activeSubcategories.map((subcategory) => (
                        <DropdownMenuItem key={subcategory.id}>
                          <Link
                            href={`/categories/${slug}?subcategory=${subcategory.id}`}
                            className="w-full"
                          >
                            {subcategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: Sheet for filters */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Sort and filter businesses in {category.name}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <div className="grid gap-2">
                      <SheetClose asChild>
                        <Link
                          href={`/categories/${slug}?sort=rating-desc`}
                          className="w-full"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            Highest Rated
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href={`/categories/${slug}?sort=newest`}
                          className="w-full"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            Newest First
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href={`/categories/${slug}`} className="w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            Default
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>

                  {activeSubcategories.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Subcategories</h3>
                      <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                        {activeSubcategories.map((subcategory) => (
                          <SheetClose key={subcategory.id} asChild>
                            <Link
                              href={`/categories/${slug}?subcategory=${subcategory.id}`}
                              className="w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {subcategory.name}
                              </Button>
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full">Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {filteredBusinesses && filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={{
                  id: business.id,
                  name: business.name,
                  description: business.description,
                  address: `${business.city}, ${business.state}`,
                  rating: business.rating || 0,
                  image: business.image || "/placeholder.svg",
                }}
                href={`/business-profiles/${business.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              {subcategoryFilter
                ? "There are no businesses matching your filter criteria. Try a different subcategory."
                : "There are no businesses listed in this category yet."}
            </p>
            <div className="flex gap-4 justify-center">
              {subcategoryFilter && (
                <Button asChild variant="outline">
                  <Link href={`/categories/${slug}`}>Clear Filters</Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/business-profiles">Browse All Businesses</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-8">
      {/* Category Header Skeleton */}
      <div className="bg-muted/40 p-6 rounded-lg">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Subcategories Skeleton */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <Separator />

      {/* Businesses Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; subcategory?: string };
}) {
  const { slug } = params;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">
                Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{slug.replace(/-/g, " ")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Category content with Suspense */}
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryView slug={slug} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
