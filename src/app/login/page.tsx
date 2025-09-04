import { getUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import LoginPageClient from './LoginPageClient'

export default async function LoginPage() {
  // Controlla se l'utente è già autenticato
  const user = await getUser()
  if (user) {
    redirect('/manage')
  }

  return <LoginPageClient />
}