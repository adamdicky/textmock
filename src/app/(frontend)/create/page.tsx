import React from 'react'
import { getInitialUserData } from '@/actions/index'
import CreateScenarioClient from './page.client'
import { redirect } from 'next/navigation'

export default async function CreateScenarioPage() {
  const userData = await getInitialUserData()

  // If user is not logged in via Payload, send them to login
  if (!userData) {
    redirect('/admin/login?redirect=/create')
  }

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create New Scenario</h1>
      <CreateScenarioClient 
        initialUserId={userData.userId} 
        initialBalance={userData.tokenBalance} 
      />
    </div>
  )
}