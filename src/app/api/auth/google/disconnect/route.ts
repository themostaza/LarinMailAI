import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Ottieni l'utente autenticato
    const supabase = await createSupabaseServerClientReadOnly()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Rimuovi l'account Google dal database
    const { error } = await supabaseAdmin
      .from('user_accounts')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 })
  }
}
