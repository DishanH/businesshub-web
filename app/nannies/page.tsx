import { Metadata } from "next"
import Link from "next/link"
import { Heart, ArrowLeft, Filter, Star, Clock, DollarSign, MapPin, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import NannyGrid from "./components/NannyGrid"

export const metadata: Metadata = {
  title: "Find Nannies | BusinessHub",
  description: "Find experienced and caring nannies for your children",
}

export default function NanniesPage() {
  return (
    <div className="container py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nannies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Top Panel - Title and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Nannies</h1>
          <p className="text-muted-foreground">
            Find experienced and caring nannies for your children
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/nannies/favorites">
              <Heart className="mr-2 h-4 w-4" />
              Liked Nannies
            </Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/nannies/create-profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create Nanny Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </h3>
              <Button variant="ghost" size="sm">Reset</Button>
            </div>

            <Accordion type="multiple" className="w-full">
              {/* Rating Filter */}
              <AccordionItem value="rating">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Rating
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-4" />
                      <Label htmlFor="rating-4" className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="ml-2">& Up</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rating-3" />
                      <Label htmlFor="rating-3" className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          {[1, 2].map((star) => (
                            <Star key={star} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2">& Up</span>
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Specialties Filter */}
              <AccordionItem value="specialties">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Specialties
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {["Newborns", "Toddlers", "School Age", "Special Needs", "Homework Help", "Arts & Crafts", "Music Education", "Multiple Children"].map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox id={`specialty-${specialty}`} />
                        <Label htmlFor={`specialty-${specialty}`}>{specialty}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Availability Filter */}
              <AccordionItem value="availability">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Availability
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="availability-all" />
                      <Label htmlFor="availability-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="availability-full-time" />
                      <Label htmlFor="availability-full-time">Full-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="availability-part-time" />
                      <Label htmlFor="availability-part-time">Part-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="availability-flexible" />
                      <Label htmlFor="availability-flexible">Flexible</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              {/* Hourly Rate Filter */}
              <AccordionItem value="hourly-rate">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Hourly Rate
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <Slider defaultValue={[20, 40]} min={15} max={50} step={1} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$15</span>
                      <span className="text-sm font-medium">$20 - $40</span>
                      <span className="text-sm">$50+</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Location Filter */}
              <AccordionItem value="location">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {["Downtown", "North York", "Scarborough", "Etobicoke", "Mississauga", "Markham"].map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox id={`location-${location}`} />
                        <Label htmlFor={`location-${location}`}>{location}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Languages Filter */}
              <AccordionItem value="languages">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center">
                    <Languages className="mr-2 h-4 w-4" />
                    Languages
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {["English", "French", "Spanish", "Mandarin", "Cantonese", "Hindi", "Arabic"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox id={`language-${language}`} />
                        <Label htmlFor={`language-${language}`}>{language}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button className="w-full mt-6">Apply Filters</Button>
          </div>
        </div>

        {/* Main Content */}
        <NannyGrid />
      </div>
    </div>
  )
} 