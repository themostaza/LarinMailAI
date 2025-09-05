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