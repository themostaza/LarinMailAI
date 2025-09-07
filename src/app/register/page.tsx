import { getUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import RegisterPageClient from './RegisterPageClient'

export default async function RegisterPage() {
  // Controlla se l'utente è già autenticato
  const user = await getUser()
  if (user) {
    redirect('/manage')
  }

  return <RegisterPageClient />
}
