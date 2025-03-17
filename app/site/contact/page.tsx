"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    reason: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    
    // Simulate form submission
    setTimeout(() => {
      // For demo purposes, we'll randomly succeed or fail
      const success = Math.random() > 0.2;
      setFormState(success ? "success" : "error");
      
      // Reset form after 3 seconds on success
      if (success) {
        setTimeout(() => {
          setFormState("idle");
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            reason: ""
          });
        }, 3000);
      }
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, reason: value }));
  };

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
              <BreadcrumbLink href="/site">Site</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto">
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-muted-foreground mt-1">
            We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>
      
      {/* Full width separator */}
      <Separator className="bg-gradient-to-r from-border via-primary/20 to-border mb-8" />
      
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-border/40"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="reason" className="text-sm font-medium">
                        Reason for Contact
                      </label>
                      <Select value={formData.reason} onValueChange={handleSelectChange}>
                        <SelectTrigger className="border-border/40">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="border-border/40"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="resize-none border-border/40"
                    />
                  </div>
                  
                  <div>
                    {formState === "idle" && (
                      <Button type="submit" className="w-full md:w-auto">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    )}
                    
                    {formState === "submitting" && (
                      <Button disabled className="w-full md:w-auto">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                        Sending...
                      </Button>
                    )}
                    
                    {formState === "success" && (
                      <div className="flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Message sent successfully! We&apos;ll be in touch soon.</span>
                      </div>
                    )}
                    
                    {formState === "error" && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                          <AlertCircle className="h-5 w-5" />
                          <span>There was an error sending your message. Please try again.</span>
                        </div>
                        <Button 
                          type="submit" 
                          variant="outline" 
                          className="w-full md:w-auto"
                          onClick={() => setFormState("idle")}
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 h-auto">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Other ways to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:support@businesshub.com" className="hover:text-primary transition-colors">
                        support@businesshub.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll aim to respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="tel:+18005551234" className="hover:text-primary transition-colors">
                        +1 (800) 555-1234
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Monday-Friday, 9am-5pm EST
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Business Hub Avenue<br />
                      Suite 500<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday-Friday: 9am-5pm EST<br />
                      Saturday: 10am-2pm EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 h-auto">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium">How quickly will I receive a response?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We aim to respond to all inquiries within 24 business hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Do you offer phone support?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Yes, our support team is available by phone during regular business hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Can I schedule a demo?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Absolutely! You can request a demo through this contact form or by calling our sales team directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

