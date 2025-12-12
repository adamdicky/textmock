import React from 'react'
import { getInitialUserData, getScenarioById} from '@/actions/index'
import CreateScenarioClient from './page.client'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CreateScenarioPage({ searchParams }: PageProps) {
  const userData = await getInitialUserData()

  const resolvedParams = await searchParams
  const scenarioId = typeof resolvedParams.id === 'string' ? resolvedParams.id : undefined

  // If user is not logged in via Payload, send them to login
  if (!userData) {
    redirect('/admin/login?redirect=/create')
  }

  let existingScenario = null
  if (scenarioId) {
    existingScenario = await getScenarioById(scenarioId)
  }

  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">
        {existingScenario ? 'Edit Scenario' : 'Create New Scenario'}
      </h1>
      <CreateScenarioClient 
        initialUserId={userData.userId} 
        initialUserName={userData.userName}
        initialBalance={userData.tokenBalance} 
        existingScenario={existingScenario} // <--- Pass the data
      />
    </div>
  )
}