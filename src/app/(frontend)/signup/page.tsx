'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/index'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await registerUser(formData.email, formData.password, formData.name)
    
    if (res.success) {
      alert('Account created! Please log in.')
      router.push('/admin/login') // Redirect to Payload's built-in login
    } else {
      setError(res.error || 'Something went wrong')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full">Sign Up</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/admin/login" className="underline">Log in</Link>
        </p>
      </Card>
    </div>
  )
}