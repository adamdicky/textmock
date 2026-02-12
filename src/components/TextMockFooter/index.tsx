import React from 'react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const TextMockFooter = () => {
  return (
    <footer className="border-t py-6 bg-muted/30">
      <div className="container flex items-center justify-center">
        {/* 1. Only ThemeSelector as requested */}
        <ThemeSelector />
      </div>
    </footer>
  )
}
