import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | BusinessHub",
  description: "Explore our range of services for your needs",
};

// Service categories with descriptions
const serviceCategories = [
  {
    id: "nanny-services",
    title: "Nanny Services",
    description: "Find experienced and caring nannies for your children",
    icon: "👶",
    color: "bg-pink-100",
  },
  {
    id: "home-services",
    title: "Home Services",
    description: "Professional services for home maintenance and improvement",
    icon: "🏠",
    color: "bg-blue-100",
  },
  {
    id: "health-services",
    title: "Health Services",
    description: "Healthcare professionals and wellness services",
    icon: "🏥",
    color: "bg-green-100",
  },
  {
    id: "professional-services",
    title: "Professional Services",
    description: "Legal, financial, and business consulting services",
    icon: "💼",
    color: "bg-purple-100",
  },
  {
    id: "education-services",
    title: "Education Services",
    description: "Tutoring, training, and educational resources",
    icon: "📚",
    color: "bg-yellow-100",
  },
  {
    id: "other-services",
    title: "Other Services",
    description: "Explore additional specialized services",
    icon: "🔍",
    color: "bg-gray-100",
  },
];

export default function ServicesPage() {
  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover a wide range of services to meet your personal and professional needs
        </p>
      </section>

      {/* Service Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse Services by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className={`${category.color} pb-2`}>
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-4">
                <Button asChild>
                  <Link href={`/services/${category.id}`}>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Services</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Nanny Services Feature */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-pink-100 flex items-center justify-center">
              <span className="text-6xl">👶</span>
            </div>
            <CardHeader>
              <CardTitle>Nanny Services</CardTitle>
              <CardDescription>Find the perfect caregiver for your children</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                Our nanny services connect families with experienced, vetted childcare professionals. 
                Whether you need full-time, part-time, or occasional care, we have the right match for your family.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/services/nanny-services">
                  View Nanny Services
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Home Services Feature */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <span className="text-6xl">🏠</span>
            </div>
            <CardHeader>
              <CardTitle>Home Services</CardTitle>
              <CardDescription>Professional home maintenance and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                From plumbing and electrical work to cleaning and landscaping, our home services 
                providers deliver quality work to keep your home in perfect condition.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/services/home-services">
                  View Home Services
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Other Services Feature */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">🔍</span>
            </div>
            <CardHeader>
              <CardTitle>Other Services</CardTitle>
              <CardDescription>Explore our specialized service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">
                Discover a variety of specialized services tailored to meet your unique needs. 
                From event planning to pet care, we've got you covered with trusted professionals.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/services/other-services">
                  View Other Services
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Offer Your Services</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Are you a service provider? Join BusinessHub to reach more customers and grow your business.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/owner/services/create">
            Add Your Service
          </Link>
        </Button>
      </section>
    </div>
  );
} 