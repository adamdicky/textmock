import React from 'react'
import { getInitialUserData, getUserScenarios } from '@/actions/index'
import { redirect } from 'next/navigation'
import DashboardClient from '@/app/(frontend)/dashboard/page.client'

export default async function DashboardPage() {
  const userData = await getInitialUserData()

  if (!userData) {
    redirect('/admin/login?redirect=/dashboard')
  }

  const scenarios = await getUserScenarios()

  return (
    <DashboardClient 
      user={userData}
      scenarios={scenarios}
    />
  )
}