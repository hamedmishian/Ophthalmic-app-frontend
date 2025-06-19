import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Medical Dashboard",
  description: "A medical dashboard for patient management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-[#0d0e10]`}>
        <ThemeProvider defaultTheme="system" storageKey="medical-dashboard-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
