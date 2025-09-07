'use server'

import { createSupabaseServerClientMutable } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email è obbligatorio' }
  }

  // Validazione email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Inserisci un indirizzo email valido' }
  }

  try {
    const supabase = await createSupabaseServerClientMutable()
    
    // Registrazione con OTP
    const { error } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-8), // Password temporanea
      options: {
        emailRedirectTo: `${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app' : 'http://localhost:3000'}/register/verify`,
        data: {
          email_confirm: true
        }
      }
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        return { error: 'Email già registrata. Prova ad effettuare il login.' }
      } else if (error.message.includes('Invalid email')) {
        return { error: 'Indirizzo email non valido' }
      } else {
        return { error: error.message }
      }
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

  if (!email || !token) {
    return { error: 'Email e codice di verifica sono obbligatori' }
  }

  try {
    const supabase = await createSupabaseServerClientMutable()
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    })
    
    if (error) {
      if (error.message.includes('Invalid token')) {
        return { error: 'Codice di verifica non valido o scaduto' }
      } else {
        return { error: error.message }
      }
    }

    // Reindirizza alla pagina di gestione dopo la verifica
    redirect('/manage')
  } catch (error) {
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
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NODE_ENV === 'production' ? 'https://larin-mail-ai.vercel.app' : 'http://localhost:3000'}/register/verify`,
      }
    })
    
    if (error) {
      return { error: error.message }
    }

    return { success: true, message: 'Codice di verifica inviato nuovamente' }
  } catch (error) {
    console.error('Errore durante il reinvio:', error)
    return { error: 'Errore durante il reinvio. Riprova.' }
  }
}
