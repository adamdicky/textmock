import React from 'react'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'
import LoginForm from './page.client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | TextMock',
  description: 'Login to your account to create and manage mockups.',
}

export default async function LoginPage() {
  const { user } = await getMeUser()

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <LoginForm />
    </div>
  )
}
