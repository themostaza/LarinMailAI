import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Ottieni l'utente autenticato
    const supabase = await createSupabaseServerClientReadOnly()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Ottieni l'account Google dell'utente dal database
    const { data: account, error: fetchError } = await supabaseAdmin
      .from('user_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Controlla se il token è scaduto e fai il refresh se necessario
    const now = new Date()
    const expiresAt = account.token_expires_at ? new Date(account.token_expires_at) : null
    let currentAccessToken = account.google_access_token
    
    if (!currentAccessToken || (expiresAt && expiresAt <= now)) {
      // Token scaduto, prova a fare il refresh
      try {
        const { refreshAccessToken } = await import('@/lib/google-oauth')
        const newTokens = await refreshAccessToken(account.google_refresh_token)
        
        if (!newTokens.access_token) {
          return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 })
        }
        
        // Aggiorna il token nel database
        const newExpiresAt = newTokens.expiry_date ? new Date(newTokens.expiry_date) : null
        await supabaseAdmin
          .from('user_accounts')
          .update({
            google_access_token: newTokens.access_token,
            token_expires_at: newExpiresAt?.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
        
        currentAccessToken = newTokens.access_token
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        return NextResponse.json({ error: 'Token expired and refresh failed. Please reconnect your account.' }, { status: 401 })
      }
    }

    // Configura OAuth2 client
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: currentAccessToken,
      refresh_token: account.google_refresh_token
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Ottieni il profilo dell'utente
    const profile = await gmail.users.getProfile({
      userId: 'me'
    })

    return NextResponse.json({
      emailAddress: profile.data.emailAddress,
      messagesTotal: profile.data.messagesTotal,
      threadsTotal: profile.data.threadsTotal,
      historyId: profile.data.historyId
    })
  } catch (error) {
    console.error('Gmail Profile API error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
