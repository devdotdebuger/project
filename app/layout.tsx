import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import ChatbotButton from "@/components/chatbot-button"
import SupabaseStatus from "@/components/supabase-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Microclimate Analysis Platform",
  description: "Mapping and addressing urban heat islands for cooler, greener cities",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
          <ChatbotButton />
          <SupabaseStatus />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
