import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase-server'

export async function GET() {
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

    // Definisci le metriche da calcolare con le relative query
    const metricsQueries = [
      // Stati delle email
      { key: 'unread', query: 'is:unread', description: 'Email non lette' },
      { key: 'read', query: 'is:read', description: 'Email lette' },
      { key: 'starred', query: 'is:starred', description: 'Email stellate' },
      { key: 'important', query: 'is:important', description: 'Email importanti' },
      { key: 'snoozed', query: 'is:snoozed', description: 'Email rimandate' },
      
      // Categorie
      { key: 'inbox', query: 'in:inbox', description: 'Posta in arrivo' },
      { key: 'sent', query: 'in:sent', description: 'Inviati' },
      { key: 'drafts', query: 'in:drafts', description: 'Bozze' },
      { key: 'spam', query: 'in:spam', description: 'Spam' },
      { key: 'trash', query: 'in:trash', description: 'Cestino' },
      
      // Contenuto
      { key: 'withAttachments', query: 'has:attachment', description: 'Con allegati' },
      { key: 'withDrive', query: 'has:drive', description: 'Con allegati Drive' },
      { key: 'withYoutube', query: 'has:youtube', description: 'Con video YouTube' },
      { key: 'withPdf', query: 'filename:pdf', description: 'Con PDF' },
      { key: 'withExcel', query: 'filename:xlsx', description: 'Con file Excel' },
      
      // Dimensioni
      { key: 'large10M', query: 'larger:10M', description: 'Maggiori di 10MB' },
      { key: 'large1M', query: 'larger:1M', description: 'Maggiori di 1MB' },
      { key: 'small1M', query: 'smaller:1M', description: 'Minori di 1MB' },
      
      // Mittenti/Destinatari
      { key: 'toMe', query: 'to:me', description: 'Indirizzate a me' },
      { key: 'ccMe', query: 'cc:me', description: 'In copia a me' }
    ]

    // Esegui tutte le query in parallelo per ottenere i conteggi
    const metricsResults = await Promise.all(
      metricsQueries.map(async (metric) => {
        try {
          const response = await gmail.users.messages.list({
            userId: 'me',
            q: metric.query,
            maxResults: 1 // Ci interessa solo il conteggio
          })
          
          return {
            key: metric.key,
            description: metric.description,
            query: metric.query,
            count: response.data.resultSizeEstimate || 0
          }
        } catch (error) {
          console.warn(`Failed to get metric ${metric.key}:`, error)
          return {
            key: metric.key,
            description: metric.description,
            query: metric.query,
            count: 0,
            error: true
          }
        }
      })
    )

    // Organizza i risultati per categoria
    const metrics = {
      states: metricsResults.filter(m => ['unread', 'read', 'starred', 'important', 'snoozed'].includes(m.key)),
      categories: metricsResults.filter(m => ['inbox', 'sent', 'drafts', 'spam', 'trash'].includes(m.key)),
      content: metricsResults.filter(m => ['withAttachments', 'withDrive', 'withYoutube', 'withPdf', 'withExcel'].includes(m.key)),
      sizes: metricsResults.filter(m => ['large10M', 'large1M', 'small1M'].includes(m.key)),
      recipients: metricsResults.filter(m => ['toMe', 'ccMe'].includes(m.key))
    }

    // Calcola solo metriche massive pure (senza calcoli derivati errati)
    const unreadEmails = metricsResults.find(m => m.key === 'unread')?.count || 0
    const starredEmails = metricsResults.find(m => m.key === 'starred')?.count || 0
    const withAttachments = metricsResults.find(m => m.key === 'withAttachments')?.count || 0
    
    return NextResponse.json({
      metrics,
      summary: {
        // NON calcoliamo totalEmails qui - viene dal profilo
        unreadEmails,
        starredEmails,
        withAttachments,
        // Altre metriche utili
        importantEmails: metricsResults.find(m => m.key === 'important')?.count || 0,
        inboxEmails: metricsResults.find(m => m.key === 'inbox')?.count || 0
      },
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Gmail Metrics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
