'use server'

import { signIn } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email e password sono obbligatori' }
  }

  const { error } = await signIn(email, password)
  
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email o password non corretti' }
    } else if (error.message.includes('Email not confirmed')) {
      return { error: 'Email non confermata. Controlla la tua casella di posta.' }
    } else {
      return { error: error.message }
    }
  }

  revalidatePath('/manage')
  redirect('/manage')
}
