"use client"

import { ThemeProvider } from "next-themes"
export function Theme_Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}