import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth-server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { SupabaseClient } from '@supabase/auth-helpers-nextjs'

// Funzione per generare un codice unico di almeno 8 caratteri (numeri e lettere maiuscole)
function generateUniqueCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Funzione per verificare che il codice sia unico
async function generateUniquePublicCode(supabase: SupabaseClient): Promise<string> {
  let code: string
  let isUnique = false
  
  while (!isUnique) {
    code = generateUniqueCode(8)
    
    // Verifica che il codice non esista già
    const { data } = await supabase
      .from('link_specific_lfunction_user')
      .select('id')
      .eq('unique_public_code', code)
      .single()
    
    if (!data) {
      isUnique = true
    }
  }
  
  return code!
}

export async function POST(request: NextRequest) {
  try {
    const { lfunction_id, given_name } = await request.json()

    if (!lfunction_id || !given_name) {
      return NextResponse.json(
        { error: 'lfunction_id e given_name sono richiesti' },
        { status: 400 }
      )
    }

    // Verifica autenticazione
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Utente non autenticato' },
        { status: 401 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()

    // L'utente può attivare la stessa funzione più volte con titoli diversi
    // Rimuoviamo il controllo di duplicati

    // Genera un codice pubblico unico
    const uniquePublicCode = await generateUniquePublicCode(supabase)

    // Crea una nuova attivazione
    const { data: newActivation, error } = await supabase
      .from('link_specific_lfunction_user')
      .insert({
        lfunction_id,
        user_id: user.id,
        given_name: given_name.trim(),
        unique_public_code: uniquePublicCode
      })
      .select('id, unique_public_code, unique_public_code_uuid, given_name, created_at')
      .single()

    if (error) {
      console.error('Errore nel creare l\'attivazione:', error)
      return NextResponse.json(
        { error: 'Errore nel creare l\'attivazione' },
        { status: 500 }
      )
    }

    // Recupera anche i dettagli della funzione per la risposta completa
    const { data: functionDetails } = await supabase
      .from('larin_functions')
      .select('name, slug, lucide_react_icon')
      .eq('id', lfunction_id)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Funzione attivata con successo',
      activation: {
        ...newActivation,
        function_name: functionDetails?.name,
        function_slug: functionDetails?.slug,
        lucide_react_icon: functionDetails?.lucide_react_icon
      }
    })

  } catch (error) {
    console.error('Errore nel processare l\'attivazione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
