"use client";

import { useState, useRef, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, CreditCard, ShoppingCart, Users, Building, Shield, Star } from "lucide-react";

// Define interfaces for our data
interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Handle mouse movement for 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXVal = (y - centerY) / 10;
    const rotateYVal = (centerX - x) / 10;
    
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Restart animations when isHovered changes
  useEffect(() => {
    if (cardRef.current) {
      const stars = cardRef.current.querySelectorAll('.star');
      stars.forEach((star) => {
        star.classList.remove('animate-pulse');
        setTimeout(() => {
          star.classList.add('animate-pulse');
        }, 10);
      });
    }
  }, [isHovered]);

  // Define FAQ categories
  const categories: FaqCategory[] = [
    {
      id: "all",
      name: "All Questions",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Browse all frequently asked questions"
    },
    {
      id: "account",
      name: "Account",
      icon: <Users className="h-5 w-5" />,
      description: "Managing your account and profile"
    },
    {
      id: "billing",
      name: "Billing",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Subscriptions, payments, and invoices"
    },
    {
      id: "services",
      name: "Services",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Our service offerings and features"
    },
    {
      id: "business",
      name: "Business Profiles",
      icon: <Building className="h-5 w-5" />,
      description: "Setting up and managing business profiles"
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: <Shield className="h-5 w-5" />,
      description: "Data protection and security measures"
    }
  ];

  // Sample FAQ data
  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: "How do I create a new account?",
      answer: "To create a new account, click on the 'Sign Up' button in the top right corner of our homepage. Fill in your details including your name, email address, and password. You'll receive a verification email to confirm your account. Once verified, you can log in and start using our services.",
      category: "account"
    },
    {
      id: "2",
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click on 'Forgot Password'. Enter the email associated with your account, and we'll send you a password reset link. Follow the instructions in the email to create a new password. For security reasons, password reset links expire after 24 hours.",
      category: "account"
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer: "We accept most major credit cards including Visa, Mastercard, American Express, and Discover. We also support payments through PayPal and direct bank transfers for annual subscriptions. All payment information is securely processed and encrypted using industry-standard protocols.",
      category: "billing"
    },
    {
      id: "4",
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Go to 'Billing' and select 'Manage Subscription'. Click on 'Cancel Subscription' and follow the prompts. You'll continue to have access to your account until the end of your current billing period. We don't offer refunds for partial months.",
      category: "billing"
    },
    {
      id: "5",
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Navigate to the 'Billing' section in your account settings and select 'Change Plan'. Choose the new plan that better suits your needs. If you're upgrading, you'll be charged the prorated difference immediately. If you're downgrading, the new rate will apply at your next billing cycle.",
      category: "billing"
    },
    {
      id: "6",
      question: "How do I add a new business profile?",
      answer: "To add a new business profile, go to the 'Business Profiles' section in your dashboard and click on 'Add New Profile'. Fill in your business details including name, address, contact information, and description. You can also upload your business logo and cover image. Once completed, click 'Save' and your new profile will be created.",
      category: "business"
    },
    {
      id: "7",
      question: "How can I optimize my business profile for better visibility?",
      answer: "To optimize your business profile, ensure all information is complete and accurate. Use high-quality images for your logo and cover photo. Include relevant keywords in your business description. Add comprehensive service details and keep your business hours up to date. Regularly respond to customer messages and reviews to show active engagement.",
      category: "business"
    },
    {
      id: "8",
      question: "How do you protect my personal information?",
      answer: "We take data protection seriously. All personal information is encrypted both in transit and at rest using industry-standard encryption protocols. We maintain strict access controls, regular security audits, and follow best practices for data security. We never sell your personal information to third parties and only use it as described in our Privacy Policy.",
      category: "privacy"
    },
    {
      id: "9",
      question: "Can I export my data from the platform?",
      answer: "Yes, you can export your data at any time. Go to 'Account Settings' and select 'Privacy & Data'. Click on 'Export My Data' and choose the information you'd like to export. We'll process your request and notify you when your data is ready for download. The export will include all your personal information and content in a standard, machine-readable format.",
      category: "privacy"
    },
    {
      id: "10",
      question: "What features are included in the free plan?",
      answer: "The free plan includes basic business profile management, up to 3 business profiles, basic analytics, customer messaging, and standard support. You'll have access to our mobile app and web platform with core functionality. Premium features such as advanced analytics, priority support, custom branding, and unlimited profiles require a paid subscription.",
      category: "services"
    },
    {
      id: "11",
      question: "Do you offer customer support?",
      answer: "Yes, we provide customer support through multiple channels. Free users have access to our knowledge base, community forums, and email support with a response time of 24-48 hours. Premium users receive priority support with faster response times and access to live chat during business hours. Enterprise customers also get a dedicated account manager.",
      category: "services"
    },
    {
      id: "12",
      question: "Is there a mobile app available?",
      answer: "Yes, we offer mobile apps for both iOS and Android devices. You can download our app from the Apple App Store or Google Play Store. The mobile app includes all core functionality of the web platform, allowing you to manage your business profiles, respond to customers, and view analytics on the go.",
      category: "services"
    }
  ];

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-10">
      {/* Breadcrumb Navigation - Full width */}
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Frequently Asked Questions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto">
        <div className="mb-6 text-left flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Frequently Asked Questions</h1>
            <p className="text-muted-foreground mt-1">
              Find answers to common questions about Business Hub.
            </p>
          </div>
          
          {/* 3D Animated Card Button */}
          <div 
            ref={cardRef}
            className="hidden md:block relative w-64 h-36 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
            style={{ 
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
              transition: 'transform 0.2s ease-out' 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={() => window.open("/owner/business-profiles/manage", "_blank")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/30 dark:from-blue-600 dark:to-blue-900 rainbow:from-[var(--neon-cyan)] rainbow:to-[var(--neon-purple)] p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white dark:text-white rainbow:text-white text-lg">Business Hub</h3>
                  <p className="text-xs text-white/80 dark:text-white/80 rainbow:text-white/90">Create your profile</p>
                </div>
                <div className="flex space-x-1">
                  <Star className="h-4 w-4 text-white/90 dark:text-blue-100 rainbow:text-[var(--neon-yellow)] star animate-pulse" style={{ animationDelay: '0.1s', animationDuration: '3s' }} />
                  <Star className="h-4 w-4 text-white/90 dark:text-blue-100 rainbow:text-[var(--neon-yellow)] star animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
                  <Star className="h-4 w-4 text-white/90 dark:text-blue-100 rainbow:text-[var(--neon-yellow)] star animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
                </div>
              </div>
              
              {/* <div className="grid grid-cols-4 gap-1 text-2xs text-center"> */}
              <div className="gap-1 text-2xs text-center">
                {/* <div className="h-8 bg-white/10 dark:bg-blue-800/40 rainbow:bg-[var(--neon-pink)]/20 rounded-md flex items-center justify-center text-white backdrop-blur-sm">
                  <Building className="h-3.5 w-3.5 mr-1" /> 
                  <span className="text-xs">Profile</span>
                </div>
                <div className="h-8 bg-white/10 dark:bg-blue-800/40 rainbow:bg-[var(--neon-cyan)]/20 rounded-md flex items-center justify-center text-white backdrop-blur-sm">
                  <Users className="h-3.5 w-3.5 mr-1" /> 
                  <span className="text-xs">Team</span>
                </div> */}
                <div className="h-12 bg-white/10 dark:bg-blue-800/40 rainbow:bg-[var(--neon-green)]/20 rounded-md flex items-center justify-center text-white backdrop-blur-sm col-span-2">
                  <span className="text-xs font-medium">Click to get started →</span>
                </div>
              </div>
            </div>
            
            <div 
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ 
                background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.2) 55%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: isHovered ? 'shineEffect 1.5s infinite' : 'none'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Full width separator */}
      <Separator className="bg-gradient-to-r from-border via-primary/20 to-border mb-8" />
      
      <div className="mx-auto">
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/40 focus-visible:ring-primary/30"
              />
            </div>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Category selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`h-auto flex items-center justify-start px-4 py-3 ${
                activeCategory === category.id ? "border-primary/50" : "border-border/40"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center">
                  <span className="mr-2 text-primary">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {category.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
        
        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id}>
                  <AccordionItem 
                    value={faq.id} 
                    className="border border-border/40 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <AccordionTrigger className="px-5 py-4 bg-card hover:bg-muted/30 transition-colors duration-200">
                      <div className="flex justify-between items-start w-full text-left">
                        <div className="flex gap-2 items-start pr-6">
                          <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span className="font-medium">{faq.question}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="hidden md:flex bg-muted/50 text-xs"
                        >
                          {categories.find(cat => cat.id === faq.category)?.name || faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                      <div className="pl-7">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-lg bg-muted/30">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              We couldn&apos;t find any FAQ matching your search criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}>
              Reset filters
            </Button>
          </div>
        )}
        
        {/* Contact support section */}
        <div className="mt-12 p-6 border border-border/40 rounded-lg bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Still have questions?</h3>
            <p className="text-muted-foreground mt-1">
              If you couldn&apos;t find what you&apos;re looking for, our support team is here to help.
            </p>
          </div>
          <Button className="md:flex-shrink-0">
            Contact Support
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shineEffect {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
} 