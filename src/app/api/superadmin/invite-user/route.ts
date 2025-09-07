import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { createEmailTemplate } from '@/lib/email-templates'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori' },
        { status: 400 }
      )
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Indirizzo email non valido' },
        { status: 400 }
      )
    }

    // Validazione password
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return NextResponse.json(
        { error: 'La password deve rispettare i requisiti di sicurezza' },
        { status: 400 }
      )
    }

    // Crea utente in Supabase Auth (già confermato)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // L'utente è già confermato
    })

    if (authError) {
      console.error('Errore creazione utente:', authError)
      if (authError.message.includes('User already registered')) {
        return NextResponse.json(
          { error: 'Email già registrata nel sistema' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Errore durante la creazione dell\'utente' },
        { status: 500 }
      )
    }

    // Crea profilo utente
    const { error: profileError } = await supabaseAdmin
      .from('user_profile')
      .insert({
        user_id: authData.user.id,
        role: 'std user'
      })

    if (profileError) {
      console.error('Errore creazione profilo:', profileError)
      // Se il profilo fallisce, rimuovi l'utente creato
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Errore durante la creazione del profilo utente' },
        { status: 500 }
      )
    }

    // Invia email di benvenuto
    try {
      const emailHtml = createEmailTemplate({
        title: 'Benvenuto in LarinAI!',
        content: `
          <p>Siamo lieti di invitarti ad accedere a <strong>LarinAI</strong>, la piattaforma di strumenti di intelligenza artificiale.</p>
          
          <div style="background-color: #1f2937; border: 2px solid #00D9AA; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: left;">
            <h2 style="color: #00D9AA; margin-bottom: 15px;">Le tue credenziali di accesso:</h3>
            <div style="margin-bottom: 10px;">
              <strong style="color: #ffffff;">Email:</strong> 
              <h2 style="color: #ffffff; font-family: monospace;">${email}</h2>
            </div>
            <div>
              <strong style="color: #ffffff;">Password:</strong> 
              <h2 style="color: #ffffff; font-family: monospace;">${password}</h2>
            </div>
          </div>
          
          <p>Per accedere alla piattaforma, vai su:</p>
          <p style="text-align: center; margin: 20px 0;">
            <strong style="color: #ffffff;">https://www.larinai.it/login</strong>
          </p>
          
          <p style="color: #9ca3af; font-size: 14px;">
            Ti consigliamo di cambiare la password dopo il primo accesso per maggiore sicurezza.
          </p>
        `,
        buttonText: 'Accedi a LarinAI',
        buttonUrl: 'https://www.larinai.it/login'
      })

      await resend.emails.send({
        from: 'LarinAI <noreply@larinai.it>',
        to: [email],
        subject: 'Benvenuto in LarinAI - Le tue credenziali di accesso',
        html: emailHtml,
      })

      console.log('Email di benvenuto inviata con successo a:', email)
    } catch (emailError) {
      console.error('Errore invio email:', emailError)
      // Non eliminiamo l'utente se l'email fallisce, ma logghiamo l'errore
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Utente invitato con successo',
      userId: authData.user.id 
    })

  } catch (error) {
    console.error('Errore durante l\'invito utente:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
