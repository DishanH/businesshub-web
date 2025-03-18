"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Shield, Eye, Database, Lock, FileText, Bell } from "lucide-react";

export default function PrivacyPage() {
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
              <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto">
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="text-muted-foreground mt-1">
            Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>
      
      {/* Full width separator */}
      <Separator className="bg-gradient-to-r from-border via-primary/20 to-border mb-8" />
      
      <div className="mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/40 mb-8">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Your privacy matters to us</h3>
            <p className="text-sm text-muted-foreground">
              This policy was last updated on May 15, 2024. We regularly review and update our practices to ensure your information is protected.
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collection">Data Collection</TabsTrigger>
            <TabsTrigger value="usage">Data Usage</TabsTrigger>
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Privacy Policy Overview
                </CardTitle>
                <CardDescription>
                  A summary of how we handle your information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-sm leading-relaxed">
                  At Business Hub, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                
                <p className="text-sm leading-relaxed">
                  We understand the importance of maintaining your trust and confidence. By accessing our website or using our services, you consent to the practices described in this Privacy Policy. We encourage you to read this document carefully to understand our practices regarding your personal information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Transparency</h3>
                      <p className="text-sm text-muted-foreground">
                        We are clear about what data we collect and how we use it.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Security</h3>
                      <p className="text-sm text-muted-foreground">
                        We implement robust measures to protect your information.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Data Minimization</h3>
                      <p className="text-sm text-muted-foreground">
                        We only collect information that is necessary for our services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">User Control</h3>
                      <p className="text-sm text-muted-foreground">
                        You have control over your personal information.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="collection" className="space-y-6">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Information We Collect
                </CardTitle>
                <CardDescription>
                  Details about the types of data we gather
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Personal Information</h3>
                  <p className="text-sm leading-relaxed">
                    We may collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products and services, participate in activities on our website, or otherwise contact us. This information may include:
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-2 text-muted-foreground">
                    <li>Name and contact information (email address, phone number, etc.)</li>
                    <li>Billing information and transaction details</li>
                    <li>Profile information (username, password, preferences)</li>
                    <li>Business information (company name, job title, etc.)</li>
                    <li>Content you provide (reviews, feedback, comments)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Automatically Collected Information</h3>
                  <p className="text-sm leading-relaxed">
                    When you visit our website or use our services, we may automatically collect certain information about your device and usage patterns. This information may include:
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-2 text-muted-foreground">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent on pages, links clicked)</li>
                    <li>Location information (general geographic location)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  How We Use Your Information
                </CardTitle>
                <CardDescription>
                  Purposes for which we process your data
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-sm leading-relaxed">
                  We use the information we collect for various business and commercial purposes, including:
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Providing and Improving Our Services</h3>
                      <p className="text-sm text-muted-foreground">
                        We use your information to deliver our services, process transactions, maintain your account, and improve our offerings based on your feedback and usage patterns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        We may use your contact information to send you service-related notices, updates, promotional messages, and respond to your inquiries.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Security and Fraud Prevention</h3>
                      <p className="text-sm text-muted-foreground">
                        We use your information to protect our services, users, and business from fraudulent, unauthorized, or illegal activity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analytics and Research</h3>
                      <p className="text-sm text-muted-foreground">
                        We analyze usage patterns to better understand how our services are used, improve user experience, and develop new features.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rights" className="space-y-6">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="h-6 w-1 bg-primary rounded-full"></span>
                  Your Privacy Rights
                </CardTitle>
                <CardDescription>
                  Understanding and exercising your data protection rights
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-sm leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information. These may include:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border border-border/40 rounded-lg">
                    <h3 className="font-medium mb-2">Right to Access</h3>
                    <p className="text-sm text-muted-foreground">
                      You have the right to request information about the personal data we hold about you and how it is processed.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border/40 rounded-lg">
                    <h3 className="font-medium mb-2">Right to Rectification</h3>
                    <p className="text-sm text-muted-foreground">
                      You have the right to request that we correct any inaccurate personal information we hold about you.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border/40 rounded-lg">
                    <h3 className="font-medium mb-2">Right to Erasure</h3>
                    <p className="text-sm text-muted-foreground">
                      In certain circumstances, you have the right to request that we delete your personal information.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border/40 rounded-lg">
                    <h3 className="font-medium mb-2">Right to Restrict Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      You have the right to request that we limit the processing of your personal information in certain circumstances.
                    </p>
                  </div>
                  
                  <div className="p-4 border border-border/40 rounded-lg">
                    <h3 className="font-medium mb-2">Right to Data Portability</h3>
                    <p className="text-sm text-muted-foreground">
                      You have the right to request a copy of your personal information in a structured, commonly used, and machine-readable format.
                    </p>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">
                  To exercise any of these rights, please contact us using the information provided in the &quot;Contact Us&quot; section. We will respond to your request within the timeframe required by applicable law.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

