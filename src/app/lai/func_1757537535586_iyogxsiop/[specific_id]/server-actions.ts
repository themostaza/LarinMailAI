'use server'

import { createSupabaseServerClientReadOnly, createSupabaseServerClientMutable } from '@/lib/supabase-server'

interface PdfCompilationRow {
  id: string
  title: string | null
  pdf_file_url: string | null
  pdf_file_size: number | null
  created_at: string
  edited_at: string | null
  user_id: string
  specific_lfunction_id: number
  form_data: Record<string, unknown>
  status: string | null
}

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
        given_name: linkData.given_name || linkData.larin_functions?.name || 'Compilazione PDF',
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
 * Server Action per ottenere tutte le compilazioni PDF di un utente per una specifica funzione
 */
export async function getPdfCompilations(
  userId: string,
  specificId: string
): Promise<{
  success: boolean;
  data?: PdfCompilationRow[];
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

    // TODO: Implementare la tabella _lf_pdf_compilations nel database
    // Per ora restituiamo un array vuoto
    const data: PdfCompilationRow[] = []

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    console.error('Errore nel recuperare le compilazioni PDF:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Server Action per ottenere una singola compilazione PDF
 */
export async function getPdfCompilation(
  compilationId: string,
  userId: string
): Promise<{
  success: boolean;
  data?: PdfCompilationRow;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClientReadOnly()
    
    // TODO: Implementare la tabella _lf_pdf_compilations nel database
    // Per ora restituiamo null
    return {
      success: false,
      error: 'Funzionalità non ancora implementata - tabella _lf_pdf_compilations mancante'
    }
  } catch (error) {
    console.error('Errore nel recuperare la compilazione PDF:', error)
    return {
      success: false,
      error: 'Errore interno del server'
    }
  }
}

/**
 * Server Action per aggiornare il titolo di una compilazione PDF
 */
export async function updatePdfCompilationTitle(
  compilationId: string,
  userId: string,
  newTitle: string
): Promise<{
  success: boolean;
  data?: { title: string };
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // TODO: Implementare la tabella _lf_pdf_compilations nel database
    // Per ora restituiamo un errore
    return { 
      success: false, 
      error: 'Funzionalità non ancora implementata - tabella _lf_pdf_compilations mancante' 
    }
  } catch (error) {
    console.error('Errore nella query di aggiornamento del titolo:', error)
    return { 
      success: false, 
      error: 'Errore interno del server' 
    }
  }
}

