'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// --- SERVER-SIDE SUPABASE INITIALIZATION ---
// NOTE: These environment variables are accessed securely on the server.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase Client for Server Actions
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- TYPES (Matching Postgres Schema) ---
interface Message {
    id: number;
    text: string;
    isUserMessage: boolean;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read' | 'none';
}

interface UISettings {
    recipientName: string;
    deviceFrame: 'iPhone15Pro' | 'none';
    chatType: 'iMessage' | 'SMS';
    darkTheme: boolean;
}

interface InitialData {
    userId: string;
    tokenBalance: number;
}

// --- CORE SERVER ACTION FUNCTIONS ---

/**
 * [SERVER ACTION] Fetches the initial user ID and token balance securely.
 */
export async function getInitialUserData(): Promise<InitialData> {
    let userId: string | null = null;

    try {
        // 1. Get current user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
             // 2. Fallback: Sign in anonymously
            const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
            if (anonError) throw anonError;
            userId = anonData.user?.id || '';
        } else {
            userId = user.id;
        }

    } catch (e) {
        console.error("Server Auth Failed:", e);
        // On server failure, use a fallback ID (must be handled by RLS if needed)
        userId = crypto.randomUUID(); 
    }

    if (!userId) return { userId: crypto.randomUUID(), tokenBalance: 0 };

    try {
        // 3. Fetch token balance from 'users' table
        const { data, error } = await supabase
            .from('users')
            .select('tokens')
            .eq('id', userId) 
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Allow "no row found"

        const tokenBalance = (data?.tokens as number) || 0;
        
        // Ensure user entry exists and has a minimum balance
        if (!data) {
             const defaultTokens = 10;
             await supabase.from('users').upsert({ id: userId, tokens: defaultTokens });
             return { userId, tokenBalance: defaultTokens };
        }

        return { userId, tokenBalance };

    } catch (e) {
        console.error("Server Token Fetch Failed:", e);
        return { userId, tokenBalance: 10 }; // Safe fallback
    }
}

/**
 * [SERVER ACTION] Simulates buying tokens and updates the user's balance and transaction log.
 */
export async function handleBuyTokensAction(userId: string, amount: number, currentBalance: number): Promise<number> {
    try {
        const newTokens = currentBalance + amount;
        
        // Update tokens
        const { error: updateError } = await supabase
            .from('users')
            .update({ tokens: newTokens })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Record transaction
        await supabase
            .from('transactions')
            .insert({
                author_id: userId,
                type: 'purchase',
                amount: amount,
                reference_i_d: `MOCK_PAYMENT_${Date.now()}`,
                created_at: new Date().toISOString(),
            });

        // Revalidate cache for the dashboard/user routes if necessary (good practice)
        revalidatePath('/dashboard'); 
        
        return newTokens;

    } catch (e) {
        console.error("SERVER ACTION: Buy Tokens Failed", e);
        // If transaction fails, return the old balance
        return currentBalance; 
    }
}

/**
 * [SERVER ACTION] Saves the scenario and deducts 2 tokens from the user's balance.
 */
export async function handleSaveScenarioAction(userId: string, uiSettings: UISettings, messages: Message[], currentBalance: number): Promise<{ success: boolean, newBalance: number }> {
    const COST = 2;
    if (currentBalance < COST) {
        return { success: false, newBalance: currentBalance };
    }

    try {
        // 1. Save scenario data
        const scenarioData = {
            title: uiSettings.recipientName + ' Scenario ' + new Date().toISOString().substring(0, 10),
            author_id: userId,
            ui_settings: JSON.stringify(uiSettings),
            messages_json: JSON.stringify(messages),
            created_at: new Date().toISOString(),
        };
        
        const { data: scenarioResult, error: saveError } = await supabase
            .from('scenarios')
            .insert(scenarioData)
            .select('id')
            .single();

        if (saveError) throw saveError;
        
        const scenarioId = (scenarioResult as { id: number }).id;
        const newBalance = currentBalance - COST;

        // 2. Deduct tokens
        const { error: tokenError } = await supabase
            .from('users')
            .update({ tokens: newBalance })
            .eq('id', userId);
        
        if (tokenError) throw tokenError;

        // 3. Record consumption transaction
        await supabase
            .from('transactions')
            .insert({
                author_id: userId,
                type: 'consumption',
                amount: -COST,
                reference_i_d: scenarioId.toString(),
                created_at: new Date().toISOString(),
            });
        
        revalidatePath('/dashboard'); 
        return { success: true, newBalance: newBalance };

    } catch (e) {
        console.error("SERVER ACTION: Save Scenario Failed", e);
        return { success: false, newBalance: currentBalance };
    }
}