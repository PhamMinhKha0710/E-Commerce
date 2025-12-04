import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/layout/sidebar-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalToastHandler } from "@/components/global-toast-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartMile Admin Dashboard",
  description: "Admin dashboard for SmartMile E-commerce platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <GlobalToastHandler />
            {children}
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
