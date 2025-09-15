import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json()

    if (!newPassword) {
      return NextResponse.json(
        { error: 'La nuova password è obbligatoria' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La nuova password deve essere di almeno 8 caratteri' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()

    // Verifica l'utente corrente
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utente non autenticato' },
        { status: 401 }
      )
    }

    // Aggiorna la password direttamente
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('Errore aggiornamento password:', updateError)
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento della password' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password aggiornata con successo' 
    })

  } catch (error) {
    console.error('Errore nel cambio password:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
