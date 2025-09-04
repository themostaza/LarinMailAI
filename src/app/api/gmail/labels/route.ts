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

    // Ottieni la lista delle etichette
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me'
    })

    const labels = labelsResponse.data.labels || []
    
    // Ottieni i dettagli per ogni etichetta (inclusi i conteggi)
    const labelDetails = await Promise.all(
      labels.map(async (label) => {
        try {
          const labelDetail = await gmail.users.labels.get({
            userId: 'me',
            id: label.id!
          })
          
          return {
            id: label.id,
            name: label.name,
            type: label.type,
            messagesTotal: labelDetail.data.messagesTotal || 0,
            messagesUnread: labelDetail.data.messagesUnread || 0,
            threadsTotal: labelDetail.data.threadsTotal || 0,
            threadsUnread: labelDetail.data.threadsUnread || 0
          }
        } catch (error) {
          console.warn(`Failed to get details for label ${label.id}:`, error)
          return {
            id: label.id,
            name: label.name,
            type: label.type,
            messagesTotal: 0,
            messagesUnread: 0,
            threadsTotal: 0,
            threadsUnread: 0
          }
        }
      })
    )

    // Filtra solo le etichette di sistema più importanti per la dashboard
    const importantLabels = labelDetails.filter(label => 
      ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'UNREAD', 'STARRED', 'IMPORTANT'].includes(label.name || '')
    )

    return NextResponse.json({
      labels: labelDetails,
      importantLabels,
      totalLabels: labels.length
    })
  } catch (error) {
    console.error('Gmail Labels API error:', error)
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 })
  }
}
