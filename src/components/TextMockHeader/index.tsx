import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getMeUser } from '@/utilities/getMeUser'

export const TextMockHeader = async () => {
  // 1. Check user auth state on the server
  const { user } = await getMeUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* 1. TextMock Logo (Placeholder) */}
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            TM
          </div>
          <span className="hidden sm:inline-block">TextMock</span>
        </Link>

        {/* Action Buttons */}
        <nav className="flex items-center gap-2">
          {user ? (
            // 3. Logged In State
            <>
              <Link href="/create">
                <Button variant="default" size="sm">
                  Create
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            // 2. Logged Out State
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
