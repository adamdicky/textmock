'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { error } from 'console'

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
  userName: string
  tokenBalance: number
}

// --- ACTIONS ---

/**
 * Gets the currently logged-in Payload User.
 * Returns null if not logged in.
 */
export async function getInitialUserData(): Promise<InitialData | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()

    // 1. Authenticate using the HTTP-only payload-token cookie
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      console.log('Server action: No user logged in.')
      return null
    }

    return { 
      userId: user.id as string, 
      userName: user.name as string || 'User',
      tokenBalance: (user.tokens as number) || 0
    }
  } catch (error) {
    console.error('CRIT ERROR in getInitialUserData: ', error);
    return null;
  }
}

export  async function getUserScenarios() {
  try {
    const payload = await getPayload({config: configPromise})
    const requestHeaders = await headers()
    const { user } = await payload.auth({headers: requestHeaders})

    if (!user) {
      console.log('Server aciton: No user logged in.')
      return []
    }

    const scenarios = await payload.find({
      collection: 'scenarios',
      where: {
        author: {
          equals: user.id,
        },
      },
      depth: 1,
      sort: '-createdAt',
    })

    return JSON.parse(JSON.stringify(scenarios.docs))

  } catch (error) {
    console.error('CRIT ERROR in getUserScenarios: ', error);
    return [];
  }

}

export async function getScenarioById(id: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) return null

    const scenario = await payload.findByID({
      collection: 'scenarios',
      id: id,
      depth: 1,
    })

    // Security Check: Ensure the logged-in user owns this scenario
    if (typeof scenario.author === 'object' ? scenario.author.id !== user.id : scenario.author !== user.id) {
      return null
    }

    return JSON.parse(JSON.stringify(scenario))
  } catch (error) {
    return null
  }
}

/**
 * Saves the scenario using the secure Server-Side Payload API
 */
export async function handleSaveScenarioAction(
  uiSettings: UISettings,
  messages: Message[],
  previewImageId?: string | null,
  existingScenarioId?: string, //for editing purposes
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

    let scenario;

    // 4. Check if Scenario is Existing Scenario, then create new one using Payload Local API
    if (existingScenarioId) {
      scenario = await payload.update({
        collection: 'scenarios',
        id: existingScenarioId,
        data: {
          title: `${uiSettings.recipientName} Scenario (Updated)`,
          uiSettings: uiSettings,
          messages: sanitizedMessages,
          previewImage: previewImageId || undefined,
        },
      })
    } else {
      // 5. If New, Create Scenario using Payload Local API
      // payload.create handles the SQL relationships automatically
      scenario = await payload.create({
        collection: 'scenarios',
        data: {
          title: `${uiSettings.recipientName} Scenario`,
          author: user.id, // Securely link to the logged-in user
          uiSettings: uiSettings,
          messages: sanitizedMessages,
          previewImage: previewImageId || undefined,
        },
      })
    }

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

    revalidatePath('/dashboard')
    revalidatePath('/create')
    return { success: true, newBalance }

  } catch (e) {
    console.error('Save Scenario Failed:', e)
    // Extract Payload/Database error message if possible
    const msg = e instanceof Error ? e.message : 'Unknown database error'
    return { success: false, error: msg }
  }
}