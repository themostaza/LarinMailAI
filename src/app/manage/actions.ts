'use server'

import { getFunctionsWithPermissions, getUserActiveFunctions } from '@/lib/database/functions'
import { getUser } from '@/lib/auth-server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

/**
 * Server Action per recuperare le funzioni con permissioni dell'utente corrente
 */
export async function getUserFunctions() {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Utente non autenticato', data: [] }
    }
    
    const functions = await getFunctionsWithPermissions(user.id)
    
    return { 
      success: true, 
      data: functions,
      error: null 
    }
  } catch (error) {
    console.error('Errore nel recuperare le funzioni utente:', error)
    return { 
      success: false, 
      error: 'Errore interno del server', 
      data: [] 
    }
  }
}

/**
 * Server Action per recuperare le funzionalità attive dell'utente corrente
 */
export async function getUserActiveFunctionsAction() {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Utente non autenticato', data: [] }
    }
    
    const activeFunctions = await getUserActiveFunctions(user.id)
    
    return { 
      success: true, 
      data: activeFunctions,
      error: null 
    }
  } catch (error) {
    console.error('Errore nel recuperare le funzionalità attive:', error)
    return { 
      success: false, 
      error: 'Errore interno del server', 
      data: [] 
    }
  }
}

/**
 * Server Action per recuperare i crediti disponibili dell'utente
 */
export async function getUserCredits() {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Utente non autenticato', credits: 0 }
    }
    
    const supabase = await createSupabaseServerClientMutable()
    
    // Recupera la prima subscription attiva dell'utente
    const { data: subscription, error: subError } = await supabase
      .from('pay_subscription')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
    
    if (subError || !subscription) {
      // Se non ha subscription attiva, i crediti sono 0
      return { 
        success: true, 
        credits: 0.00,
        error: null 
      }
    }
    
    // Calcola la somma di tutti gli importi delle transazioni per questa subscription
    const { data: transactions, error: transError } = await supabase
      .from('pay_transactions')
      .select('amount_in_eur')
      .eq('subscription_id', subscription.id)
    
    if (transError) {
      console.error('Errore nel recuperare le transazioni:', transError)
      return { 
        success: false, 
        error: 'Errore nel calcolare i crediti', 
        credits: 0 
      }
    }
    
    // Somma tutti gli importi (possono essere positivi per ricariche, negativi per consumi)
    const totalCredits = transactions?.reduce((sum, transaction) => {
      return sum + (transaction.amount_in_eur || 0)
    }, 0) || 0
    
    // Arrotonda a 2 decimali
    const roundedCredits = Math.round(totalCredits * 100) / 100
    
    return { 
      success: true, 
      credits: roundedCredits,
      error: null 
    }
  } catch (error) {
    console.error('Errore nel recuperare i crediti utente:', error)
    return { 
      success: false, 
      error: 'Errore interno del server', 
      credits: 0 
    }
  }
}

/**
 * Server Action per il logout dell'utente
 */
export async function logoutAction() {
  try {
    const supabase = await createSupabaseServerClientMutable()
    await supabase.auth.signOut()
    redirect('/login')
  } catch (error) {
    console.error('Errore durante il logout:', error)
    redirect('/login')
  }
}