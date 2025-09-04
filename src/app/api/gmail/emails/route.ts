import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = searchParams.get('maxResults') || '10'
    const query = searchParams.get('query') || ''

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

    // Ottieni la lista delle email
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      q: query
    })

    if (!response.data.messages) {
      return NextResponse.json({ emails: [], totalResults: 0 })
    }

    // Ottieni i dettagli delle email
    const emailDetails = await Promise.all(
      response.data.messages.map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date']
        })

        const headers = detail.data.payload?.headers || []
        const getHeader = (name: string) => headers.find(h => h.name === name)?.value || ''

        return {
          id: message.id,
          threadId: message.threadId,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: detail.data.snippet || '',
          labelIds: detail.data.labelIds || []
        }
      })
    )

    return NextResponse.json({
      emails: emailDetails,
      totalResults: response.data.resultSizeEstimate || 0
    })
  } catch (error) {
    console.error('Gmail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}
