import { createSupabaseServerClientReadOnly } from '@/lib/supabase-server'
import { Tables } from '@/types/database.types'
import { calculateFunctionPermissions } from './visibility-logic'

export type LarinFunction = Tables<'larin_functions'>
export type FunctionUserException = Tables<'link_general_lfunction_user_exception'>
export type UserActiveFunction = Tables<'link_specific_lfunction_user'>

// Interfaccia per il campo body delle funzioni
export interface FunctionBodyData {
  setup?: string[]
  included?: string[]
  description?: string
  list_software?: string[]
}

export interface FunctionWithPermissions extends LarinFunction {
  visible: boolean
  available: boolean
  hasException: boolean
}

// Interfaccia per le funzionalità attive dell'utente con dati della funzione
export interface ActiveFunctionWithDetails {
  id: number
  user_id: string | null
  lfunction_id: string | null
  given_name: string | null
  unique_public_code: string | null
  unique_public_code_uuid: string | null
  created_at: string
  edited_at: string | null
  // Dati della funzione associata
  function_name: string | null
  function_slug: string | null
  function_unique_ui_code: string | null
  lucide_react_icon: string | null
  function_body: unknown
}

/**
 * Recupera tutte le funzioni Larin dal database
 */
export async function getLarinFunctions(): Promise<LarinFunction[]> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  const { data, error } = await supabase
    .from('larin_functions')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Errore nel recuperare le funzioni Larin:', error)
    return []
  }
  
  return data || []
}

/**
 * Recupera le eccezioni per un utente specifico
 */
export async function getUserFunctionExceptions(userId: string): Promise<FunctionUserException[]> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  const { data, error } = await supabase
    .from('link_general_lfunction_user_exception')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    console.error('Errore nel recuperare le eccezioni utente:', error)
    return []
  }
  
  return data || []
}

/**
 * Recupera le funzioni pubbliche visibili a tutti (per homepage)
 * Mostra solo le funzioni con generally_visible = true
 */
export async function getPublicFunctions(): Promise<FunctionWithPermissions[]> {
  const functions = await getLarinFunctions()
  
  // Filtra solo le funzioni generalmente visibili e applica permissioni di base
  const publicFunctions: FunctionWithPermissions[] = functions
    .filter(func => func.generally_visible ?? true)
    .map(func => ({
      ...func,
      visible: true,
      available: func.generally_available ?? false,
      hasException: false
    }))
  
  return publicFunctions
}

/**
 * Recupera le funzioni con le loro permissioni per un utente specifico
 * Logica a due livelli:
 * 1. Livello Generale (generally_visible, generally_available)
 * 2. Livello Specifico Utente (eccezioni)
 * 
 * Regole:
 * - Se generally_visible = false → nascosta per tutti TRANNE utenti con eccezione specifica
 * - Se generally_available = false → non disponibile per tutti TRANNE utenti con eccezione specifica
 * - Le eccezioni sovrascrivono sempre i valori generali
 */
export async function getFunctionsWithPermissions(userId: string): Promise<FunctionWithPermissions[]> {
  const [functions, exceptions] = await Promise.all([
    getLarinFunctions(),
    getUserFunctionExceptions(userId)
  ])
  
  // Crea una mappa delle eccezioni per accesso rapido
  const exceptionsMap = new Map<string, FunctionUserException>()
  exceptions.forEach(exception => {
    if (exception.lfunction_id) {
      exceptionsMap.set(exception.lfunction_id, exception)
    }
  })
  
  // Combina le funzioni con le loro permissioni
  const functionsWithPermissions: FunctionWithPermissions[] = functions.map(func => {
    const exception = exceptionsMap.get(func.id)
    const permissions = calculateFunctionPermissions(func, exception || null)
    
    return {
      ...func,
      ...permissions
    }
  })
  
  // Filtra solo le funzioni visibili
  return functionsWithPermissions.filter(func => func.visible)
}

/**
 * Recupera una singola funzione con permissioni
 * Applica la stessa logica a due livelli di getFunctionsWithPermissions
 */
export async function getFunctionWithPermissions(
  functionId: string, 
  userId: string
): Promise<FunctionWithPermissions | null> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  // Recupera la funzione
  const { data: func, error: funcError } = await supabase
    .from('larin_functions')
    .select('*')
    .eq('id', functionId)
    .single()
  
  if (funcError || !func) {
    console.error('Errore nel recuperare la funzione:', funcError)
    return null
  }
  
  // Recupera l'eventuale eccezione
  const { data: exception } = await supabase
    .from('link_general_lfunction_user_exception')
    .select('*')
    .eq('lfunction_id', functionId)
    .eq('user_id', userId)
    .maybeSingle()
  
  // Applica la logica di visibilità centralizzata
  const permissions = calculateFunctionPermissions(func, exception || null)
  
  return {
    ...func,
    ...permissions
  }
}

/**
 * Recupera le funzionalità attive dell'utente con i dettagli della funzione
 */
export async function getUserActiveFunctions(userId: string): Promise<ActiveFunctionWithDetails[]> {
  const supabase = await createSupabaseServerClientReadOnly()
  
  const { data, error } = await supabase
    .from('link_specific_lfunction_user')
    .select(`
      id,
      user_id,
      lfunction_id,
      given_name,
      unique_public_code,
      unique_public_code_uuid,
      created_at,
      edited_at,
      larin_functions (
        name,
        slug,
        unique_ui_code,
        lucide_react_icon,
        body
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Errore nel recuperare le funzionalità attive:', error)
    return []
  }
  
  // Trasforma i dati per avere una struttura piatta
  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    lfunction_id: item.lfunction_id,
    given_name: item.given_name,
    unique_public_code: item.unique_public_code,
    unique_public_code_uuid: item.unique_public_code_uuid,
    created_at: item.created_at,
    edited_at: item.edited_at,
    function_name: item.larin_functions?.name || null,
    function_slug: item.larin_functions?.slug || null,
    function_unique_ui_code: item.larin_functions?.unique_ui_code || null,
    lucide_react_icon: item.larin_functions?.lucide_react_icon || null,
    function_body: item.larin_functions?.body || null
  }))
}
