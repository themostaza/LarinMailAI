'use server'

import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth-server'

/**
 * Server Action per ottenere l'utente corrente
 */
export async function getCurrentUser() {
  try {
    const user = await getUser()
    return { success: true, user, error: null }
  } catch {
    return { success: false, user: null, error: 'Errore nel recuperare l\'utente' }
  }
}

/**
 * Server Action per il login
 */
export async function signInAction(email: string, password: string) {
  try {
    const supabase = await createSupabaseServerClientMutable()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, user: data.user, error: null }
  } catch {
    return { success: false, user: null, error: 'Errore durante il login' }
  }
}

/**
 * Server Action per il logout
 */
export async function signOutAction() {
  try {
    const supabase = await createSupabaseServerClientMutable()
    await supabase.auth.signOut()
    redirect('/login')
  } catch (error) {
    console.error('Errore durante il logout:', error)
    redirect('/login')
  }
}
