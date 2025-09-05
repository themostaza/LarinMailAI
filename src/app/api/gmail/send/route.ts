import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, to, subject, body, replyToMessageId } = await request.json()

    if (!email || !to || !subject || !body) {
      return NextResponse.json({ 
        error: 'Email, to, subject, and body are required' 
      }, { status: 400 })
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

    // Controlla se il token è scaduto
    const now = new Date()
    const expiresAt = account.token_expires_at ? new Date(account.token_expires_at) : null
    
    if (!account.google_access_token || (expiresAt && expiresAt <= now)) {
      return NextResponse.json({ error: 'Token expired, please refresh' }, { status: 401 })
    }

    // Configura OAuth2 client
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: account.google_access_token,
      refresh_token: account.google_refresh_token
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Costruisci il messaggio email
    const messageParts = [
      `From: ${email}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ]

    const message = messageParts.join('\n')
    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    // Invia l'email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: replyToMessageId // Se è una risposta
      }
    })

    return NextResponse.json({
      messageId: response.data.id,
      threadId: response.data.threadId,
      success: true
    })
  } catch (error) {
    console.error('Gmail send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
