import "./globals.css"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import { Metadata } from "next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Sharp Playground",
  description: "Run Sharp code in the web"
}
export default function RootLayout({ children }: {  children: React.ReactNode }) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased p-36",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
