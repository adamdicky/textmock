'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

// --- TYPES ---
export interface Message {
  id?: number // Frontend temporary ID
  text: string
  isUserMessage?: boolean
  timestamp?: string
  status?: 'sent' | 'delivered' | 'read' | 'none'
}

export interface UISettings {
  recipientName: string
  deviceFrame?: 'iPhone15Pro' | 'none'
  chatType?: 'iMessage' | 'SMS'
  darkTheme?: boolean
}

export interface InitialData {
  userId: string
  tokenBalance: number
}

// --- ACTIONS ---

/**
 * Gets the currently logged-in Payload User.
 * Returns null if not logged in.
 */
export async function getInitialUserData(): Promise<InitialData | null> {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()

  // 1. Authenticate using the HTTP-only payload-token cookie
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return null
  }

  return { 
    userId: user.id as string, 

    tokenBalance: (user.tokens as number) || 0 
  }
}

/**
 * Saves the scenario using the secure Server-Side Payload API
 */
export async function handleSaveScenarioAction(
  uiSettings: UISettings,
  messages: Message[],
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const COST = 2
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()

  // 1. Verify Auth again (Security check)
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return { success: false, error: 'Unauthorized: Please log in.' }
  }


  const currentBalance = (user.tokens as number) || 0

  // 2. Check Balance
  if (currentBalance < COST) {
    return { success: false, error: `Insufficient tokens. You need ${COST}, but have ${currentBalance}.` }
  }

  try {
    // 3. Clean message data for DB insertion
    // We remove the temporary 'id' so Payload generates a proper UUID
    const sanitizedMessages = messages.map((msg) => ({
      text: msg.text,
      isUserMessage: msg.isUserMessage,
      timestamp: msg.timestamp,
      status: msg.status,
    }))

    // 4. Create Scenario using Payload Local API
    // payload.create handles the SQL relationships automatically
    const scenario = await payload.create({
      collection: 'scenarios',
      data: {
        title: `${uiSettings.recipientName} Scenario`,
        author: user.id, // Securely link to the logged-in user
        uiSettings: uiSettings,
        messages: sanitizedMessages,
      },
    })

    const newBalance = currentBalance - COST

    // 5. Deduct Tokens
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { tokens: newBalance },
    })

    // 6. Log Transaction
    await payload.create({
      collection: 'transactions',
      data: {
        author: user.id,
        type: 'consumption',
        amount: -COST,
        referenceID: String(scenario.id),
      },
    })

    revalidatePath('/create')
    return { success: true, newBalance }

  } catch (e) {
    console.error('Save Scenario Failed:', e)
    // Extract Payload/Database error message if possible
    const msg = e instanceof Error ? e.message : 'Unknown database error'
    return { success: false, error: msg }
  }
}