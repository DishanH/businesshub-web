import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { PageWrapper } from "@/components/page-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { LocationProvider } from "@/components/location-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Local Business Hub",
  description: "Connect with local businesses in your area",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={["light", "dark", "rainbow"]}>
          <LocationProvider>
            <Header />
            <PageWrapper>
              <main className="mx-auto px-4 py-8 mt-0">{children}</main>
            </PageWrapper>
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'