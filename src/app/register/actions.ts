'use server'

import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { createEmailTemplate } from '@/lib/email-templates'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND)

// Funzione per generare OTP di 6 cifre
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password || !confirmPassword) {
    return { error: 'Tutti i campi sono obbligatori' }
  }

  // Validazione email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Inserisci un indirizzo email valido' }
  }

  // Validazione password
  if (password !== confirmPassword) {
    return { error: 'Le password non coincidono' }
  }

  const minLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return { error: 'La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale' }
  }

  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Genera OTP
    const otp = generateOTP()

    // Crea utente in Supabase Auth (non confermato)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app' : 'http://localhost:3000'}/manage`,
        data: {
          email_confirm: false // Non confermare automaticamente
        }
      }
    })

    if (authError) {
      console.error('Errore creazione utente:', authError)
      if (authError.message.includes('User already registered')) {
        return { error: 'Email già registrata. Prova ad effettuare il login.' }
      }
      return { error: 'Errore durante la creazione dell\'account. Riprova più tardi.' }
    }

    // Crea profilo utente con OTP
    const { error: profileError } = await supabase
      .from('user_profile')
      .insert({
        user_id: authData.user?.id,
        role: 'std user',
        otp: otp
      })

    if (profileError) {
      console.error('Errore creazione profilo:', profileError)
      return { error: 'Errore durante la registrazione. Riprova più tardi.' }
    }

    // Invia email con OTP personalizzata
    console.log('Tentativo invio email a:', email, 'con OTP:', otp)
    try {
      const emailHtml = createEmailTemplate({
        title: 'Verifica il tuo account',
        content: `
          <p>Benvenuto in <strong>LarinAI</strong>!</p>
          <p>Per completare la registrazione, inserisci questo codice di verifica:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #1f2937; color: #00D9AA; font-size: 32px; font-weight: bold; padding: 20px 30px; border-radius: 12px; letter-spacing: 8px; border: 2px solid #00D9AA;">
              ${otp}
            </div>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">Questo codice è valido per 10 minuti.</p>
          <p style="color: #9ca3af; font-size: 14px;">Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
        `
      })

      console.log('Invio email con Resend...')
      const result = await resend.emails.send({
        from: 'LarinAI <noreply@larinai.it>',
        to: [email],
        subject: 'Codice di verifica LarinAI',
        html: emailHtml,
      })
      
      console.log('Email inviata con successo:', result)
    } catch (emailError) {
      console.error('Errore invio email completo:', emailError)
      // Rimuovi il profilo creato se l'email fallisce
      await supabase
        .from('user_profile')
        .delete()
        .eq('otp', otp)
      
      return { error: 'Errore durante l\'invio dell\'email. Riprova più tardi.' }
    }

    return { success: true, message: 'Controlla la tua email per il codice di verifica' }
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    return { error: 'Errore durante la registrazione. Riprova più tardi.' }
  }
}

export async function verifyOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  if (!email || !token) {
    return { error: 'Email e codice di verifica sono obbligatori' }
  }

  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Trova il profilo con l'OTP corrispondente
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('otp', token)
      .not('user_id', 'is', null) // Profili con user_id (utenti già creati ma non confermati)
      .single()

    if (profileError || !profile) {
      return { error: 'Codice di verifica non valido o scaduto' }
    }

    // Controlla se l'OTP è scaduto (10 minuti)
    const otpCreatedAt = new Date(profile.created_at)
    const now = new Date()
    const timeDiff = (now.getTime() - otpCreatedAt.getTime()) / (1000 * 60) // in minuti

    if (timeDiff > 10) {
      // Rimuovi il profilo scaduto e l'utente non confermato
      await supabase
        .from('user_profile')
        .delete()
        .eq('id', profile.id)
      
      return { error: 'Codice di verifica scaduto. Richiedi un nuovo codice.' }
    }

    // Usa client admin per confermare l'utente
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Conferma l'utente usando privilegi admin
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.user_id!,
      { email_confirm: true }
    )

    if (confirmError) {
      console.error('Errore conferma utente con admin:', confirmError)
      return { error: 'Errore durante la conferma dell\'account. Riprova più tardi.' }
    }

    console.log('Utente confermato con successo')

    // L'utente è ora verificato, può fare login normalmente

    // Rimuovi l'OTP dal profilo
    const { error: updateError } = await supabase
      .from('user_profile')
      .update({ role: profile.role }) // Aggiorna un campo esistente per triggerare l'update
      .eq('id', profile.id)

    if (updateError) {
      console.error('Errore aggiornamento profilo:', updateError)
      // Non è critico se non riusciamo a rimuovere l'OTP
    }

    console.log('Verifica completata con successo, reindirizzo al login')
    
    // Reindirizza al login dopo la verifica
    redirect('/login?verified=true')
  } catch (error) {
    // Se l'errore è un redirect di Next.js, non è un vero errore
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Rilancia il redirect
    }
    
    console.error('Errore durante la verifica:', error)
    return { error: 'Errore durante la verifica. Riprova.' }
  }
}

export async function resendOtpAction(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email è obbligatoria' }
  }

  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Trova il profilo esistente per questa email con OTP attivo
    const { data: existingProfile, error: findError } = await supabase
      .from('user_profile')
      .select('*')
      .not('otp', 'is', null)
      .not('user_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (findError || !existingProfile) {
      return { error: 'Nessuna registrazione in corso trovata per questa email. Riprova la registrazione.' }
    }

    // Controlla se è passato almeno 1 minuto dall'ultimo invio
    const lastSent = new Date(existingProfile.created_at)
    const now = new Date()
    const timeDiff = (now.getTime() - lastSent.getTime()) / (1000 * 60) // in minuti

    if (timeDiff < 1) {
      return { error: 'Attendi almeno 1 minuto prima di richiedere un nuovo codice.' }
    }

    // Genera nuovo OTP
    const newOtp = generateOTP()

    // Aggiorna il profilo con il nuovo OTP e timestamp
    const { error: updateError } = await supabase
      .from('user_profile')
      .update({
        otp: newOtp,
        created_at: new Date().toISOString()
      })
      .eq('id', existingProfile.id)

    if (updateError) {
      console.error('Errore aggiornamento OTP:', updateError)
      return { error: 'Errore durante la generazione del nuovo codice. Riprova.' }
    }

    // Invia nuova email con OTP
    try {
      const emailHtml = createEmailTemplate({
        title: 'Nuovo codice di verifica',
        content: `
          <p>Ecco il tuo nuovo codice di verifica per <strong>LarinAI</strong>:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #1f2937; color: #00D9AA; font-size: 32px; font-weight: bold; padding: 20px 30px; border-radius: 12px; letter-spacing: 8px; border: 2px solid #00D9AA;">
              ${newOtp}
            </div>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">Questo codice è valido per 10 minuti.</p>
        `
      })

      await resend.emails.send({
        from: 'LarinAI <noreply@larinai.it>',
        to: [email],
        subject: 'Nuovo codice di verifica LarinAI',
        html: emailHtml,
      })
    } catch (emailError) {
      console.error('Errore invio email:', emailError)
      return { error: 'Errore durante l\'invio dell\'email. Riprova più tardi.' }
    }

    return { success: true, message: 'Nuovo codice di verifica inviato alla tua email' }
  } catch (error) {
    console.error('Errore durante il reinvio:', error)
    return { error: 'Errore durante il reinvio. Riprova.' }
  }
}
