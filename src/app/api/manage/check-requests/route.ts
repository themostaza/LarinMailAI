import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth-server'
import { createSupabaseServerClientMutable } from '@/lib/supabase-server'

export async function GET() {
  try {
    // Verifica autenticazione
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Utente non autenticato' },
        { status: 401 }
      )
    }

    const supabase = await createSupabaseServerClientMutable()

    // Recupera tutte le richieste dell'utente
    const { data: requests, error } = await supabase
      .from('lfunction_request')
      .select('lfunction_id, created_at, done')
      .eq('user_id', user.id)

    if (error) {
      console.error('Errore nel recuperare le richieste:', error)
      return NextResponse.json(
        { error: 'Errore nel recuperare le richieste' },
        { status: 500 }
      )
    }

    // Trasforma in un oggetto per facile lookup
    const requestsMap = requests.reduce((acc, request) => {
      acc[request.lfunction_id!] = {
        created_at: request.created_at,
        done: request.done
      }
      return acc
    }, {} as Record<string, { created_at: string; done: boolean | null }>)

    return NextResponse.json({
      success: true,
      requests: requestsMap
    })

  } catch (error) {
    console.error('Errore nel processare la richiesta:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
