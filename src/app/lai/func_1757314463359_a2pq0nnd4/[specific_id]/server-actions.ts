'use server'

import { createSupabaseServerClientReadOnly, createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { Tables } from '@/types/database.types'

type TranscriptionRow = Tables<'_lf_transcriptions'>

/**
 * Server Action per recuperare i dati di una funzione tramite unique_public_code_uuid
 */
export async function getFunctionBySpecificId(specificId: string, userId: string) {
  try {
    const supabase = await createSupabaseServerClientReadOnly()
    
    // Recupero i dati dalla tabella link_specific_lfunction_user usando unique_public_code_uuid
    const { data: linkData, error: linkError } = await supabase
      .from('link_specific_lfunction_user')
      .select(`
        given_name,
        lfunction_id,
        larin_functions (
          name,
          unique_ui_code
        )
      `)
      .eq('unique_public_code_uuid', specificId)
      .eq('user_id', userId)
      .single()
    
    if (linkError || !linkData) {
      console.error('Errore nel recuperare la funzione specifica:', linkError)
      return { 
        success: false, 
        error: 'Istanza funzione non trovata o non autorizzata', 
        data: null 
      }
    }
    
    return { 
      success: true, 
      data: {
        given_name: linkData.given_name || linkData.larin_functions?.name || 'Trascrizione AI',
        function_name: linkData.larin_functions?.name || '',
        function_code: linkData.larin_functions?.unique_ui_code || '',
        specific_id: specificId
      },
      error: null 
    }
  } catch (error) {
    console.error('Errore nella query:', error)
    return { 
      success: false, 
      error: 'Errore interno del server', 
      data: null 
    }
  }
}

/**
 * Server Action per aggiornare il given_name di una funzione
 */
export async function updateFunctionGivenName(specificId: string, userId: string, newGivenName: string) {
  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Aggiorna il given_name nella tabella link_specific_lfunction_user
    const { data, error } = await supabase
      .from('link_specific_lfunction_user')
      .update({ 
        given_name: newGivenName.trim(),
        edited_at: new Date().toISOString()
      })
      .eq('unique_public_code_uuid', specificId)
      .eq('user_id', userId)
      .select('given_name')
      .single()
    
    if (error) {
      console.error('Errore nell\'aggiornare il given_name:', error)
      return { 
        success: false, 
        error: 'Errore nell\'aggiornare il titolo' 
      }
    }
    
    return { 
      success: true, 
      data: { given_name: data.given_name }
    }
  } catch (error) {
    console.error('Errore nella query di aggiornamento:', error)
    return { 
      success: false, 
      error: 'Errore interno del server' 
    }
  }
}

/**
 * Server Action per ottenere tutte le trascrizioni di un utente per una specifica funzione
 */
export async function getTranscriptions(
  userId: string,
  specificId: string
): Promise<{
  success: boolean;
  data?: TranscriptionRow[];
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClientReadOnly()
    
    // Prima ottieni l'ID della link_specific_lfunction_user
    const { data: linkData, error: linkError } = await supabase
      .from('link_specific_lfunction_user')
      .select('id')
      .eq('unique_public_code_uuid', specificId)
      .eq('user_id', userId)
      .single()

    if (linkError || !linkData) {
      console.error('Errore nel trovare la funzione specifica:', linkError)
      return {
        success: false,
        error: 'Funzione specifica non trovata'
      }
    }

    // Ottieni tutte le trascrizioni per questa funzione specifica
    const { data, error } = await supabase
      .from('_lf_transcriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('specific_lfunction_id', linkData.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Errore nel recuperare le trascrizioni:', error)
      return {
        success: false,
        error: 'Errore nel recuperare le trascrizioni'
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    console.error('Errore nel recuperare le trascrizioni:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Server Action per ottenere una singola trascrizione
 */
export async function getTranscription(
  transcriptionId: string,
  userId: string
): Promise<{
  success: boolean;
  data?: TranscriptionRow;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClientReadOnly()
    
    const { data, error } = await supabase
      .from('_lf_transcriptions')
      .select('*')
      .eq('id', transcriptionId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      console.error('Errore nel recuperare la trascrizione:', error)
      return {
        success: false,
        error: 'Trascrizione non trovata'
      }
    }

    return {
      success: true,
      data: data
    }
  } catch (error) {
    console.error('Errore nel recuperare la trascrizione:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Server Action per aggiornare il titolo di una trascrizione
 */
export async function updateTranscriptionTitle(
  transcriptionId: string,
  userId: string,
  newTitle: string
): Promise<{
  success: boolean;
  data?: { title: string };
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Aggiorna il titolo nella tabella _lf_transcriptions
    const { data, error } = await supabase
      .from('_lf_transcriptions')
      .update({ 
        title: newTitle.trim(),
        edited_at: new Date().toISOString()
      })
      .eq('id', transcriptionId)
      .eq('user_id', userId)
      .select('title')
      .single()
    
    if (error) {
      console.error('Errore nell\'aggiornare il titolo della trascrizione:', error)
      return { 
        success: false, 
        error: 'Errore nell\'aggiornare il titolo della trascrizione' 
      }
    }

    if (!data) {
      return { 
        success: false, 
        error: 'Trascrizione non trovata o non autorizzata' 
      }
    }
    
    return { 
      success: true, 
      data: { title: data.title || newTitle.trim() }
    }
  } catch (error) {
    console.error('Errore nella query di aggiornamento del titolo:', error)
    return { 
      success: false, 
      error: 'Errore interno del server' 
    }
  }
}
