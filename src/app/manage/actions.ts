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
    
    // Calcola la somma di TUTTE le transazioni dell'utente (subscription + one-time)
    const { data: transactions, error: transError } = await supabase
      .from('pay_transactions')
      .select('amount_in_eur')
      .eq('user_id', user.id)
    
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
 * Server Action per recuperare i dati di fatturazione dell'ultima transazione dell'utente
 */
export async function getUserLatestBillingData() {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Utente non autenticato', data: null }
    }
    
    const supabase = await createSupabaseServerClientMutable()
    
    // Recupera l'ultima transazione dell'utente che contiene dati di fatturazione
    const { data: transaction, error: transError } = await supabase
      .from('pay_transactions')
      .select('body')
      .eq('user_id', user.id)
      .not('body->metadata->billing_nome', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (transError || !transaction) {
      // Nessuna transazione con dati di fatturazione trovata
      return { 
        success: true, 
        data: null,
        error: null 
      }
    }
    
    // Estrai i dati di fatturazione dal body della transazione
    const body = transaction.body as { metadata?: Record<string, unknown> }
    const metadata = body?.metadata
    if (!metadata || typeof metadata !== 'object') {
      return { 
        success: true, 
        data: null,
        error: null 
      }
    }
    
    const billingData = {
      tipo: (metadata.billing_tipo as 'azienda' | 'privato') || 'privato',
      nome: (metadata.billing_nome as string) || '',
      cognome: (metadata.billing_cognome as string) || '',
      ragioneSociale: (metadata.billing_ragione_sociale as string) || '',
      codiceFiscale: (metadata.billing_codice_fiscale as string) || '',
      partitaIva: (metadata.billing_partita_iva as string) || '',
      via: (metadata.billing_via as string) || '',
      numeroCivico: (metadata.billing_numero_civico as string) || '',
      cap: (metadata.billing_cap as string) || '',
      provincia: (metadata.billing_provincia as string) || '',
      stato: (metadata.billing_stato as string) || ''
    }
    
    // Verifica se ci sono effettivamente dati utili
    const hasData = Object.values(billingData).some(value => value && value.length > 0)
    
    return { 
      success: true, 
      data: hasData ? billingData : null,
      error: null 
    }
  } catch (error) {
    console.error('Errore nel recuperare i dati di fatturazione:', error)
    return { 
      success: false, 
      error: 'Errore interno del server', 
      data: null 
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