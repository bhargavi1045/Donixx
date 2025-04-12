"use client"
import React from 'react'
import { useTheme } from 'next-themes'

function Page() {
  const {resolvedTheme}=useTheme()
  const darkMode = resolvedTheme === "dark"
  return (
    <div >
      It'z Donix
    </div>
  )
}

export default Page
