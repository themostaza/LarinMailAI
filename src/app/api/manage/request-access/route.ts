import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth-server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { lfunction_id } = await request.json()

    if (!lfunction_id) {
      return NextResponse.json(
        { error: 'lfunction_id è richiesto' },
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

    // Verifica se esiste già una richiesta per questa funzione da questo utente
    const { data: existingRequest } = await supabase
      .from('lfunction_request')
      .select('id, created_at')
      .eq('lfunction_id', lfunction_id)
      .eq('user_id', user.id)
      .single()

    if (existingRequest) {
      return NextResponse.json({
        success: true,
        message: 'Richiesta già esistente',
        request: existingRequest
      })
    }

    // Crea una nuova richiesta
    const { data: newRequest, error } = await supabase
      .from('lfunction_request')
      .insert({
        lfunction_id,
        user_id: user.id,
        done: false
      })
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Errore nel creare la richiesta:', error)
      return NextResponse.json(
        { error: 'Errore nel creare la richiesta' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Richiesta creata con successo',
      request: newRequest
    })

  } catch (error) {
    console.error('Errore nel processare la richiesta:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
