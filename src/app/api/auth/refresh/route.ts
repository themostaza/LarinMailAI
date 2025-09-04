import { NextRequest, NextResponse } from 'next/server'
import { refreshAccessToken } from '@/lib/google-oauth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Ottieni l'account dal database
    const { data: account, error: fetchError } = await supabaseAdmin
      .from('user_accounts')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Refresh del token
    const newTokens = await refreshAccessToken(account.google_refresh_token)

    if (!newTokens.access_token) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
    }

    // Aggiorna il database
    const expiresAt = newTokens.expiry_date ? new Date(newTokens.expiry_date) : null

    const { error: updateError } = await supabaseAdmin
      .from('user_accounts')
      .update({
        google_access_token: newTokens.access_token,
        token_expires_at: expiresAt?.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update token' }, { status: 500 })
    }

    return NextResponse.json({
      access_token: newTokens.access_token,
      expires_at: expiresAt?.toISOString()
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
}
