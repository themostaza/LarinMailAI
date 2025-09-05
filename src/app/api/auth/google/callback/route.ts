import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google-oauth'
import { supabaseAdmin, createSupabaseServerClientReadOnly } from '@/lib/supabase-server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}/manage/settings?error=oauth_cancelled`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}/manage/settings?error=no_code`)
    }

    // Ottieni l'utente autenticato corrente
    const supabase = await createSupabaseServerClientReadOnly()

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/login?error=not_authenticated`)
    }

    // Ottieni i token da Google
    const tokens = await getTokensFromCode(code)
    
    if (!tokens.refresh_token || !tokens.access_token) {
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/manage/settings?error=no_tokens`)
    }

    // Ottieni informazioni utente da Google
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials(tokens)
    
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()

    if (!userInfo.email) {
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/manage/settings?error=no_email`)
    }

    // Salva o aggiorna l'account in Supabase collegato all'utente autenticato
    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null

    const {  error: dbError } = await supabaseAdmin
      .from('user_accounts')
      .upsert({
        user_id: user.id,
        email: userInfo.email,
        google_refresh_token: tokens.refresh_token,
        google_access_token: tokens.access_token,
        token_expires_at: expiresAt?.toISOString(),
        scopes: tokens.scope?.split(' ') || [],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/manage/settings?error=database_error`)
    }

    return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/manage/settings?success=connected`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app/' : 'http://localhost:3000'}/manage/settings?error=callback_failed`)
  }
}
