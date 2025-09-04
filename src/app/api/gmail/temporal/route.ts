import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metricsParam = searchParams.get('metrics') // comma-separated list
    
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

    // Usa sempre il filtro per la settimana corrente
    const timeFilter = 'newer_than:7d'

    // Determina quali metriche calcolare
    const requestedMetrics = metricsParam ? metricsParam.split(',') : ['all']
    const includeAll = requestedMetrics.includes('all')
    
    // Definisci le metriche temporali disponibili
    const temporalQueries = [
      // Metriche base con filtro temporale
      { key: 'received', query: `in:inbox ${timeFilter}`, description: 'Email ricevute' },
      { key: 'sent', query: `in:sent ${timeFilter}`, description: 'Email inviate' },
      { key: 'unread', query: `is:unread ${timeFilter}`, description: 'Non lette' },
      { key: 'starred', query: `is:starred ${timeFilter}`, description: 'Stellate' },
      { key: 'important', query: `is:important ${timeFilter}`, description: 'Importanti' },
      
      // Metriche di contenuto
      { key: 'attachments', query: `has:attachment ${timeFilter}`, description: 'Con allegati' },
      { key: 'large', query: `larger:5M ${timeFilter}`, description: 'Email grandi (>5MB)' },
      { key: 'pdf', query: `filename:pdf ${timeFilter}`, description: 'Con PDF' },
      
      // Metriche di produttività
      { key: 'oldUnread', query: `is:unread older_than:7d`, description: 'Non lette vecchie (>7gg)' },
      { key: 'recentImportant', query: `is:important ${timeFilter}`, description: 'Importanti recenti' }
    ]

    // Filtra le metriche richieste
    const metricsToCalculate = includeAll 
      ? temporalQueries 
      : temporalQueries.filter(m => requestedMetrics.includes(m.key))

    // Esegui tutte le query in parallelo
    const temporalResults = await Promise.all(
      metricsToCalculate.map(async (metric) => {
        try {
          const response = await gmail.users.messages.list({
            userId: 'me',
            q: metric.query,
            maxResults: 1 // Solo per il conteggio
          })
          
          return {
            key: metric.key,
            description: metric.description,
            query: metric.query,
            count: response.data.resultSizeEstimate || 0,
            timeFilter: timeFilter
          }
        } catch (error) {
          console.warn(`Failed to get temporal metric ${metric.key}:`, error)
          return {
            key: metric.key,
            description: metric.description,
            query: metric.query,
            count: 0,
            timeFilter: timeFilter,
            error: true
          }
        }
      })
    )

    // Calcola alcune metriche derivate per il periodo
    const received = temporalResults.find(m => m.key === 'received')?.count || 0
    const sent = temporalResults.find(m => m.key === 'sent')?.count || 0
    const unread = temporalResults.find(m => m.key === 'unread')?.count || 0
    const attachments = temporalResults.find(m => m.key === 'attachments')?.count || 0
    
    // Calcola il tasso di attività (email inviate vs ricevute)
    const activityRate = received > 0 ? ((sent / received) * 100).toFixed(1) : '0'
    const unreadRate = received > 0 ? ((unread / received) * 100).toFixed(1) : '0'
    const attachmentRate = received > 0 ? ((attachments / received) * 100).toFixed(1) : '0'

    return NextResponse.json({
      period: 'week',
      timeFilter: timeFilter,
      metrics: temporalResults,
      summary: {
        received,
        sent,
        unread,
        activityRate: parseFloat(activityRate),
        unreadRate: parseFloat(unreadRate),
        attachmentRate: parseFloat(attachmentRate),
        totalActivity: received + sent
      },
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Gmail Temporal API error:', error)
    return NextResponse.json({ error: 'Failed to fetch temporal metrics' }, { status: 500 })
  }
}
